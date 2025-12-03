import asyncio
import logging
import mimetypes
import os
import shutil
import tempfile
import threading
import uuid
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple

import torch
from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.security import APIKeyHeader
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from src.facerender.animate import AnimateFromCoeff
from src.generate_batch import get_data
from src.generate_facerender_batch import get_facerender_data
from src.test_audio2coeff import Audio2Coeff
from src.utils.init_path import init_path
from src.utils.preprocess import CropAndExtract


# Ensure .mp4 files are always served as video, not audio-only.
mimetypes.add_type("video/mp4", ".mp4")

logger = logging.getLogger("sadtalker_api")
logging.basicConfig(level=os.getenv("API_LOG_LEVEL", "INFO").upper())


class JobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


@dataclass
class JobRecord:
    id: str
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    options: Dict[str, object]
    webhook_url: Optional[str]
    request_base_url: Optional[str]
    result_path: Optional[Path] = None
    storage: Optional[dict] = None
    download_url: Optional[str] = None
    error: Optional[str] = None


class JobResponse(BaseModel):
    id: str
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    download_url: Optional[str] = None
    storage: Optional[dict] = None
    error: Optional[str] = None


def _safe_int_list(values: Optional[str]) -> Optional[List[int]]:
    if values is None:
        return None
    cleaned = [item.strip() for item in values.split(",") if item.strip()]
    return [int(item) for item in cleaned] or None


def _env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "t", "yes", "y"}


def _safe_filename(filename: Optional[str], default_name: str) -> str:
    candidate = Path(filename).name if filename else default_name
    stem = "".join(ch for ch in Path(candidate).stem if ch.isalnum() or ch in "-_")
    if not stem:
        stem = Path(default_name).stem or "file"
    suffix = Path(candidate).suffix or Path(default_name).suffix
    return f"{stem}{suffix}"


def _build_local_download_url(job_id: str, request_base_url: Optional[str]) -> str:
    """
    Build a stable download URL for a job's video.

    Instead of going through /v1/jobs/{id}/download (which relies on in-memory
    job state and breaks across pod restarts), we point directly at the static
    file served from the shared output directory mounted at /files.
    """
    public_base = os.getenv("API_PUBLIC_BASE_URL")

    # OUTPUT_ROOT is something like /workspace/SadTalker/outputs/api
    # STATIC_ROOT is OUTPUT_ROOT.parent (e.g. /workspace/SadTalker/outputs)
    # The video files are stored as OUTPUT_ROOT / f"{job_id}.mp4", so the
    # relative path from STATIC_ROOT is "api/{job_id}.mp4".
    rel_dir = OUTPUT_ROOT.relative_to(STATIC_ROOT)
    relative_path = f"/files/{rel_dir.as_posix()}/{job_id}.mp4"

    if public_base:
        return f"{public_base.rstrip('/')}{relative_path}"
    if request_base_url:
        return f"{request_base_url.rstrip('/')}{relative_path}"
    return relative_path


def _allowed_api_keys() -> Optional[set]:
    keys = os.getenv("API_KEYS") or os.getenv("API_KEY")
    if not keys:
        return None
    return {key.strip() for key in keys.split(",") if key.strip()}


API_KEY_HEADER_NAME = os.getenv("API_KEY_HEADER", "X-API-Key")
api_key_header = APIKeyHeader(name=API_KEY_HEADER_NAME, auto_error=False)


async def require_api_key(api_key: Optional[str] = Depends(api_key_header)) -> None:
    expected_keys = _allowed_api_keys()
    if not expected_keys:
        return
    if not api_key or api_key not in expected_keys:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")


