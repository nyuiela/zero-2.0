#!/bin/bash

# API Test Script for Zero 2.0 Backend

echo "🧪 Testing Zero 2.0 Backend API endpoints..."
echo ""

BASE_URL="http://localhost:3001"

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo "Testing: $description"
    echo "Endpoint: $method $BASE_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all lines except last)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "200" ]; then
        echo "✅ Status: $status_code"
        echo "📄 Response: $(echo "$body" | head -c 100)..."
    else
        echo "❌ Status: $status_code"
        echo "📄 Response: $body"
    fi
    echo ""
}

# Test public endpoints
echo "=== Testing Public Endpoints ==="

test_endpoint "GET" "/api/cars" "Get all cars"
test_endpoint "GET" "/api/cars/1" "Get car by ID"
test_endpoint "GET" "/api/auctions" "Get all auctions"
test_endpoint "GET" "/api/auctions/1" "Get auction by ID"
test_endpoint "GET" "/api/bids" "Get all bids"
test_endpoint "GET" "/api/bids/1" "Get bid by ID"
test_endpoint "GET" "/api/comments/1" "Get comments for auction"
test_endpoint "GET" "/api/auth" "Get auth verification handler"

echo "=== Testing Initialization Endpoints ==="
test_endpoint "GET" "/api/db/init" "Initialize database"
test_endpoint "GET" "/api/cars/init" "Initialize cars"
test_endpoint "GET" "/api/auctions/init" "Initialize auctions"
test_endpoint "GET" "/api/bids/init" "Initialize bids"

echo "✅ API testing complete!"
echo ""
echo "📋 Summary:"
echo "- Server should be running on: $BASE_URL"
echo "- Check the status codes above to verify endpoints are working"
echo "- 200 = Success, 404 = Not Found, 500 = Server Error"
echo ""
echo "🔧 If you see errors:"
echo "1. Make sure the server is running: cd host && cargo run"
echo "2. Check if databases are running: docker ps"
echo "3. Verify .env file exists and has correct DATABASE_URL" 