DIY HeyGen-light Worker (Python)

Overview
- Polls backend for queued talking-head jobs
- Generates TTS via ElevenLabs (MP3)
- Tries SadTalker to animate a single image; falls back to ffmpeg still-video
- Uploads MP4 to S3 and reports result

Install
1) Python deps
   pip install -r backend/scripts/requirements.txt

2) ffmpeg (required for fallback)
   - macOS: brew install ffmpeg
   - Ubuntu: sudo apt-get install ffmpeg

3) SadTalker (optional, GPU recommended)
   - Install from upstream repo and ensure the CLI is on PATH as `sadtalker`
   - Or set env `SADTALKER_CMD` to the executable path
   - Download models per upstream instructions

Environment
- BACKEND_URL: http://localhost:5001 (or your deployed URL)
- WORKER_TOKEN: must match backend `WORKER_TOKEN`
- ELEVENLABS_API_KEY: required for TTS
- ELEVENLABS_MODEL_ID: optional, default: eleven_multilingual_v2
- S3_BUCKET, S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
- S3_ENDPOINT: optional for S3-compatible providers
- SADTALKER_CMD: optional path to SadTalker CLI (if not on PATH)
- FFMPEG_CMD: optional path to ffmpeg (if not on PATH)
- FORCE_SADTALKER=true: optional; fail the job if SadTalker is not available or fails (default is to fallback to ffmpeg)
- SADTALKER_ARGS: optional extra args appended to the SadTalker command (default: "--enhancer gfpgan --preprocess full")
- MAX_AUDIO_SECONDS: optional float; trims WAV fed to SadTalker to this duration to control runtime (0 = no trim)

Run
  BACKEND_URL=http://localhost:5001 \
  WORKER_TOKEN=... \
  ELEVENLABS_API_KEY=... \
  S3_BUCKET=... S3_REGION=... \
  AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \
  python3 backend/scripts/worker.py

Install SadTalker (GPU)
- On a Linux GPU host (Ubuntu 20.04/22.04):
  - bash backend/scripts/install_sadtalker.sh --dir /opt/SadTalker --cuda cu121
  - This creates conda env `sadtalker`, installs PyTorch CUDA, clones SadTalker,
    installs requirements, and adds a `/usr/local/bin/sadtalker` wrapper.
  - Test: sadtalker --driven_audio /opt/SadTalker/examples/driven_audio/sample.wav \
          --source_image /opt/SadTalker/examples/source_image/full_body_1.png \
          --result_dir /tmp/sadtalker-test --preprocess full --enhancer gfpgan
  - Then set env for the worker: SADTALKER_CMD=sadtalker, optional SADTALKER_ARGS and MAX_AUDIO_SECONDS.

Notes
- If SadTalker is unavailable, the worker will still produce a valid video by
  muxing the still image with audio via ffmpeg. This is a temporary fallback.
- For production-quality lip-sync, install and validate SadTalker on a GPU box.
  The worker automatically converts MP3 (from ElevenLabs) to WAV for SadTalker input.
  You can point `SADTALKER_CMD` to either a binary on PATH or a full command string,
  e.g. `python /opt/SadTalker/inference.py` and pass extra flags via `SADTALKER_ARGS`.
