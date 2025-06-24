# API Interaction Examples

This file contains examples of how to interact with the Zero 2.0 Backend API.

## Prerequisites

Make sure your backend is running:
```bash
cd host
cargo run
```

The server will be available at `http://localhost:3001`

## Basic API Calls

### 1. Get All Cars
```bash
curl http://localhost:3001/api/cars
```

### 2. Get a Specific Car
```bash
curl http://localhost:3001/api/cars/1
```

### 3. Get All Auctions
```bash
curl http://localhost:3001/api/auctions
```

### 4. Get a Specific Auction
```bash
curl http://localhost:3001/api/auctions/1
```

### 5. Get All Bids
```bash
curl http://localhost:3001/api/bids
```

### 6. Get Bids for a Specific Auction
```bash
curl http://localhost:3001/api/bids/1
```

## Using a REST Client (Postman, Insomnia, etc.)

### Base Configuration
- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`

### Example Requests

#### GET Request - Get All Cars
```
Method: GET
URL: http://localhost:3001/api/cars
Headers: 
  Content-Type: application/json
```

#### GET Request - Get Car by ID
```
Method: GET
URL: http://localhost:3001/api/cars/1
Headers: 
  Content-Type: application/json
```

#### GET Request - Get All Auctions
```
Method: GET
URL: http://localhost:3001/api/auctions
Headers: 
  Content-Type: application/json
```

## Using JavaScript/Fetch

```javascript
// Get all cars
fetch('http://localhost:3001/api/cars')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get a specific car
fetch('http://localhost:3001/api/cars/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get all auctions
fetch('http://localhost:3001/api/auctions')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Using Python/Requests

```python
import requests

# Get all cars
response = requests.get('http://localhost:3001/api/cars')
cars = response.json()
print(cars)

# Get a specific car
response = requests.get('http://localhost:3001/api/cars/1')
car = response.json()
print(car)

# Get all auctions
response = requests.get('http://localhost:3001/api/auctions')
auctions = response.json()
print(auctions)
```

## Expected Response Format

### Cars Response
```json
[
  {
    "id": 1,
    "make": "Ferrari",
    "model": "488 GTB",
    "year": 2019,
    "color": "Red",
    "mileage": 8200,
    "vin": "ZFF79ALA4J0234001",
    "transmission": "Automatic",
    "fuel_type": "Petrol",
    "engine_size": "3.9L V8",
    "exterior_color": "Rosso Corsa",
    "interior_color": "Black",
    "odometer": 8200,
    "description": "High-performance twin-turbo V8 Ferrari in pristine condition.",
    "image_url": ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
    "auction_id": 1,
    "starting_price": "200000",
    "current_price": "215000",
    "auction_status": "active",
    "summary": "Iconic Ferrari 488 GTB in pristine condition.",
    "report": {"inspection": "passed", "notes": "minor wear", "condition": "excellent"},
    "included": ["Owner's manual", "Tool kit", "Extra key", "Service history"],
    "features": {
      "interior": ["Leather seats", "Carbon fiber trim", "Premium audio"],
      "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"],
      "mechanical": ["Turbocharged engine", "Magnetic ride control", "Launch control"]
    },
    "vehicale_overview": "Driven 8,200 miles, well-maintained, and regularly serviced.",
    "location": "Los Angeles, CA",
    "seller": "SupercarDealerLA",
    "seller_type": "Dealer",
    "lot": "LOT-001",
    "highlight": ["Low mileage", "Clean title", "Sport exhaust"],
    "token_id": 1,
    "owner": "0x123abc456def789ghi",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Auctions Response
```json
[
  {
    "id": 1,
    "car_id": 1,
    "start_time": "2024-01-15T00:00:00Z",
    "end_time": "2024-01-22T00:00:00Z",
    "current_bid": "215000",
    "bid_count": 5,
    "seller": "0x123abc456def789ghi",
    "status": "active",
    "created_at": "2024-01-15T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
]
```

## Testing with curl (Windows PowerShell)

If you're using Windows PowerShell, you might need to use different syntax:

```powershell
# Get all cars
Invoke-RestMethod -Uri "http://localhost:3001/api/cars" -Method Get

# Get a specific car
Invoke-RestMethod -Uri "http://localhost:3001/api/cars/1" -Method Get

# Get all auctions
Invoke-RestMethod -Uri "http://localhost:3001/api/auctions" -Method Get
```

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Make sure the server is running: `cd host && cargo run`
   - Check if the port 3001 is available

2. **CORS errors (when using browser)**
   - The API has CORS configured to allow all origins
   - If you still get CORS errors, check the server logs

3. **Empty responses**
   - Make sure the database is seeded with data
   - Run the setup script: `./setup-local.sh` or `.\setup-local.bat`

4. **Database connection errors**
   - Ensure PostgreSQL and Redis are running: `docker ps`
   - Check the `.env` file has correct DATABASE_URL 