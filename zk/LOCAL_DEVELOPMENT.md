# Local Development Guide

This guide will help you set up and run the Zero 2.0 Rust backend locally.

## Prerequisites

- [Rust](https://rustup.rs/) (latest stable version)
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [PostgreSQL client](https://www.postgresql.org/download/) (for seeding data)

## Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Run the setup script
.\setup-local.bat
```

**Linux/Mac:**
```bash
# Make the script executable
chmod +x setup-local.sh

# Run the setup script
./setup-local.sh
```

### Option 2: Manual Setup

1. **Create Environment File**
   Create a `.env` file in the `zk` directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgres://kaleel:kaleel@localhost:5432/zero
   REDIS_URL=redis://localhost:6379
   
   # Server Configuration
   RUST_LOG=info
   RISC0_DEV_MODE=1
   
   # JWT Secret (generate a secure secret for production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

2. **Start Database Services**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d postgres redis
   
   # Wait for services to be ready (about 10 seconds)
   ```

3. **Run Database Migrations**
   ```bash
   cd host
   cargo run --bin migration
   ```

4. **Seed the Database**
   ```bash
   cd ../db
   psql postgres://kaleel:kaleel@localhost:5432/zero -f seed.sql
   ```

5. **Run the Backend**
   ```bash
   cd ../host
   cargo run
   ```

## API Endpoints

The server runs on `http://localhost:3001` and provides the following endpoints:

### Public Endpoints (No Authentication Required)

#### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/{id}` - Get car by ID

#### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/{id}` - Get auction by ID

#### Bids
- `GET /api/bids` - Get all bids
- `GET /api/bids/{id}` - Get bid by ID

#### Comments
- `GET /api/comments/{id}` - Get comments for an auction

#### Saved Auctions
- `GET /api/saved_auctions/{user}` - Get user's saved auctions
- `GET /api/auctions/saved/{id}` - Get all saved auctions for an auction ID

#### Authentication
- `GET /api/auth` - Get verification handler
- `POST /api/auth` - Verify signature
- `POST /api/auth/verify` - Verify authentication

#### Initialization
- `GET /api/auctions/init` - Initialize auction
- `GET /api/cars/init` - Initialize car
- `GET /api/bids/init` - Initialize bid
- `GET /api/db/init` - Initialize overall database

### Protected Endpoints (Authentication Required)

#### Cars
- `POST /api/cars` - Create a new car

#### Auctions
- `POST /api/auctions` - Create a new auction

#### Bids
- `POST /api/bids` - Create a new bid

#### Comments
- `POST /api/comment` - Create a new comment

#### Saved Auctions
- `POST /api/save_auction` - Save an auction

## Testing the API

### Using curl

1. **Get all cars:**
   ```bash
   curl http://localhost:3001/api/cars
   ```

2. **Get a specific car:**
   ```bash
   curl http://localhost:3001/api/cars/1
   ```

3. **Get all auctions:**
   ```bash
   curl http://localhost:3001/api/auctions
   ```

4. **Get all bids:**
   ```bash
   curl http://localhost:3001/api/bids
   ```

### Using a REST Client (Postman, Insomnia, etc.)

- Base URL: `http://localhost:3001`
- All endpoints are prefixed with `/api`

## Database Schema

The database includes the following tables:
- `car` - Car information and details
- `auction` - Auction details and status
- `bid` - Bid information
- `comment` - Comments on auctions
- `saved_auction` - User saved auctions

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Ensure Docker is running
   - Check if PostgreSQL container is healthy: `docker ps`
   - Verify DATABASE_URL in `.env` file

2. **Port already in use**
   - The server runs on port 3001
   - Check if another process is using this port
   - You can change the port in `host/src/main.rs` line 175

3. **Migration errors**
   - Ensure the database is running before running migrations
   - Check database connection string

4. **Seed data not loading**
   - Ensure PostgreSQL client is installed
   - Check if you can connect to the database manually

### Useful Commands

```bash
# Check if containers are running
docker ps

# View container logs
docker logs car_auction_postgres
docker logs car_auction_redis

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose down
docker-compose up -d postgres redis
```

## Development Workflow

1. **Start databases:** `docker-compose up -d postgres redis`
2. **Run backend:** `cd host && cargo run`
3. **Make API requests** to `http://localhost:3001/api/*`
4. **Stop services:** `docker-compose down` (when done)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://kaleel:kaleel@localhost:5432/zero` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `RUST_LOG` | Logging level | `info` |
| `RISC0_DEV_MODE` | Development mode flag | `1` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-change-this-in-production` |

## Next Steps

Once your local development environment is set up, you can:

1. Explore the API endpoints using a REST client
2. Modify the code in the `host/src/` directory
3. Add new endpoints or modify existing ones
4. Test your changes by restarting the server
5. Connect your frontend to the local backend

For production deployment, remember to:
- Change the JWT secret
- Use proper database credentials
- Configure CORS properly
- Set up proper logging
- Use environment-specific configuration 