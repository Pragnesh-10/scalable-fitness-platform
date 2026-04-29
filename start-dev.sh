#!/bin/bash

# FitPulse Local Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 FitPulse - Local Development Startup"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install it from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo ""

# Check ports availability
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Port $port is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✓ Port $port is available${NC}"
        return 0
    fi
}

echo "Checking ports..."
check_port 5001 || echo "Run: lsof -i :5001 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
check_port 3000 || echo "Run: lsof -i :3000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
echo ""

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ backend/.env not found. Creating from .env.example...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✓ Created backend/.env - please update with your credentials${NC}"
    else
        echo -e "${RED}✗ backend/.env.example not found${NC}"
    fi
fi

# Check if frontend .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠ frontend/.env.local not found. Creating from .env.example...${NC}"
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env.local
        echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
    else
        echo -e "${RED}✗ frontend/.env.example not found${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}Starting services...${NC}"
echo ""

# Start backend
echo "📦 Installing backend dependencies..."
cd backend
npm install > /dev/null 2>&1
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo "🚀 Starting backend server on port 5001..."
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
cd ..

sleep 2

# Start frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install > /dev/null 2>&1
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo "🚀 Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
cd ..

echo ""
echo "======================================="
echo -e "${GREEN}✅ FitPulse is running!${NC}"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:5001"
echo "📚 API:       http://localhost:5001/api"
echo ""
echo "Test account:"
echo "  Email: copilot.test+20260429@example.com"
echo "  Password: TestPass123!"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "======================================="
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
