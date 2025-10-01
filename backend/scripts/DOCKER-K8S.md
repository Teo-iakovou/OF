Worker Docker & Kubernetes

Docker (CPU)
- Build: `docker build -f backend/scripts/Dockerfile.worker -t your-registry/ai-worker:latest .`
- Run:
  docker run --rm \
    -e BACKEND_URL=http://host.docker.internal:5001 \
    -e WORKER_TOKEN=... \
    -e ELEVENLABS_API_KEY=... \
    -e S3_BUCKET=... -e S3_REGION=... \
    -e AWS_ACCESS_KEY_ID=... -e AWS_SECRET_ACCESS_KEY=... \
    your-registry/ai-worker:latest

Kubernetes
- Edit image in `backend/deploy/worker-deployment.yaml`.
- Create secrets `ai-secrets` with keys: `WORKER_TOKEN`, `ELEVENLABS_API_KEY`, `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- Apply:
  kubectl apply -f backend/deploy/worker-deployment.yaml
  kubectl apply -f backend/deploy/worker-hpa.yaml

GPU Notes
- For SadTalker lip-sync, build a GPU-enabled image (e.g., NVIDIA CUDA base), install SadTalker using `backend/scripts/install_sadtalker.sh`, and set `SADTALKER_CMD`.
- Request GPU in Deployment spec and ensure nodes have NVIDIA device plugin.