class SadTalkerGenerator:
    """
    Wraps the original inference pipeline while keeping model instances
    in memory so repeated requests do not re-load checkpoints.
    """

    def __init__(
        self,
        checkpoint_dir: Path,
        config_root: Path,
        device: Optional[str] = None,
        default_size: int = 256,
        default_preprocess: str = "full",
        old_version: bool = False,
    ) -> None:
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.default_size = default_size
        self.default_preprocess = default_preprocess
        self.old_version = old_version

        self.config_root = config_root
        self.checkpoint_dir = checkpoint_dir

        self._lock = threading.Lock()
        self._initialize_models()

    def _initialize_models(self) -> None:
        paths = init_path(
            str(self.checkpoint_dir),
            str(self.config_root),
            self.default_size,
            self.old_version,
            self.default_preprocess,
        )
        self.preprocess_model = CropAndExtract(paths, self.device)
        self.audio2coeff = Audio2Coeff(paths, self.device)
        self.animate_from_coeff = AnimateFromCoeff(paths, self.device)

    def generate(
        self,
        source_image: Path,
        driven_audio: Path,
        result_root: Path,
        preprocess: Optional[str] = None,
        enhancer: Optional[str] = None,
        background_enhancer: Optional[str] = None,
        expression_scale: float = 1.0,
        pose_style: int = 0,
        batch_size: int = 2,
        still: bool = False,
        input_yaw: Optional[List[int]] = None,
        input_pitch: Optional[List[int]] = None,
        input_roll: Optional[List[int]] = None,
        keep_intermediate: bool = False,
    ) -> Path:
        preprocess = preprocess or self.default_preprocess
        result_root.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.utcnow().strftime("%Y_%m_%d_%H.%M.%S")
        run_dir = result_root / timestamp
        run_dir.mkdir(parents=True, exist_ok=True)

        with self._lock:
            first_frame_dir = run_dir / "first_frame_dir"
            first_frame_dir.mkdir(exist_ok=True)
            first_coeff_path, crop_pic_path, crop_info = self.preprocess_model.generate(
                str(source_image),
                str(first_frame_dir),
                preprocess,
                source_image_flag=True,
                pic_size=self.default_size,
            )
            if first_coeff_path is None:
                raise RuntimeError("Failed to extract coefficients from source image.")

            batch = get_data(
                first_coeff_path,
                str(driven_audio),
                self.device,
                ref_eyeblink_coeff_path=None,
                still=still,
            )
            coeff_path = self.audio2coeff.generate(
                batch, str(run_dir), pose_style, ref_pose_coeff_path=None
            )

            data = get_facerender_data(
                coeff_path,
                crop_pic_path,
                first_coeff_path,
                str(driven_audio),
                batch_size,
                input_yaw,
                input_pitch,
                input_roll,
                expression_scale=expression_scale,
                still_mode=still,
                preprocess=preprocess,
                size=self.default_size,
            )
            result_video_path = self.animate_from_coeff.generate(
                data,
                str(run_dir),
                str(source_image),
                crop_info,
                enhancer=enhancer,
                background_enhancer=background_enhancer,
                preprocess=preprocess,
                img_size=self.default_size,
            )

        final_video_path = run_dir.with_suffix(".mp4")
        shutil.move(result_video_path, final_video_path)

        if not keep_intermediate:
            shutil.rmtree(run_dir, ignore_errors=True)

        return final_video_path


def prepare_storage_upload(file_path: Path) -> Tuple[dict, Callable[[], None]]:
    provider = os.getenv("STORAGE_PROVIDER")
    if not provider:
        return {"provider": "local", "path": str(file_path.resolve())}, lambda: None

    provider = provider.lower()
    if provider == "s3":
        return prepare_s3_upload(file_path)
    if provider == "supabase":
        return prepare_supabase_upload(file_path)
    raise RuntimeError(f"Unsupported STORAGE_PROVIDER '{provider}'.")


def prepare_s3_upload(file_path: Path) -> Tuple[dict, Callable[[], None]]:
    try:
        import boto3
        from botocore.config import Config
    except ImportError as exc:
        raise RuntimeError(
            "boto3 is required for S3 uploads. Install it in your environment."
        ) from exc

    bucket = os.getenv("S3_BUCKET")
    if not bucket:
        raise RuntimeError("S3_BUCKET environment variable is not set.")

    prefix = os.getenv("S3_PREFIX", "sadtalker")
    key = f"{prefix.rstrip('/')}/{file_path.name}"

    region = os.getenv("S3_REGION", "auto")
    endpoint = os.getenv("S3_ENDPOINT")
    access_key = os.getenv("AWS_ACCESS_KEY_ID")
    secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

    extra_args = {"ContentType": "video/mp4"}

    def uploader() -> None:
        session = boto3.session.Session()
        client_kwargs = {
            "region_name": region,
            "endpoint_url": endpoint or None,
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "config": Config(signature_version="s3v4"),
        }
        client = session.client("s3", **client_kwargs)
        client.upload_file(str(file_path), bucket, key, ExtraArgs=extra_args)

    base_url = os.getenv("S3_BASE_URL")
    if not base_url:
        region_env = os.getenv("AWS_REGION")
        if endpoint and "r2.cloudflarestorage.com" in endpoint:
            base_url = f"{endpoint.rstrip('/')}/{bucket}"
        elif region_env:
            base_url = f"https://{bucket}.s3.{region_env}.amazonaws.com"
        else:
            base_url = f"https://{bucket}.s3.amazonaws.com"

    url = f"{base_url.rstrip('/')}/{key}"
    metadata = {"provider": "s3", "bucket": bucket, "key": key, "url": url}
    return metadata, uploader


