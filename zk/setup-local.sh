#!/bin/bash

# Local Development Setup Script for Zero 2.0 Backend

echo "🚀 Setting up Zero 2.0 Backend for local development..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgres://kaleel:kaleel@localhost:5432/zero
REDIS_URL=redis://localhost:6379

# Server Configuration
RUST_LOG=info
RISC0_DEV_MODE=1

# JWT Secret (generate a secure secret for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start database services using Docker
echo "🐳 Starting PostgreSQL and Redis with Docker..."
docker-compose up -d postgres redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
cd db
cargo run --bin migration

# Seed the database
echo "🌱 Seeding database with sample data..."
psql postgres://kaleel:kaleel@localhost:5432/zero -f seed.sql

echo "✅ Setup complete! You can now run the backend with:"
echo "   cd ../host && cargo run"
echo ""
echo "📋 Available endpoints:"
echo "   - GET  http://localhost:3001/api/cars"
echo "   - GET  http://localhost:3001/api/auctions"
echo "   - GET  http://localhost:3001/api/bids"
echo "   - POST http://localhost:3001/api/cars"
echo "   - POST http://localhost:3001/api/auctions"
echo "   - POST http://localhost:3001/api/bids" 