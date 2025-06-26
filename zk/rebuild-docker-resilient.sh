#!/bin/bash
set -e

echo "🚀 Rebuilding Docker images with network resilience..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Remove old images to force rebuild
echo "🗑️  Removing old backend image..."
docker rmi car_auction_backend 2>/dev/null || echo "Image not found, continuing..."

# Function to retry Docker build
retry_build() {
    local max_attempts=5
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "🔨 Building backend image (attempt $attempt/$max_attempts)..."
        if docker-compose build --no-cache backend; then
            echo "✅ Backend build successful!"
            return 0
        else
            echo "❌ Backend build failed (attempt $attempt/$max_attempts)"
            if [ $attempt -lt $max_attempts ]; then
                echo "🔄 Retrying in 30 seconds..."
                sleep 30
            fi
            ((attempt++))
        fi
    done
    
    echo "❌ Backend build failed after $max_attempts attempts"
    return 1
}

# Function to retry frontend build
retry_frontend() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "🔨 Building frontend image (attempt $attempt/$max_attempts)..."
        if docker-compose build frontend; then
            echo "✅ Frontend build successful!"
            return 0
        else
            echo "❌ Frontend build failed (attempt $attempt/$max_attempts)"
            if [ $attempt -lt $max_attempts ]; then
                echo "🔄 Retrying in 30 seconds..."
                sleep 30
            fi
            ((attempt++))
        fi
    done
    
    echo "❌ Frontend build failed after $max_attempts attempts"
    return 1
}

# Function to retry service startup
retry_start() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "🚀 Starting services (attempt $attempt/$max_attempts)..."
        if docker-compose up -d; then
            echo "✅ Services started successfully!"
            return 0
        else
            echo "❌ Service startup failed (attempt $attempt/$max_attempts)"
            if [ $attempt -lt $max_attempts ]; then
                echo "🔄 Retrying in 15 seconds..."
                sleep 15
            fi
            ((attempt++))
        fi
    done
    
    echo "❌ Service startup failed after $max_attempts attempts"
    return 1
}

# Execute builds with retry logic
retry_build
retry_frontend
retry_start

echo "✅ Rebuild complete! Services are starting..."
echo "📊 Check status with: docker-compose ps"
echo "📋 View logs with: docker-compose logs -f" 