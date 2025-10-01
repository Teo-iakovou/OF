#!/usr/bin/env bash
set -euo pipefail

# Run the Python worker with env values from backend/.env.local.
# Requires: ffmpeg installed; venv created via setup_worker.sh

cd "$(dirname "$0")"

if [ ! -d .venv ]; then
  echo "[run] venv not found. Run ./setup_worker.sh first." >&2
  exit 1
fi

echo "[run] Activating venv"
source .venv/bin/activate

ENV_FILE="../.env.local"
BASE_ENV="../.env"
if [ -f "$BASE_ENV" ]; then
  echo "[run] Loading base env from $BASE_ENV"
  set -a; . "$BASE_ENV"; set +a
fi

if [ -f "$ENV_FILE" ]; then
  echo "[run] Loading override env from $ENV_FILE"
  set -a; . "$ENV_FILE"; set +a
else
  echo "[run] $ENV_FILE not found. Using base env only (if present)." >&2
fi

# Ensure required variables exist
REQ_VARS=( BACKEND_URL WORKER_TOKEN ELEVENLABS_API_KEY S3_BUCKET S3_REGION AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY )
export BACKEND_URL="${BACKEND_URL:-http://localhost:5001}"

missing=()
for v in "${REQ_VARS[@]}"; do
  if [ -z "${!v:-}" ]; then
    missing+=("$v")
  fi
done

if [ ${#missing[@]} -ne 0 ]; then
  echo "[run] Missing required env vars: ${missing[*]}" >&2
  echo "[run] Set them in $ENV_FILE or export them before running." >&2
  exit 1
fi

echo "[run] Starting worker against $BACKEND_URL"
exec python worker.py
