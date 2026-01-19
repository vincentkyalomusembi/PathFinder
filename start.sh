#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

API_HOST="${API_HOST:-127.0.0.1}"
API_PORT="${API_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

export VITE_API_URL="${VITE_API_URL:-http://${API_HOST}:${API_PORT}}"

echo "[start] Using VITE_API_URL=$VITE_API_URL"

cleanup() {
  echo
  echo "[stop] Shutting down..."
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then kill "$FRONTEND_PID" || true; fi
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then kill "$BACKEND_PID" || true; fi
  echo "[stop] Done."
}
trap cleanup EXIT INT TERM

if [[ -f "$ROOT_DIR/docker-compose.yml" ]]; then
  echo "[start] Starting Redis via docker compose..."
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    if ! docker compose -f "$ROOT_DIR/docker-compose.yml" up -d redis; then
      echo "[warn] docker compose failed; will try other methods."
    else
      REDIS_STARTED=1
    fi
  elif command -v docker-compose >/dev/null 2>&1; then
    if ! docker-compose -f "$ROOT_DIR/docker-compose.yml" up -d redis; then
      echo "[warn] docker-compose failed (likely permissions); will try other methods."
    else
      REDIS_STARTED=1
    fi
  elif command -v podman-compose >/dev/null 2>&1; then
    if ! podman-compose -f "$ROOT_DIR/docker-compose.yml" up -d redis; then
      echo "[warn] podman-compose failed; will try podman run."
    else
      REDIS_STARTED=1
    fi
  elif command -v podman >/dev/null 2>&1; then
    echo "[start] docker compose not available; starting Redis via podman..."
    # Start (or reuse) a local redis container
    if podman ps --format '{{.Names}}' | grep -qx 'pathfinder-redis'; then
      podman start pathfinder-redis >/dev/null
    elif podman ps -a --format '{{.Names}}' | grep -qx 'pathfinder-redis'; then
      podman start pathfinder-redis >/dev/null
    else
      podman run -d --name pathfinder-redis -p 6379:6379 redis:7-alpine >/dev/null
    fi
    REDIS_STARTED=1
  else
    echo "[warn] No docker/compose/podman found. Skipping Redis start."
  fi

  # If compose existed but failed due to permissions, fall back to podman if present.
  if [[ "${REDIS_STARTED:-0}" != "1" ]] && command -v podman >/dev/null 2>&1; then
    echo "[start] Falling back to podman for Redis..."
    if podman ps --format '{{.Names}}' | grep -qx 'pathfinder-redis'; then
      podman start pathfinder-redis >/dev/null
    elif podman ps -a --format '{{.Names}}' | grep -qx 'pathfinder-redis'; then
      podman start pathfinder-redis >/dev/null
    else
      podman run -d --name pathfinder-redis -p 6379:6379 redis:7-alpine >/dev/null
    fi
    REDIS_STARTED=1
  fi
else
  echo "[warn] No docker-compose.yml found. Skipping Redis start."
fi

if [[ ! -f "$BACKEND_DIR/env/bin/activate" ]]; then
  echo "[error] Backend virtualenv not found at $BACKEND_DIR/env"
  echo "        Create it with: python3 -m venv backend/env && source backend/env/bin/activate && pip install -r backend/requirements.txt"
  exit 1
fi

echo "[start] Starting backend (uvicorn)..."
(
  cd "$BACKEND_DIR"
  # shellcheck disable=SC1091
  source "$BACKEND_DIR/env/bin/activate"
  exec uvicorn app.main:app --host "$API_HOST" --port "$API_PORT" --reload
) &
BACKEND_PID=$!

echo "[start] Starting frontend (vite)..."
(
  cd "$FRONTEND_DIR"
  exec npm run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT"
) &
FRONTEND_PID=$!

echo "[start] Backend:  http://${API_HOST}:${API_PORT}"
echo "[start] Frontend: http://localhost:${FRONTEND_PORT}"
echo "[start] Press Ctrl+C to stop."

wait "$BACKEND_PID" "$FRONTEND_PID"

