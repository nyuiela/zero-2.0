@echo off
echo 🚀 Rebuilding Docker images with optimizations...

REM Stop existing containers
echo 📦 Stopping existing containers...
docker-compose down

REM Remove old images to force rebuild
echo 🗑️  Removing old backend image...
docker rmi car_auction_backend 2>nul || echo Image not found, continuing...

REM Build with no-cache for first time, then use cache
echo 🔨 Building backend image with optimized caching...
docker-compose build --no-cache backend

REM Build frontend
echo 🔨 Building frontend image...
docker-compose build frontend

REM Start services
echo 🚀 Starting services...
docker-compose up -d

echo ✅ Rebuild complete! Services are starting...
echo 📊 Check status with: docker-compose ps
echo 📋 View logs with: docker-compose logs -f

pause 