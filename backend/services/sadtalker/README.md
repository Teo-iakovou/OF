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
| `SADTALKER_WORKER_CONCURRENCY` | Optional, number of concurrent jobs per worker process. |
| `SADTALKER_JOB_TIMEOUT_MS` | Optional, hard timeout for a single generation (default 8 minutes). |
| `SADTALKER_MAX_IMAGE_BYTES` / `SADTALKER_MAX_AUDIO_BYTES` | Size guardrails for downloaded inputs. |
| `SADTALKER_REMOTE_API_KEY` | Optional API key forwarded to the SadTalker pods (defaults to endpoint-specific `apiKey`). |
| `RUNPOD_API_KEY` | RunPod API key used by the worker to list, start, and stop pods. |
| `RUNPOD_TEMPLATE_ID` | RunPod template that boots the SadTalker FastAPI container. |
| `RUNPOD_VOLUME_ID` | Optional Network Volume ID attached when launching pods. |
| `RUNPOD_GPU_TYPE` / `RUNPOD_GPU_TYPES` | Optional preferred GPU type (single string or comma list ordered by priority). |
| `RUNPOD_IDLE_TIMEOUT_MS` | Idle duration before the worker auto-stops the pod (default 15 minutes). |
| `RUNPOD_POLL_INTERVAL_MS` | Interval between RunPod status polls while waiting for boot (default 10 seconds). |
| `RUNPOD_ENDPOINT_CACHE_MS` | How long to cache the proxy URL before re-validating (default 30 seconds). |
| `SADTALKER_RUNPOD_ENDPOINTS` | Optional static fallback (`url|token|apiKey`) used only if the RunPod API is unavailable. |
| `SADTALKER_REMOTE_CREATE_PATH` | Override the remote create path (default `/v1/jobs`; use `/generate_talking_video` for legacy pods). |
| `SADTALKER_REMOTE_STATUS_PATH` | Override the remote status base path (default `/v1/jobs`). |
| `SADTALKER_TOKEN_QUERY` | Set to `true` to send the RunPod token as a `?token=` query parameter instead of an Authorization header. |

When targeting the async FastAPI pod, keep the defaults for `SADTALKER_REMOTE_CREATE_PATH` and `SADTALKER_REMOTE_STATUS_PATH` (both `/v1/jobs`) and enable `SADTALKER_TOKEN_QUERY=true` so the RunPod proxy accepts the token in the query string.

Redis must be reachable from both the Next.js server (for enqueueing) and the worker process.

## Worker process

Run `node backend/services/sadtalker/worker.js` on a background dyno/pod to process the queue. The worker:

1. Downloads the image/audio inputs (enforcing size limits).
2. Requests a live RunPod proxy from the lifecycle manager (starting a pod if necessary).
3. Uploads the files to the SadTalker pod (`POST /v1/jobs`).
4. Polls `/v1/jobs/{id}` until it resolves, updating BullMQ progress.
5. Returns the remote `videoUrl`, which surfaces through the status endpoint.

Retry/backoff is handled by BullMQ (3 attempts, exponential backoff) and can be tuned in `src/app/api/sadtalker/_lib/queue.ts`. Ensure the worker has the same environment variables listed above plus access to your storage credentials if you plan to post-process the outputs.

### RunPod lifecycle manager

When `RUNPOD_API_KEY` + `RUNPOD_TEMPLATE_ID` are set the worker manages the GPU pod lifecycle automatically:

1. On the first job it calls `GET /v2/pods?templateId=...` to find a running pod.
2. If none exist, it `POST`s to `/v2/pods` (using the template + optional volume) and polls `/v2/pods/{id}` until the proxy is live.
3. Each job reuses the cached proxy URL/token; the cache is revalidated every `RUNPOD_ENDPOINT_CACHE_MS`.
4. An idle watchdog stops the pod via `POST /v2/pods/{id}/stop` once the queue has been quiet for `RUNPOD_IDLE_TIMEOUT_MS`.

If the API call fails (or you are working offline), you can still provide `SADTALKER_RUNPOD_ENDPOINTS` as a static fallback so development can continue without the lifecycle manager.