def prepare_supabase_upload(file_path: Path) -> Tuple[dict, Callable[[], None]]:
    try:
        from supabase import create_client
    except ImportError as exc:
        raise RuntimeError(
            "supabase-py is required for Supabase uploads. Install it in your environment."
        ) from exc

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set for Supabase uploads.")

    bucket = os.getenv("SUPABASE_BUCKET", "sadtalker")
    prefix = os.getenv("SUPABASE_PREFIX", "videos")
    key = f"{prefix.rstrip('/')}/{file_path.name}"

    client = create_client(supabase_url, supabase_key)
    storage = client.storage.from_(bucket)
    public_url = storage.get_public_url(key)

    def uploader() -> None:
        with open(file_path, "rb") as fh:
            storage.upload(key, fh, {"content-type": "video/mp4", "upsert": True})

    metadata = {"provider": "supabase", "bucket": bucket, "path": key, "url": public_url}
    return metadata, uploader


app = FastAPI(title="SadTalker Generator API", version="1.0.0")

if _env_bool("API_ENABLE_CORS", True):
    allow_origins = os.getenv("API_CORS_ALLOW_ORIGINS", "*").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in allow_origins],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


generator: SadTalkerGenerator
jobs: Dict[str, JobRecord] = {}
jobs_lock = threading.Lock()
OUTPUT_ROOT = Path(os.getenv("SADTALKER_OUTPUT_DIR", "/workspace/SadTalker/outputs/api"))
STATIC_ROOT = OUTPUT_ROOT.parent
STATIC_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/files", StaticFiles(directory=str(STATIC_ROOT)), name="files")


def _update_job(job_id: str, **changes: object) -> JobRecord:
    with jobs_lock:
        job = jobs[job_id]
        for key, value in changes.items():
            setattr(job, key, value)
        job.updated_at = datetime.utcnow()
        return job


def _get_job(job_id: str) -> JobRecord:
    with jobs_lock:
        job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job


def _job_to_response(job: JobRecord, base_url: Optional[str]) -> JobResponse:
    download_url = job.download_url
    if not download_url and job.result_path:
        download_url = _build_local_download_url(job.id, job.request_base_url or base_url)
    return JobResponse(
        id=job.id,
        status=job.status,
        created_at=job.created_at,
        updated_at=job.updated_at,
        download_url=download_url,
        storage=job.storage,
        error=job.error,
    )


async def _dispatch_webhook(job: JobRecord) -> None:
    if not job.webhook_url:
        return
    try:
        import httpx
    except ImportError:
        logger.warning(
            "Webhook requested for job %s but httpx is not installed. Skipping callback.",
            job.id,
        )
        return

    model = _job_to_response(job, job.request_base_url)
    # Ensure datetimes/paths/etc. are JSON-serializable before sending.
    payload = jsonable_encoder(model)
    payload["job_id"] = payload.pop("id")
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(job.webhook_url, json=payload)
    except Exception as exc:
        logger.warning("Webhook dispatch failed for job %s: %s", job.id, exc)


async def _run_job(job_id: str, source_path: Path, audio_path: Path, options: Dict[str, object]) -> None:
    job = _update_job(job_id, status=JobStatus.RUNNING)
    try:
        final_video_path = await run_in_threadpool(
            generator.generate,
            source_path,
            audio_path,
            OUTPUT_ROOT,
            options.get("preprocess"),
            options.get("enhancer"),
            options.get("background_enhancer"),
            options.get("expression_scale"),
            options.get("pose_style"),
            options.get("batch_size"),
            options.get("still"),
            options.get("input_yaw"),
            options.get("input_pitch"),
            options.get("input_roll"),
            options.get("keep_intermediate"),
        )

        target_path = OUTPUT_ROOT / f"{job_id}.mp4"
        target_path.parent.mkdir(parents=True, exist_ok=True)
        if target_path.exists():
            target_path.unlink()
        if target_path != final_video_path:
            shutil.move(str(final_video_path), str(target_path))
        else:
            target_path = final_video_path

        storage_info, uploader = prepare_storage_upload(target_path)
        await run_in_threadpool(uploader)

        download_url = storage_info.get("url")
        if not download_url:
            download_url = _build_local_download_url(job_id, job.request_base_url)

        job = _update_job(
            job_id,
            status=JobStatus.SUCCEEDED,
            result_path=target_path,
            storage=storage_info,
            download_url=download_url,
            error=None,
        )
        await _dispatch_webhook(job)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Job %s failed", job_id, exc_info=exc)
        job = _update_job(job_id, status=JobStatus.FAILED, error=str(exc))
        await _dispatch_webhook(job)
    finally:
        shutil.rmtree(source_path.parent, ignore_errors=True)


