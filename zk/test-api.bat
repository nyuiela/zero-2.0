@echo off
REM API Test Script for Zero 2.0 Backend (Windows)

echo 🧪 Testing Zero 2.0 Backend API endpoints...
echo.

set BASE_URL=http://localhost:3001

REM Function to test an endpoint
:test_endpoint
set method=%1
set endpoint=%2
set description=%3

echo Testing: %description%
echo Endpoint: %method% %BASE_URL%%endpoint%

if "%method%"=="GET" (
    for /f "tokens=*" %%i in ('curl -s -w "%%{http_code}" "%BASE_URL%%endpoint%"') do set response=%%i
) else (
    for /f "tokens=*" %%i in ('curl -s -w "%%{http_code}" -X "%method%" "%BASE_URL%%endpoint%"') do set response=%%i
)

REM Extract status code (last 3 characters)
set status_code=%response:~-3%

if "%status_code%"=="200" (
    echo ✅ Status: %status_code%
    echo 📄 Response: %response:~0,100%...
) else (
    echo ❌ Status: %status_code%
    echo 📄 Response: %response%
)
echo.
goto :eof

REM Test public endpoints
echo === Testing Public Endpoints ===

call :test_endpoint "GET" "/api/cars" "Get all cars"
call :test_endpoint "GET" "/api/cars/1" "Get car by ID"
call :test_endpoint "GET" "/api/auctions" "Get all auctions"
call :test_endpoint "GET" "/api/auctions/1" "Get auction by ID"
call :test_endpoint "GET" "/api/bids" "Get all bids"
call :test_endpoint "GET" "/api/bids/1" "Get bid by ID"
call :test_endpoint "GET" "/api/comments/1" "Get comments for auction"
call :test_endpoint "GET" "/api/auth" "Get auth verification handler"

echo === Testing Initialization Endpoints ===
call :test_endpoint "GET" "/api/db/init" "Initialize database"
call :test_endpoint "GET" "/api/cars/init" "Initialize cars"
call :test_endpoint "GET" "/api/auctions/init" "Initialize auctions"
call :test_endpoint "GET" "/api/bids/init" "Initialize bids"

echo ✅ API testing complete!
echo.
echo 📋 Summary:
echo - Server should be running on: %BASE_URL%
echo - Check the status codes above to verify endpoints are working
echo - 200 = Success, 404 = Not Found, 500 = Server Error
echo.
echo 🔧 If you see errors:
echo 1. Make sure the server is running: cd host ^&^& cargo run
echo 2. Check if databases are running: docker ps
echo 3. Verify .env file exists and has correct DATABASE_URL

pause 