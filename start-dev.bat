@echo off
REM FitPulse Local Development Startup Script for Windows
REM This script starts both backend and frontend servers

setlocal enabledelayedexpansion

echo.
echo 🚀 FitPulse - Local Development Startup
echo =======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VER=%%a
echo ✓ Node.js found: %NODE_VER%
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo ⚠ backend\.env not found. Creating from .env.example...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo ✓ Created backend\.env - please update with your credentials
    ) else (
        echo ✗ backend\.env.example not found
    )
)

REM Check if frontend .env.local exists
if not exist "frontend\.env.local" (
    echo ⚠ frontend\.env.local not found. Creating from .env.example...
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env.local" >nul
        echo ✓ Created frontend\.env.local
    ) else (
        echo ✗ frontend\.env.example not found
    )
)

echo.
echo Starting services...
echo.

REM Start backend
echo 📦 Installing backend dependencies...
cd backend
call npm install >nul 2>&1
echo ✓ Backend dependencies installed
echo 🚀 Starting backend server on port 5001...
start "FitPulse Backend" cmd /k npm run dev
cd ..

timeout /t 3 >nul

REM Start frontend
echo 📦 Installing frontend dependencies...
cd frontend
call npm install >nul 2>&1
echo ✓ Frontend dependencies installed
echo 🚀 Starting frontend server on port 3000...
start "FitPulse Frontend" cmd /k npm run dev
cd ..

echo.
echo =======================================
echo ✅ FitPulse is starting!
echo.
echo 📱 Frontend:  http://localhost:3000
echo 🔌 Backend:   http://localhost:5001
echo 📚 API:       http://localhost:5001/api
echo.
echo Test account:
echo   Email: copilot.test+20260429@example.com
echo   Password: TestPass123!
echo.
echo Both services are starting in new windows.
echo Keep these windows open while developing.
echo =======================================
echo.
pause
