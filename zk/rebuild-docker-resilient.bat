@echo off
echo 🚀 Rebuilding Docker images with network resilience...

REM Stop existing containers
echo 📦 Stopping existing containers...
docker-compose down

REM Remove old images to force rebuild
echo 🗑️  Removing old backend image...
docker rmi car_auction_backend 2>nul || echo Image not found, continuing...

REM Function to retry Docker build
:retry_build
echo 🔨 Building backend image with retry logic...
docker-compose build --no-cache backend
if %errorlevel% neq 0 (
    echo ❌ Backend build failed, retrying in 30 seconds...
    timeout /t 30 /nobreak >nul
    goto retry_build
)

REM Build frontend with retry
:retry_frontend
echo 🔨 Building frontend image...
docker-compose build frontend
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed, retrying in 30 seconds...
    timeout /t 30 /nobreak >nul
    goto retry_frontend
)

REM Start services with retry
:retry_start
echo 🚀 Starting services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Service startup failed, retrying in 15 seconds...
    timeout /t 15 /nobreak >nul
    goto retry_start
)

echo ✅ Rebuild complete! Services are starting...
echo 📊 Check status with: docker-compose ps
echo 📋 View logs with: docker-compose logs -f

pause 