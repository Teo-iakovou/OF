#!/usr/bin/env python3
"""
DIY HeyGen-light worker

Leases talking-head jobs from the backend, generates speech (ElevenLabs),
animates a single image via SadTalker if available (GPU recommended),
falls back to a simple still-video with subtle zoom using ffmpeg, uploads to S3,
and reports the result back.

Env vars required:
  BACKEND_URL           e.g. http://localhost:5001
  WORKER_TOKEN          shared secret matching backend's WORKER_TOKEN
  ELEVENLABS_API_KEY    for TTS (required unless you replace with your own)
  ELEVENLABS_MODEL_ID   optional, default: eleven_multilingual_v2

  S3_BUCKET, S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  S3_ENDPOINT           optional (for non-AWS S3-compatible)

Optional:
  SADTALKER_CMD         path to SadTalker CLI entry (if installed)
  FFMPEG_CMD            path to ffmpeg (defaults to 'ffmpeg')

Usage:
  python3 backend/scripts/worker.py
"""

import os
import io
import sys
import time
import json
import shutil
import tempfile
import subprocess
import shlex
from typing import Optional

import boto3
import requests


BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5001")
WORKER_TOKEN = os.environ.get("WORKER_TOKEN", "")
ELEVEN_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
ELEVEN_MODEL = os.environ.get("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")

S3_BUCKET = os.environ.get("S3_BUCKET")
S3_REGION = os.environ.get("S3_REGION", "us-east-1")
S3_ENDPOINT = os.environ.get("S3_ENDPOINT")

SADTALKER_CMD = os.environ.get("SADTALKER_CMD", "sadtalker")
FFMPEG_CMD = os.environ.get("FFMPEG_CMD", "ffmpeg")
FORCE_SADTALKER = os.environ.get("FORCE_SADTALKER", "false").lower() == "true"
SADTALKER_ARGS = os.environ.get("SADTALKER_ARGS", "--enhancer gfpgan --preprocess full")
MAX_AUDIO_SECONDS = float(os.environ.get("MAX_AUDIO_SECONDS", "0"))  # 0 = no trim

VOICE_MAP = {
    # Map UI voice ids to ElevenLabs voice ids.
    # Replace with your preferred voices.
    "en_male_1": "EXAVITQu4vr4xnSDxMaL",   # Adam (example)
    "en_female_1": "21m00Tcm4TlvDq8ikWAM", # Rachel
}


def log(msg: str, **kwargs):
    payload = {"msg": msg, **kwargs}
    print(json.dumps(payload, ensure_ascii=False))
    sys.stdout.flush()


def ensure_env():
    missing = []
    if not WORKER_TOKEN:
        missing.append("WORKER_TOKEN")
    if not S3_BUCKET:
        missing.append("S3_BUCKET")
    if missing:
        raise RuntimeError(f"Missing required env vars: {', '.join(missing)}")


def s3_client():
    session = boto3.session.Session()
    return session.client(
        "s3",
        region_name=S3_REGION,
        endpoint_url=S3_ENDPOINT or None,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    )


def lease_job() -> Optional[dict]:
    url = f"{BACKEND_URL}/api/render-internal/next-job"
    r = requests.post(url, headers={"Authorization": f"Bearer {WORKER_TOKEN}"}, timeout=20)
    r.raise_for_status()
    return r.json().get("job")


def report_result(job_id: str, status: str, output: Optional[dict] = None, error: Optional[str] = None, timings: Optional[dict] = None):
    url = f"{BACKEND_URL}/api/render-internal/job-result/{job_id}"
    body = {"status": status}
    if output is not None:
        body["output"] = output
    if error is not None:
        body["error"] = error
    if timings is not None:
        body["timings"] = timings
    r = requests.post(url, json=body, headers={"Authorization": f"Bearer {WORKER_TOKEN}"}, timeout=30)
    r.raise_for_status()


def download_to(path: str, url: str):
    with requests.get(url, stream=True, timeout=30) as r:
        r.raise_for_status()
        with open(path, "wb") as f:
            shutil.copyfileobj(r.raw, f)


