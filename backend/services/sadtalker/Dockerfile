# syntax=docker/dockerfile:1

FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code. Mount checkpoints/output at runtime.
COPY api_app.py ./api_app.py
COPY run.sh ./run.sh

ENV API_HOST=0.0.0.0 \
    API_PORT=8888

EXPOSE 8888
CMD ["uvicorn", "api_app:app", "--host", "0.0.0.0", "--port", "8888"]
