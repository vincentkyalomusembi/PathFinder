#!/usr/bin/env bash
set -euo pipefail

echo "[railway] Starting PathFinder production server"

# Install Python dependencies
echo "[railway] Installing backend dependencies..."
cd /app/backend
pip install -r requirements.txt

# Start FastAPI server
echo "[railway] Starting FastAPI server on port $PORT"
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT