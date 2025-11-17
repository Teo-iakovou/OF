# SadTalker Generator Service

This folder wraps the SadTalker pipeline behind a FastAPI microservice that fits into the AI Platform stack. It exposes the `/v1/jobs` API and handles async job orchestration, storage uploads, and optional webhooks.

## Running locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export API_KEY="dev-key"
uvicorn api_app:app --host 0.0.0.0 --port 8080 --reload
```

The service expects SadTalker checkpoints and models to be available. Set `SADTALKER_CHECKPOINT_DIR` to the directory that contains the models (see `backend/scripts/install_sadtalker.sh` for guidance).

## Environment variables

| Variable | Description |
| --- | --- |
| `API_KEYS` / `API_KEY` | Comma-separated list (or single) key that clients must present in the `X-API-Key` header. |
| `API_PUBLIC_BASE_URL` | Optional base URL used to build download links (falls back to request origin). |
| `SADTALKER_CHECKPOINT_DIR` | Path to SadTalker checkpoints. Defaults to `../checkpoints` relative to this file. |
| `SADTALKER_OUTPUT_DIR` | Directory for rendered videos. Defaults to `/workspace/SadTalker/outputs/api`. |
| `STORAGE_PROVIDER` | `s3`, `supabase`, or unset for local paths. |
| `S3_*` / `SUPABASE_*` | Storage provider credentials (optional). |
| `API_LOG_LEVEL` | Logging level (`INFO` by default). |

If `httpx` is installed the service can fire webhooks when jobs finish. Without it, webhook requests are skipped with a warning.

## RunPod / GPU pod quickstart

1. Copy this directory into the pod (e.g., `/workspace/sadtalker_async`).
2. Create a Python 3.9 virtualenv at `/workspace/sadtalker_async/.venv` (or point `SADTALKER_VENV` at your existing env) and install the requirements:

   ```bash
   cd /workspace/sadtalker_async
   python3.9 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

   Install PyTorch, GFPGAN, ffmpeg, and the SadTalker checkpoints the same way you did for the legacy sync app (see `backend/scripts/install_sadtalker.sh` for a baseline).

3. Start the async API with the bundled launcher:

   ```bash
   ./run.sh
   ```

   The script activates the virtualenv, exports sensible defaults, and launches `uvicorn` on port `8888`. Override behaviour with `SADTALKER_VENV`, `API_PORT`, or `UVICORN_ARGS` as needed. Set the pod's start command to `/workspace/sadtalker_async/run.sh` (or keep the pod idle and start it manually).

The service keeps jobs in-memory, so you can stop/start the process without touching the generated videos on disk.

## Kubernetes deployment

Sample manifests live in `backend/deploy/sadtalker-deployment.yaml` and `sadtalker-service.yaml`. They assume:

- A container image published as `your-registry/sadtalker-api:latest`.
- Persistent volume claims named `sadtalker-checkpoints-pvc` and `sadtalker-outputs-pvc` (adjust or remove if you mount data another way).
- API keys and storage credentials stored in the existing `ai-secrets` secret (`SADTALKER_API_KEYS`, optional S3/Supabase values).

Update these manifests to match your cluster (image path, resource requests, GPU requirements) before applying them.

## Platform job queue (BullMQ)

The Next.js BFF now exposes:

- `POST /api/sadtalker/create` — accepts `{ imageUrl, audioUrl, userId, ... }` and enqueues a job in Redis, returning `{ jobId }`.
- `GET /api/sadtalker/status?id=...` — returns `{ state, progress, result, error }` for polling from the UI.

Configure the queue with:

| Variable | Description |
| --- | --- |
| `SADTALKER_REDIS_URL` | Redis connection string used by the queue and workers. |
| `SADTALKER_RUNPOD_ENDPOINTS` | JSON or comma list of RunPod proxies (`url|token|apiKey`). |
| `SADTALKER_WORKER_CONCURRENCY` | Optional, number of concurrent jobs per worker process. |
| `SADTALKER_JOB_TIMEOUT_MS` | Optional, hard timeout for a single generation (default 8 minutes). |
| `SADTALKER_MAX_IMAGE_BYTES` / `SADTALKER_MAX_AUDIO_BYTES` | Size guardrails for downloaded inputs. |
| `SADTALKER_REMOTE_API_KEY` | Optional API key forwarded to the SadTalker pods (defaults to endpoint-specific `apiKey`). |
| `RUNPOD_API_KEY` / `SADTALKER_RUNPOD_API_KEY` | RunPod personal access token used to pull live proxy URLs (optional but recommended). |
| `RUNPOD_ENDPOINT_IDS` | Comma-separated RunPod endpoint IDs to poll dynamically. |
| `SADTALKER_RUNPOD_REFRESH_MS` | Optional interval (ms) to refresh endpoint list (default 60000). |
| `SADTALKER_REMOTE_CREATE_PATH` | Override the remote create path (default `/v1/jobs`; use `/generate_talking_video` for legacy pods). |
| `SADTALKER_REMOTE_STATUS_PATH` | Override the remote status base path (default `/v1/jobs`). |
| `SADTALKER_TOKEN_QUERY` | Set to `true` to send the RunPod token as a `?token=` query parameter instead of an Authorization header. |

When targeting the async FastAPI pod, keep the defaults for `SADTALKER_REMOTE_CREATE_PATH` and `SADTALKER_REMOTE_STATUS_PATH` (both `/v1/jobs`) and enable `SADTALKER_TOKEN_QUERY=true` so the RunPod proxy accepts the token in the query string.

Redis must be reachable from both the Next.js server (for enqueueing) and the worker process.

## Worker process

Run `node backend/services/sadtalker/worker.js` on a background dyno/pod to process the queue. The worker:

1. Downloads the image/audio inputs (enforcing size limits).
2. Chooses a RunPod proxy in round-robin fashion.
3. Uploads the files to the SadTalker pod (`POST /v1/jobs`).
4. Polls `/v1/jobs/{id}` until it resolves, updating BullMQ progress.
5. Returns the remote `videoUrl`, which surfaces through the status endpoint.

Retry/backoff is handled by BullMQ (3 attempts, exponential backoff) and can be tuned in `src/app/api/sadtalker/_lib/queue.ts`. Ensure the worker has the same environment variables listed above plus access to your storage credentials if you plan to post-process the outputs.

### Dynamic RunPod discovery

If `RUNPOD_API_KEY` and `RUNPOD_ENDPOINT_IDS` are provided, the worker fetches the proxy list directly from RunPod every minute (configurable via `SADTALKER_RUNPOD_REFRESH_MS`). This keeps the pool current as pods come and go. You can still provide a static fallback via `SADTALKER_RUNPOD_ENDPOINTS` (comma-separated `url|token|apiKey` or JSON array) in case the API lookup fails.
