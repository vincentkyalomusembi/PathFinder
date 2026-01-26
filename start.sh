#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

API_HOST="${API_HOST:-127.0.0.1}"
API_PORT="${API_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

export VITE_API_URL="${VITE_API_URL:-http://${API_HOST}:${API_PORT}}"

echo "[start] PathFinder Development Server"
echo "[start] Using VITE_API_URL=$VITE_API_URL"

cleanup() {
  echo
  echo "[stop] Shutting down..."
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then kill "$FRONTEND_PID" || true; fi
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then kill "$BACKEND_PID" || true; fi
  echo "[stop] Done."
}
trap cleanup EXIT INT TERM

# Check backend virtual environment
if [[ ! -f "$BACKEND_DIR/env/bin/activate" ]]; then
  echo "[error] Backend virtualenv not found at $BACKEND_DIR/env"
  echo "        Create it with: python3 -m venv backend/env && source backend/env/bin/activate && pip install -r backend/requirements.txt"
  exit 1
fi

# Check frontend dependencies
if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "[error] Frontend dependencies not found"
  echo "        Run: cd frontend && npm install"
  exit 1
fi

echo "[start] Starting backend (uvicorn)..."
(
  cd "$BACKEND_DIR"
  source "$BACKEND_DIR/env/bin/activate"
  exec uvicorn app.main:app --host "$API_HOST" --port "$API_PORT" --reload
) &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

echo "[start] Starting frontend (vite)..."
(
  cd "$FRONTEND_DIR"
  exec npm run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT"
) &
FRONTEND_PID=$!

echo
echo "🚀 PathFinder is running!"
echo "📊 Backend API: http://${API_HOST}:${API_PORT}"
echo "🌐 Frontend:    http://localhost:${FRONTEND_PORT}"
echo "📚 API Docs:    http://${API_HOST}:${API_PORT}/docs"
echo
echo "Press Ctrl+C to stop both servers"

wait "$BACKEND_PID" "$FRONTEND_PID"