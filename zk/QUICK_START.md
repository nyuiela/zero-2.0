# Quick Start Guide - Zero 2.0 Backend

This is a quick start guide to get your Rust backend running locally with database and API endpoints.

## 🚀 One-Command Setup

### Windows
```bash
.\setup-local.bat
```

### Linux/Mac
```bash
chmod +x setup-local.sh
./setup-local.sh
```

## 📋 What the Setup Does

1. **Creates `.env` file** with database configuration
2. **Starts PostgreSQL & Redis** using Docker
3. **Runs database migrations** to create tables
4. **Seeds the database** with sample car auction data
5. **Provides instructions** for running the server

## 🏃‍♂️ Running the Server

After setup, run the backend:
```bash
cd host
cargo run
```

The server will start on `http://localhost:3001`

## 🧪 Testing the API

### Quick Test
```bash
# Test all endpoints
./test-api.sh          # Linux/Mac
.\test-api.bat         # Windows
```

### Manual Testing
```bash
# Get all cars
curl http://localhost:3001/api/cars

# Get all auctions
curl http://localhost:3001/api/auctions

# Get all bids
curl http://localhost:3001/api/bids
```

## 📚 Available Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/cars` - Get all cars
- `GET /api/cars/{id}` - Get car by ID
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/{id}` - Get auction by ID
- `GET /api/bids` - Get all bids
- `GET /api/bids/{id}` - Get bid by ID
- `GET /api/comments/{id}` - Get comments for auction
- `GET /api/auth` - Get auth verification handler

### Protected Endpoints (Auth Required)
- `POST /api/cars` - Create a new car
- `POST /api/auctions` - Create a new auction
- `POST /api/bids` - Create a new bid
- `POST /api/comment` - Create a new comment
- `POST /api/save_auction` - Save an auction

## 🛠️ Development Workflow

1. **Start databases**: `docker-compose up -d postgres redis`
2. **Run backend**: `cd host && cargo run`
3. **Make API requests** to `http://localhost:3001/api/*`
4. **Stop services**: `docker-compose down` (when done)

## 🔧 Troubleshooting

### Common Issues

**Database connection failed**
- Ensure Docker is running
- Check containers: `docker ps`
- Verify `.env` file exists

**Port already in use**
- Server runs on port 3001
- Change port in `host/src/main.rs` line 175 if needed

**Empty responses**
- Run setup script again
- Check if database is seeded: `psql postgres://kaleel:kaleel@localhost:5432/zero -c "SELECT COUNT(*) FROM car;"`

### Useful Commands

```bash
# Check if containers are running
docker ps

# View logs
docker logs car_auction_postgres
docker logs car_auction_redis

# Stop all services
docker-compose down

# Restart databases
docker-compose up -d postgres redis
```

## 📖 More Information

- **Full Documentation**: See `LOCAL_DEVELOPMENT.md`
- **API Examples**: See `api-examples.md`
- **API Documentation**: See `API_DOCUMENTATION.md`

## 🎯 Next Steps

1. Explore the API endpoints using a REST client
2. Connect your frontend to the local backend
3. Modify the code in `host/src/` directory
4. Add new endpoints or modify existing ones

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgres://kaleel:kaleel@localhost:5432/zero` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `RUST_LOG` | Logging level | `info` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-change-this-in-production` |

---

**Happy coding! 🚗💨** 