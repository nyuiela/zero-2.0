# Car Auction API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

### JWT Bearer Token

Most endpoints require authentication using a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Get Nonce** - `GET /api/auth`
2. **Sign Message** - User signs the nonce message with their wallet
3. **Verify Signature** - `POST /api/auth`
4. **Get JWT Token** - `POST /api/auth/verify`

---

## 🔐 Authentication Endpoints

### 1. Get Nonce for Authentication

**GET** `/api/auth`

**Description:** Retrieves a unique nonce for wallet-based authentication.

**Headers:** None

**Response:**

```json
{
  "token": "uuid-string",
  "msg": "Sign this message to authenticate: uuid-string"
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/auth
```

---

### 2. Verify Signature

**POST** `/api/auth`

**Description:** Verifies the user's signature and generates a zk proof.

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "message": "Sign this message to authenticate: uuid-string",
  "signature_bytes": "hex-signature-string",
  "expected_addr": "hex-wallet-address",
  "username": "user_username",
  "nonce": "uuid-string"
}
```

**Response:**

```json
{
  "receipt": {
    // RISC0 zk proof receipt
  },
  "stats": {
    "segments": 1,
    "total_cycles": 123456,
    "user_cycles": 123456,
    "paging_cycles": 0,
    "reserved_cycles": 0
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Sign this message to authenticate: abc123",
    "signature_bytes": "0x123456...",
    "expected_addr": "0xabcdef...",
    "username": "john_doe",
    "nonce": "abc123"
  }'
```

---

### 3. Get JWT Token

**POST** `/api/auth/verify`

**Description:** Verifies the zk proof and returns a JWT token.

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "receipt": {
    // RISC0 zk proof receipt from previous step
  },
  "stats": {
    "segments": 1,
    "total_cycles": 123456,
    "user_cycles": 123456,
    "paging_cycles": 0,
    "reserved_cycles": 0
  }
}
```

**Response Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response Body:**

```json
{
  "verified": true,
  "address": [1, 2, 3, ...],
  "timestamp": 1234567890,
  "username": "john_doe"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "receipt": { /* zk proof receipt */ },
    "stats": { /* proof stats */ }
  }'
```

---

## 🚗 Car Endpoints

### 4. Get All Cars

**GET** `/api/cars`

**Description:** Retrieves all cars in the system.

**Headers:** None

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "color": "Silver",
      "mileage": 50000,
      "vin": "1HGBH41JXMN109186",
      "transmission": "Automatic",
      "fuel_type": "Gasoline",
      "engine_size": "2.5L",
      "exterior_color": "Silver",
      "interior_color": "Black",
      "odometer": 50000,
      "description": "Well maintained vehicle",
      "image_url": ["url1", "url2"],
      "auction_id": 1,
      "starting_price": 15000,
      "current_price": 15000,
      "auction_status": "pending",
      "summary": "Car summary",
      "report": {},
      "included": {},
      "features": {},
      "vehicale_overview": "Overview text",
      "location": "New York",
      "seller": "Dealer Name",
      "seller_type": "Dealer",
      "lot": "A123",
      "highlight": ["feature1", "feature2"],
      "token_id": 123,
      "owner": "0x123...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/cars
```

---

### 5. Get Car by ID

**GET** `/api/cars/{id}`

**Description:** Retrieves a specific car by its ID.

**Headers:** None

**Path Parameters:**

- `id` (integer): Car ID

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "make": "Toyota",
    "model": "Camry"
    // ... same structure as above
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/cars/1
```

---

### 6. Create Car

**POST** `/api/cars`

**Description:** Creates a new car (requires authentication).

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "id": 2,
  "make": "Honda",
  "model": "Civic",
  "year": 2021,
  "color": "Blue",
  "mileage": 30000,
  "vin": "2T1BURHE0JC123456",
  "transmission": "Automatic",
  "fuel_type": "Gasoline",
  "engine_size": "1.5L",
  "exterior_color": "Blue",
  "interior_color": "Gray",
  "odometer": 30000,
  "description": "Excellent condition",
  "image_url": ["url1", "url2"],
  "auction_id": 2,
  "starting_price": 18000,
  "current_price": 18000,
  "auction_status": "pending",
  "summary": "Car summary",
  "report": {},
  "included": {},
  "features": {},
  "vehicale_overview": "Overview text",
  "location": "Los Angeles",
  "seller": "Dealer Name",
  "seller_type": "Dealer",
  "lot": "B456",
  "highlight": ["feature1", "feature2"],
  "token_id": 124,
  "owner": "0x456...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Car inserted successfully"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "id": 2,
    "make": "Honda",
    "model": "Civic",
    "year": 2021,
    "color": "Blue",
    "mileage": 30000,
    "vin": "2T1BURHE0JC123456",
    "transmission": "Automatic",
    "fuel_type": "Gasoline",
    "engine_size": "1.5L",
    "exterior_color": "Blue",
    "interior_color": "Gray",
    "odometer": 30000,
    "description": "Excellent condition",
    "image_url": ["url1", "url2"],
    "auction_id": 2,
    "starting_price": 18000,
    "current_price": 18000,
    "auction_status": "pending",
    "summary": "Car summary",
    "report": {},
    "included": {},
    "features": {},
    "vehicale_overview": "Overview text",
    "location": "Los Angeles",
    "seller": "Dealer Name",
    "seller_type": "Dealer",
    "lot": "B456",
    "highlight": ["feature1", "feature2"],
    "token_id": 124,
    "owner": "0x456...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }'
```

---

## 🏷️ Auction Endpoints

### 7. Get All Auctions

**GET** `/api/auctions`

**Description:** Retrieves all auctions in the system.

**Headers:** None

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "car_id": 1,
      "start_time": "2024-01-01T00:00:00Z",
      "end_time": "2024-01-07T00:00:00Z",
      "current_bid": 15000,
      "bid_count": 5,
      "seller": "0x123...",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/auctions
```

---

### 8. Get Auction by ID

**GET** `/api/auctions/{id}`

**Description:** Retrieves a specific auction by its ID.

**Headers:** None

**Path Parameters:**

- `id` (integer): Auction ID

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "car_id": 1,
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-07T00:00:00Z",
    "current_bid": 15000,
    "bid_count": 5,
    "seller": "0x123...",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/auctions/1
```

---

### 9. Create Auction

**POST** `/api/auctions`

**Description:** Creates a new auction (requires authentication).

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "id": 2,
  "car_id": 2,
  "start_time": "2024-01-02T00:00:00Z",
  "end_time": "2024-01-09T00:00:00Z",
  "current_bid": 18000,
  "bid_count": 0,
  "seller": "0x456...",
  "status": "pending",
  "created_at": "2024-01-02T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "auction created successfully"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auctions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "id": 2,
    "car_id": 2,
    "start_time": "2024-01-02T00:00:00Z",
    "end_time": "2024-01-09T00:00:00Z",
    "current_bid": 18000,
    "bid_count": 0,
    "seller": "0x456...",
    "status": "pending",
    "created_at": "2024-01-02T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }'
```

---

## 💰 Bid Endpoints

### 10. Get All Bids

**GET** `/api/bids`

**Description:** Retrieves all bids in the system.

**Headers:** None

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "auction_id": 1,
      "bidder_id": 1,
      "amount": 16000,
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/bids
```

---

### 11. Get Bid by ID

**GET** `/api/bids/{id}`

**Description:** Retrieves a specific bid by its ID.

**Headers:** None

**Path Parameters:**

- `id` (integer): Bid ID

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "auction_id": 1,
    "bidder_id": 1,
    "amount": 16000,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/bids/1
```

---

### 12. Create Bid

**POST** `/api/bids`

**Description:** Creates a new bid (requires authentication).

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "id": 2,
  "auction_id": 1,
  "bidder_id": 2,
  "amount": 17000,
  "created_at": "2024-01-01T13:00:00Z",
  "updated_at": "2024-01-01T13:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "bid created successfully"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/bids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "id": 2,
    "auction_id": 1,
    "bidder_id": 2,
    "amount": 17000,
    "created_at": "2024-01-01T13:00:00Z",
    "updated_at": "2024-01-01T13:00:00Z"
  }'
