#!/usr/bin/env bash
set -euo pipefail

SERVICE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${SADTALKER_VENV:-${SERVICE_ROOT}/.venv}"

if [[ ! -d "${VENV_DIR}" ]]; then
  echo "[sadtalker/run.sh] virtualenv not found at ${VENV_DIR}" >&2
  echo "  Create it with: python3 -m venv ${VENV_DIR}" >&2
  exit 1
fi

if [[ ! -x "${VENV_DIR}/bin/activate" ]]; then
  echo "[sadtalker/run.sh] ${VENV_DIR} does not look like a Python virtualenv." >&2
  exit 1
fi

# shellcheck source=/dev/null
source "${VENV_DIR}/bin/activate"

export PYTHONPATH="${PYTHONPATH:-${SERVICE_ROOT}}"
export API_HOST="${API_HOST:-0.0.0.0}"
export API_PORT="${API_PORT:-8888}"

cd "${SERVICE_ROOT}"

UVICORN_BIN="${UVICORN_BIN:-uvicorn}"
APP_IMPORT_PATH="${SADTALKER_APP:-api_app:app}"
EXTRA_ARGS=()
if [[ -n "${UVICORN_ARGS:-}" ]]; then
  # shellcheck disable=SC2206
  EXTRA_ARGS=(${UVICORN_ARGS})
fi

exec "${UVICORN_BIN}" "${APP_IMPORT_PATH}" --host "${API_HOST}" --port "${API_PORT}" "${EXTRA_ARGS[@]}"
