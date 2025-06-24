@echo off
REM Local Development Setup Script for Zero 2.0 Backend (Windows)

echo 🚀 Setting up Zero 2.0 Backend for local development...

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo # Database Configuration
        echo DATABASE_URL=postgresql://postgres:d1fbd9d7dc394a1ba1ce78ff0fc2bdf2@127.0.0.1:5432/sbxcars
        echo REDIS_URL=redis://localhost:6379
        echo.
        echo # Server Configuration
        echo RUST_LOG=info
        echo RISC0_DEV_MODE=1
        echo.
        echo # JWT Secret (generate a secure secret for production)
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    ) > .env
    echo .env file created
) else (
    echo .env file already exists
)

REM Start database services using Docker
echo Starting PostgreSQL and Redis with Docker...
docker-compose up -d postgres redis

REM Wait for databases to be ready
echo Waiting for databases to be ready...
timeout /t 10 /nobreak > nul

REM Run database migrations
echo Running database migrations...
cd db
cargo run --bin migration

REM Seed the database
echo 🌱 Seeding database with sample data...
psql postgresql://postgres:d1fbd9d7dc394a1ba1ce78ff0fc2bdf2@127.0.0.1:5432/sbxcars -f seed.sql

echo ✅ Setup complete! You can now run the backend with:
echo    cd ..\host ^&^& cargo run
echo.
echo 📋 Available endpoints:
echo    - GET  http://localhost:3001/api/cars
echo    - GET  http://localhost:3001/api/auctions
echo    - GET  http://localhost:3001/api/bids
echo    - POST http://localhost:3001/api/cars
echo    - POST http://localhost:3001/api/auctions
echo    - POST http://localhost:3001/api/bids

pause 