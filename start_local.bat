@echo off
echo Starting backend server...
start cmd /k "cd backend && conda activate env bakery && python -m uvicorn main:app --reload"

echo Starting frontend server...
start cmd /k "cd frontend && npm run dev"

echo Servers started. Press any key to stop all servers.
pause
taskkill /f /im node.exe
taskkill /f /im python.exe
