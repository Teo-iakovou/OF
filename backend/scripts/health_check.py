#!/usr/bin/env python3
import os
import sys
import requests

BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5001")
WORKER_TOKEN = os.environ.get("WORKER_TOKEN", "")

def main():
    if not WORKER_TOKEN:
        print("[health] WORKER_TOKEN not set", file=sys.stderr)
        return 1
    url = f"{BACKEND_URL}/api/render-internal/next-job"
    try:
        r = requests.post(url, headers={"Authorization": f"Bearer {WORKER_TOKEN}"}, timeout=10)
        if r.status_code == 200:
            # OK; body is { job: null | {...} }
            return 0
        print(f"[health] non-200: {r.status_code}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"[health] error: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())