```

---

## 💬 Comment Endpoints

### 13. Get Comments by Auction ID

**GET** `/api/comments/{id}`

**Description:** Retrieves all comments for a specific auction.

**Headers:** None

**Path Parameters:**

- `id` (integer): Auction ID

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "auction_id": 1,
      "user": "john_doe",
      "content": "Great car, interested in bidding!",
      "created_at": "2024-01-01T14:00:00Z",
      "updated_at": "2024-01-01T14:00:00Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/comments/1
```

---

### 14. Create Comment

**POST** `/api/comment`

**Description:** Creates a new comment on an auction (requires authentication).

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "id": 2,
  "auction_id": 1,
  "user": "jane_smith",
  "content": "What's the current mileage?",
  "created_at": "2024-01-01T15:00:00Z",
  "updated_at": "2024-01-01T15:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Comment created successfully"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "id": 2,
    "auction_id": 1,
    "user": "jane_smith",
    "content": "What is the current mileage?",
    "created_at": "2024-01-01T15:00:00Z",
    "updated_at": "2024-01-01T15:00:00Z"
  }'
```

---

## 🔖 Saved Auction Endpoints

### 15. Get Saved Auctions by User

**GET** `/api/saved_auctions/{user}`

**Description:** Retrieves all saved auctions for a specific user.

**Headers:** None

**Path Parameters:**

- `user` (string): Username

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "user": "john_doe",
      "auction_id": 1,
      "created_at": "2024-01-01T16:00:00Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/saved_auctions/john_doe
```