def elevenlabs_tts(text: str, voice_id: Optional[str], out_path: str) -> None:
    if not ELEVEN_API_KEY:
        raise RuntimeError("ELEVENLABS_API_KEY not set")
    eid = VOICE_MAP.get(voice_id or "", voice_id or VOICE_MAP.get("en_female_1"))
    if not eid:
        eid = VOICE_MAP.get("en_female_1")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{eid}?optimize_streaming_latency=3&output_format=mp3_44100_128"
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        # Avoid gzip-compressed payloads; some proxies return gzipped audio otherwise
        "Accept-Encoding": "identity",
    }
    payload = {"text": text, "model_id": ELEVEN_MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}
    with requests.post(url, headers=headers, json=payload, stream=True, timeout=60) as r:
        ct = (r.headers.get("content-type") or "").lower()
        if r.status_code >= 300 or ("audio" not in ct):
            # Read a small body for diagnostics
            try:
                preview = r.text[:300]
            except Exception:
                preview = "<unreadable>"
            raise RuntimeError(
                f"ElevenLabs TTS failed or returned non-audio (status={r.status_code}, content-type={ct}): {preview}"
            )
        # Write response using iter_content so requests handles decompression
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    # Validate non-empty audio
    try:
        if os.path.getsize(out_path) < 1024:
            raise RuntimeError("TTS produced empty/too-small audio output")
        # Peek at header to ensure plausible MP3 (ID3 or 0xFF sync) or WAV RIFF
        with open(out_path, "rb") as f:
            head = f.read(12)
        valid = False
        if len(head) >= 4:
            if head[0:3] == b"ID3":
                valid = True
            elif head[0] == 0xFF and (head[1] & 0xE0) == 0xE0:
                valid = True  # MPEG audio frame sync
            elif len(head) >= 12 and head[0:4] == b"RIFF" and head[8:12] == b"WAVE":
                valid = True
        if not valid:
            from binascii import hexlify
            raise RuntimeError(
                f"TTS returned unexpected header: {hexlify(head).decode('ascii')} (size={os.path.getsize(out_path)})"
            )
    except FileNotFoundError:
        raise RuntimeError("TTS audio file missing after download")


def has_binary(bin_name: str) -> bool:
    return shutil.which(bin_name) is not None


def try_sadtalker(image_path: str, audio_wav_path: str, out_path: str) -> bool:
    """Attempt to run SadTalker CLI; return True on success."""
    # We detect CLI presence either via SADTALKER_CMD or 'sadtalker' on PATH
    # Allow SADTALKER_CMD to be either a binary on PATH or a full command string (e.g., "python /path/to/inference.py")
    cmd = None
    if os.path.isfile(SADTALKER_CMD) or os.path.sep in SADTALKER_CMD:
        cmd = SADTALKER_CMD
    elif has_binary(SADTALKER_CMD):
        cmd = SADTALKER_CMD
    if not cmd:
        # maybe it's on PATH under default name
        if not has_binary("sadtalker"):
            return False
        cmd = "sadtalker"

    # Minimal invocation; adjust flags to your install/model paths as needed.
    # This assumes SadTalker has models downloaded to its default cache.
    # Output directory will contain a file named 'result.mp4' or similar; we will rename to out_path.
    with tempfile.TemporaryDirectory() as tmpd:
        # Build command: split command string then append standard args and optional extra args
        args = shlex.split(cmd)
        args += shlex.split(SADTALKER_ARGS) if SADTALKER_ARGS else []
        args += [
            "--driven_audio", audio_wav_path,
            "--source_image", image_path,
            "--result_dir", tmpd,
        ]
        try:
            subprocess.run(args, check=True)
        except subprocess.CalledProcessError as e:
            log("sadtalker_failed", returncode=e.returncode)
            return False
        # Find the first mp4 under tmpd
        cand = None
        for root, _, files in os.walk(tmpd):
            for fn in files:
                if fn.lower().endswith(".mp4"):
                    cand = os.path.join(root, fn)
                    break
            if cand:
                break
        if not cand:
            return False
        shutil.move(cand, out_path)
        return True


def ffmpeg_still_with_audio(image_path: str, audio_path: str, out_path: str):
    if not has_binary(FFMPEG_CMD):
        raise RuntimeError("ffmpeg not found; set FFMPEG_CMD or install ffmpeg")
    # Create a simple still video with audio, 1080p, yuv420p, shortest duration equals audio length
    args = [
        FFMPEG_CMD,
        "-y",
        "-loop", "1",
        "-i", image_path,
        "-i", audio_path,
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min(1080,iw)':-2",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        out_path,
    ]
    subprocess.run(args, check=True)


def ffmpeg_any_to_wav(input_path: str, wav_path: str):
    if not has_binary(FFMPEG_CMD):
        raise RuntimeError("ffmpeg not found; set FFMPEG_CMD or install ffmpeg")
    args = [
        FFMPEG_CMD,
        "-y",
        "-i", input_path,
        "-ac", "1",
        "-ar", "16000",
        wav_path,
    ]
    subprocess.run(args, check=True)


def ffmpeg_trim_wav(input_wav: str, output_wav: str, max_seconds: float):
    if max_seconds <= 0:
        # Just copy
        shutil.copyfile(input_wav, output_wav)
        return
    if not has_binary(FFMPEG_CMD):
        raise RuntimeError("ffmpeg not found; set FFMPEG_CMD or install ffmpeg")
    args = [
        FFMPEG_CMD,
        "-y",
        "-t", str(max_seconds),
        "-i", input_wav,
        "-acodec", "pcm_s16le",
        "-ac", "1",
        "-ar", "16000",
        output_wav,
    ]
    subprocess.run(args, check=True)


