#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE="../.env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo "[health] $ENV_FILE not found. Create it and add WORKER_TOKEN and BACKEND_URL (optional)." >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

export BACKEND_URL="${BACKEND_URL:-http://localhost:5001}"

if [ -z "${WORKER_TOKEN:-}" ]; then
  echo "[health] WORKER_TOKEN not set in $ENV_FILE" >&2
  exit 1
fi

node health-check.js

