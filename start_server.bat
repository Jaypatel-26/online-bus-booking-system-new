@echo off
title Gujarat Bus Seva - Python Server
color 0A

echo.
echo  ======================================
echo    Gujarat Bus Seva - FastAPI Server
echo  ======================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Install dependencies if needed
echo [1/3] Checking dependencies...
pip install -r requirements.txt --quiet --disable-pip-version-check

echo [2/3] Starting FastAPI server...
echo.
echo  Server URL  : http://localhost:8000
echo  API Docs    : http://localhost:8000/docs
echo  Admin Panel : http://localhost:8000/admin
echo  Health Check: http://localhost:8000/health
echo.
echo  Press Ctrl+C to stop the server
echo.

REM Start uvicorn from project root
python -m uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0

pause