@app.on_event("startup")
def _startup() -> None:
    global generator
    project_root = Path(__file__).resolve().parent
    checkpoint_dir = Path(os.getenv("SADTALKER_CHECKPOINT_DIR", project_root / "checkpoints"))
    config_root = project_root / "src" / "config"
    default_size = int(os.getenv("SADTALKER_DEFAULT_SIZE", "256"))
    default_preprocess = os.getenv("SADTALKER_DEFAULT_PREPROCESS", "full")
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    generator = SadTalkerGenerator(
        checkpoint_dir=checkpoint_dir,
        config_root=config_root,
        default_size=default_size,
        default_preprocess=default_preprocess,
        old_version=_env_bool("SADTALKER_USE_OLD_VERSION", False),
    )


@app.post("/v1/jobs", response_model=JobResponse)
async def create_job(
    request: Request,
    _: None = Depends(require_api_key),
    source_image: UploadFile = File(...),
    driven_audio: UploadFile = File(...),
    preprocess: str = Form("full"),
    enhancer: Optional[str] = Form(None),
    background_enhancer: Optional[str] = Form(None),
    expression_scale: float = Form(1.0),
    pose_style: int = Form(0),
    batch_size: int = Form(2),
    still: bool = Form(False),
    input_yaw: Optional[str] = Form(None),
    input_pitch: Optional[str] = Form(None),
    input_roll: Optional[str] = Form(None),
    keep_intermediate: bool = Form(False),
    webhook_url: Optional[str] = Form(None),
) -> JobResponse:
    if source_image.content_type and not source_image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="source_image must be an image file.")
    if driven_audio.content_type and not driven_audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="driven_audio must be an audio file.")

    yaw_list = _safe_int_list(input_yaw)
    pitch_list = _safe_int_list(input_pitch)
    roll_list = _safe_int_list(input_roll)

    job_id = uuid.uuid4().hex
    created_at = datetime.utcnow()
    options: Dict[str, object] = {
        "preprocess": preprocess,
        "enhancer": enhancer,
        "background_enhancer": background_enhancer,
        "expression_scale": expression_scale,
        "pose_style": pose_style,
        "batch_size": batch_size,
        "still": still,
        "input_yaw": yaw_list,
        "input_pitch": pitch_list,
        "input_roll": roll_list,
        "keep_intermediate": keep_intermediate,
    }

    job = JobRecord(
        id=job_id,
        status=JobStatus.QUEUED,
        created_at=created_at,
        updated_at=created_at,
        options=options,
        webhook_url=webhook_url,
        request_base_url=str(request.base_url).rstrip("/"),
    )

    with jobs_lock:
        jobs[job_id] = job

    temp_dir = Path(tempfile.mkdtemp(prefix=f"sadtalker_job_{job_id}_"))
    source_path = temp_dir / _safe_filename(source_image.filename, "source.png")
    audio_path = temp_dir / _safe_filename(driven_audio.filename, "audio.wav")

    source_bytes = await source_image.read()
    audio_bytes = await driven_audio.read()

    with open(source_path, "wb") as src_fh:
        src_fh.write(source_bytes)
    with open(audio_path, "wb") as aud_fh:
        aud_fh.write(audio_bytes)

    asyncio.create_task(_run_job(job_id, source_path, audio_path, options))

    return _job_to_response(job, job.request_base_url)


@app.get("/v1/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str, request: Request, _: None = Depends(require_api_key)) -> JobResponse:
    job = _get_job(job_id)
    return _job_to_response(job, str(request.base_url).rstrip("/"))


@app.get("/v1/jobs/{job_id}/download")
async def download_job(job_id: str, _: None = Depends(require_api_key)) -> FileResponse:
    job = _get_job(job_id)
    if job.status != JobStatus.SUCCEEDED or not job.result_path:
        raise HTTPException(status_code=404, detail="Result not available.")
    return FileResponse(
        job.result_path,
        media_type="video/mp4",
        filename=job.result_path.name,
    )


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.get("/healthz", include_in_schema=False)
def healthz() -> JSONResponse:
    return JSONResponse({"status": "ok"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api_app:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", "8080")),
        reload=_env_bool("API_RELOAD", False),
    )