def process_job(job: dict):
    job_id = job.get("id")
    kind = job.get("kind")
    if kind != "talking-head":
        raise RuntimeError(f"Unsupported job kind: {kind}")
    inp = job.get("input") or {}
    text = inp.get("text") or ""
    voice_id = inp.get("voiceId")
    image_url = job.get("imageUrl")
    audio_url = job.get("audioUrl")
    if not image_url:
        # Backend includes signed URL for convenience; if missing, fail fast
        raise RuntimeError("imageUrl not provided in lease response")

    t0 = time.time()
    with tempfile.TemporaryDirectory() as tmpd:
        img_path = os.path.join(tmpd, "image")
        aud_raw = os.path.join(tmpd, "audio.raw")
        wav_path = os.path.join(tmpd, "audio.wav")
        wav_trimmed = os.path.join(tmpd, "audio_trim.wav")
        vid_path = os.path.join(tmpd, "out.mp4")

        # Download image
        download_to(img_path, image_url)

        # Audio: prefer provided audioUrl; else perform TTS
        t_tts0 = time.time()
        if audio_url:
            download_to(aud_raw, audio_url)
        else:
            elevenlabs_tts(text, voice_id, aud_raw)
        t_tts1 = time.time()

        # Try SadTalker (requires WAV), else fallback to ffmpeg still
        t_anim0 = time.time()
        used_sadtalker = False
        try:
            # Only attempt SadTalker if present or explicitly forced
            if FORCE_SADTALKER or has_binary(SADTALKER_CMD) or has_binary("sadtalker"):
                # Convert unknown audio to WAV for SadTalker and optionally trim
                ffmpeg_any_to_wav(aud_raw, wav_path)
                ffmpeg_trim_wav(wav_path, wav_trimmed, MAX_AUDIO_SECONDS)
                used_sadtalker = try_sadtalker(img_path, wav_trimmed if MAX_AUDIO_SECONDS > 0 else wav_path, vid_path)
        except Exception as e:
            log("sadtalker_prepare_failed", error=str(e))

        if not used_sadtalker:
            if FORCE_SADTALKER:
                raise RuntimeError("SadTalker required but unavailable or failed")
            # Convert to WAV for mux as well; works regardless of original format
            try:
                ffmpeg_any_to_wav(aud_raw, wav_path)
            except Exception as e:
                raise RuntimeError(f"Audio missing/invalid; cannot convert for mux: {e}")
            # Guard: ensure audio exists and is non-empty before muxing
            if not os.path.exists(wav_path) or os.path.getsize(wav_path) < 1024:
                raise RuntimeError("Audio missing/invalid; cannot mux still video")
            ffmpeg_still_with_audio(img_path, wav_path, vid_path)
        t_anim1 = time.time()

        # Upload to S3
        t_up0 = time.time()
        s3 = s3_client()
        # outputs/<user_or_ns>/<ts>.mp4 (mirror stub pattern)
        ns = (inp.get("imageKey") or "user").split("/")
        if len(ns) > 1:
            ns = ns[1]
        else:
            ns = ns[0]
        out_key = f"outputs/{ns}/{int(time.time()*1000)}.mp4"
        with open(vid_path, "rb") as f:
            s3.put_object(Bucket=S3_BUCKET, Key=out_key, Body=f.read(), ContentType="video/mp4")
        t_up1 = time.time()

    timings = {
        "tts_ms": int((t_tts1 - t_tts0) * 1000),
        "sadtalker_ms": int((t_anim1 - t_anim0) * 1000),
        "upload_ms": int((t_up1 - t_up0) * 1000),
    }

    output = {"videoKey": out_key, "durationSec": None}
    report_result(job_id, "succeeded", output=output, timings=timings)


def main_loop():
    ensure_env()
    log("worker_start", backend=BACKEND_URL)
    while True:
        try:
            job = lease_job()
            if not job:
                time.sleep(4.0)
                continue
            log("job_start", id=job.get("id"))
            try:
                process_job(job)
                log("job_done", id=job.get("id"))
            except Exception as e:
                err = str(e)
                log("job_error", id=job.get("id"), error=err)
                try:
                    report_result(job.get("id"), "failed", error=err)
                except Exception:
                    pass
                # small backoff to avoid hot-looping on a broken job
                time.sleep(1.0)
        except requests.RequestException as e:
            log("poll_error", error=str(e))
            time.sleep(5.0)
        except Exception as e:
            log("fatal_error", error=str(e))
            time.sleep(5.0)


if __name__ == "__main__":
    main_loop()
