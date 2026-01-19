#!/bin/bash

# Simple start script without Docker
cd /home/vin/Desktop/PathFinder

echo "Starting PathFinder development servers..."

# Start backend
echo "Starting backend..."
cd backend
source env/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Start frontend  
echo "Starting frontend..."
cd ../frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo "Backend:  http://127.0.0.1:8000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait