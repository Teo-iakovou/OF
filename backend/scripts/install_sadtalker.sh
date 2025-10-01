#!/usr/bin/env bash
set -euo pipefail

# SadTalker GPU installer (Ubuntu 20.04/22.04 recommended)
# - Creates a conda env `sadtalker` (installs Miniconda if missing)
# - Installs PyTorch CUDA, clones SadTalker, installs requirements
# - Suggests a wrapper command you can set as SADTALKER_CMD for the worker

# Usage:
#   bash ai-platform/backend/scripts/install_sadtalker.sh [--dir /opt/SadTalker] [--cuda cu121]

DIR="$HOME/SadTalker"
CUDA_TAG="cu121"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) DIR="$2"; shift 2 ;;
    --cuda) CUDA_TAG="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

echo "[SadTalker] Install directory: $DIR"

if ! command -v nvidia-smi >/dev/null 2>&1; then
  echo "[SadTalker] WARNING: nvidia-smi not found. GPU drivers may be missing."
  echo "           Proceeding, but performance will be poor on CPU."
fi

# Ensure conda
if ! command -v conda >/dev/null 2>&1; then
  echo "[SadTalker] Installing Miniconda..."
  TMPD=$(mktemp -d)
  curl -fsSL -o "$TMPD/miniconda.sh" https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
  bash "$TMPD/miniconda.sh" -b -p "$HOME/miniconda3"
  eval "$($HOME/miniconda3/bin/conda shell.bash hook)"
else
  eval "$(conda shell.bash hook)"
fi

echo "[SadTalker] Creating conda env 'sadtalker' (python 3.9)"
conda create -y -n sadtalker python=3.9 >/dev/null
conda activate sadtalker

echo "[SadTalker] Installing PyTorch ($CUDA_TAG)"
pip install --upgrade pip
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/$CUDA_TAG

echo "[SadTalker] Cloning SadTalker into $DIR"
mkdir -p "$DIR"
if [ ! -d "$DIR/.git" ]; then
  git clone https://github.com/OpenTalker/SadTalker.git "$DIR"
else
  echo "[SadTalker] Repo already present; pulling latest..."
  git -C "$DIR" pull --ff-only
fi

echo "[SadTalker] Installing requirements"
pip install -r "$DIR/requirements.txt"

echo "[SadTalker] Downloading/checking model weights (if script exists)"
if [ -f "$DIR/scripts/download_models.sh" ]; then
  bash "$DIR/scripts/download_models.sh" || true
else
  echo "[SadTalker] NOTE: Please follow the SadTalker README to download checkpoints if missing."
fi

echo "[SadTalker] Creating wrapper at /usr/local/bin/sadtalker (requires sudo)"
WRAP="/usr/local/bin/sadtalker"
sudo bash -c "cat > $WRAP" << 'EOS'
#!/usr/bin/env bash
set -euo pipefail
eval "$(conda shell.bash hook)"
conda activate sadtalker >/dev/null
python "REPLACE_DIR/inference.py" "$@"
EOS
sudo sed -i "s#REPLACE_DIR#$DIR#g" "$WRAP"
sudo chmod +x "$WRAP"

echo "[SadTalker] Done. Test the CLI (should produce an MP4):"
echo "  sadtalker --driven_audio \"$DIR\"/examples/driven_audio/sample.wav --source_image \"$DIR\"/examples/source_image/full_body_1.png --result_dir /tmp/sadtalker-test --preprocess full --enhancer gfpgan"
echo
echo "[SadTalker] To use with your worker, export on the GPU host:"
echo "  export SADTALKER_CMD=sadtalker"
echo "  export SADTALKER_ARGS='--enhancer gfpgan --preprocess full'"
echo "  export MAX_AUDIO_SECONDS=15  # optional runtime cap"
echo
echo "[SadTalker] Then run your worker pointing BACKEND_URL/WORKER_TOKEN/S3/ELEVENLABS as before."

