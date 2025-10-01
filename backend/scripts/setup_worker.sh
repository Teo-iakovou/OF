#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "[setup] Creating Python venv at .venv (if missing)"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi

echo "[setup] Activating venv"
source .venv/bin/activate

echo "[setup] Upgrading pip and installing requirements"
python -m pip install -U pip
pip install -r requirements.txt

echo "[setup] Checking ffmpeg availability"
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "[setup] ffmpeg not found on PATH."
  unameOut="$(uname -s || echo unknown)"
  case "${unameOut}" in
    Darwin*)  echo "[hint] Install with: brew install ffmpeg" ;;
    Linux*)   echo "[hint] Install with: sudo apt-get update && sudo apt-get install -y ffmpeg" ;;
    MINGW*|MSYS*|CYGWIN*) echo "[hint] On Windows: winget install Gyan.FFmpeg or choco install ffmpeg" ;;
    *)        echo "[hint] Please install ffmpeg for your OS and re-run." ;;
  esac
else
  echo "[setup] ffmpeg found: $(command -v ffmpeg)"
fi

echo "[setup] Done. Activate with: source .venv/bin/activate"