---

### 16. Get Saved Auctions by Auction ID

**GET** `/api/auctions/saved/{id}`

**Description:** Retrieves all users who saved a specific auction.

**Headers:** None

**Path Parameters:**

- `id` (integer): Auction ID

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "user": "john_doe",
      "auction_id": 1,
      "created_at": "2024-01-01T16:00:00Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/auctions/saved/1
```

---

### 17. Save Auction

**POST** `/api/save_auction`

**Description:** Saves an auction for a user (requires authentication).

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "id": 2,
  "user": "jane_smith",
  "auction_id": 1,
  "created_at": "2024-01-01T17:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Auction added to saved"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/save_auction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "id": 2,
    "user": "jane_smith",
    "auction_id": 1,
    "created_at": "2024-01-01T17:00:00Z"
  }'
```

---

## 🔐 ZK Proof Initialization Endpoints

### 18. Initialize Car ZK Proof

**GET** `/api/cars/init`

**Description:** Generates a zk proof for all cars in the system.

**Headers:** None

**Response:**

```json
{
  "receipt": {
    // RISC0 zk proof receipt for cars
  },
  "stats": {
    "segments": 1,
    "total_cycles": 123456,
    "user_cycles": 123456,
    "paging_cycles": 0,
    "reserved_cycles": 0
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/cars/init
```

---

### 19. Initialize Auction ZK Proof

**GET** `/api/auctions/init`

**Description:** Generates a zk proof for all auctions in the system.

**Headers:** None

**Response:**

```json
{
  "receipt": {
    // RISC0 zk proof receipt for auctions
  },
  "stats": {
    "segments": 1,
    "total_cycles": 123456,
    "user_cycles": 123456,
    "paging_cycles": 0,
    "reserved_cycles": 0
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/auctions/init
```

---

### 20. Initialize Bid ZK Proof

**GET** `/api/bids/init`

**Description:** Generates a zk proof for all bids in the system.

**Headers:** None

**Response:**

```json
{
  "receipt": {
    // RISC0 zk proof receipt for bids
  },
  "stats": {
    "segments": 1,
    "total_cycles": 123456,
    "user_cycles": 123456,
    "paging_cycles": 0,
    "reserved_cycles": 0
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/bids/init
```

---

### 21. Initialize Overall ZK Proof

**GET** `/api/db/init`

**Description:** Generates a comprehensive zk proof for all data (cars, auctions, bids) in the system.

**Headers:** None

**Response:**

```json
{
  "receipt": {
    // RISC0 zk proof receipt for all data
  },
  "stats": {
    "segments": 1,
    "total_cycles": 123456,
    "user_cycles": 123456,
    "paging_cycles": 0,
    "reserved_cycles": 0
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/db/init
```

---

## 📊 Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |

## 🔒 Authentication Flow Summary

1. **Get Nonce**: `GET /api/auth` → Returns nonce and message to sign
2. **User Signs**: User signs the message with their wallet
3. **Verify Signature**: `POST /api/auth` → Verifies signature and generates zk proof
4. **Get JWT**: `POST /api/auth/verify` → Verifies zk proof and returns JWT token
5. **Use JWT**: Include `Authorization: Bearer <jwt-token>` in subsequent requests

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Monetary amounts are integers (in cents or smallest unit)
- Image URLs are arrays of strings
- JSON fields (report, included, features) can contain any valid JSON structure
- Auction status can be: `pending`, `active`, `completed`, `cancelled`
- The system uses RISC0 zkVM for zero-knowledge proofs
- Protected routes require valid JWT authentication
