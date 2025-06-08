#!/bin/bash
# Simple helper to run backend and frontend together

# start backend
(
  cd backend || exit 1
  uvicorn main:app --reload &
  BACKEND_PID=$!
)

# start frontend
(
  cd frontend || exit 1
  npm install >/dev/null 2>&1
  npm run dev &
  FRONTEND_PID=$!
)

echo "Backend running with PID $BACKEND_PID"
echo "Frontend running with PID $FRONTEND_PID"

wait $BACKEND_PID
wait $FRONTEND_PID
