-- Database Seed File for Car Auction Platform
-- This file contains sample data for cars, auctions, bids, comments, and saved auctions

-- Clear existing data (if any)
TRUNCATE TABLE saved_auction CASCADE;
TRUNCATE TABLE comment CASCADE;
TRUNCATE TABLE bid CASCADE;
TRUNCATE TABLE auction CASCADE;
TRUNCATE TABLE car CASCADE;

-- Reset sequences
ALTER SEQUENCE car_id_seq RESTART WITH 1;
ALTER SEQUENCE auction_id_seq RESTART WITH 1;
ALTER SEQUENCE bid_id_seq RESTART WITH 1;
ALTER SEQUENCE comment_id_seq RESTART WITH 1;
ALTER SEQUENCE saved_auction_id_seq RESTART WITH 1;

-- Insert Cars
INSERT INTO car (
    id, make, model, year, color, mileage, vin, transmission, fuel_type, engine_size,
    exterior_color, interior_color, odometer, description, image_url, auction_id,
    starting_price, current_price, auction_status, summary, report, included, features,
    vehicale_overview, location, seller, seller_type, lot, highlight, token_id, owner,
    created_at, updated_at
) VALUES
-- Luxury Cars
(1, 'Ferrari', '488 GTB', 2019, 'Red', 8200, 'ZFF79ALA4J0234001', 'Automatic', 'Petrol', '3.9L V8',
'Rosso Corsa', 'Black', 8200, 'High-performance twin-turbo V8 Ferrari in pristine condition.',
'["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
1, 200000, 215000, 'active', 'Iconic Ferrari 488 GTB in pristine condition.',
'{"inspection": "passed", "notes": "minor wear", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
'{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Turbocharged engine", "Magnetic ride control", "Launch control"]}',
'Driven 8,200 miles, well-maintained, and regularly serviced.',
'Los Angeles, CA', 'SupercarDealerLA', 'Dealer', 'LOT-001', '["Low mileage", "Clean title", "Sport exhaust"]',
1, '0x123abc456def789ghi', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

(2, 'Lamborghini', 'Huracán', 2020, 'Yellow', 12000, 'ZHWUC1ZF5LLA12345', 'Automatic', 'Petrol', '5.2L V10',
'Giallo', 'Black', 12000, 'Stunning Lamborghini Huracán with low mileage and perfect service history.',
'["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
2, 180000, 195000, 'active', 'Exquisite Lamborghini Huracán with premium features.',
'{"inspection": "passed", "notes": "perfect condition", "condition": "mint"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history", "Carbon fiber package"]',
'{"interior": ["Alcantara seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Naturally aspirated V10", "Magnetic ride control", "Launch control"]}',
'Only 12,000 miles, single owner, full service history.',
'Miami, FL', 'LuxuryCarMiami', 'Dealer', 'LOT-002', '["Low mileage", "Clean title", "Carbon package"]',
2, '0x456def789ghi123abc', '2024-01-02T00:00:00Z', '2024-01-02T00:00:00Z'),

(3, 'Porsche', '911 GT3 RS', 2021, 'White', 5000, 'WP0AB2A91MS123456', 'Manual', 'Petrol', '4.0L Flat-6',
'White', 'Black', 5000, 'Track-focused Porsche 911 GT3 RS with minimal road use.',
'["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
3, 220000, 235000, 'active', 'Ultimate track weapon with street legality.',
'{"inspection": "passed", "notes": "track use", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history", "Track day package"]',
'{"interior": ["Carbon fiber seats", "Alcantara trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Naturally aspirated flat-6", "Magnetic ride control", "Launch control"]}',
'Only 5,000 miles, primarily track use, full service history.',
'New York, NY', 'PorscheNYC', 'Dealer', 'LOT-003', '["Track focused", "Low mileage", "Carbon package"]',
3, '0x789ghi123abc456def', '2024-01-03T00:00:00Z', '2024-01-03T00:00:00Z'),

-- Sports Cars
(4, 'BMW', 'M4 Competition', 2022, 'Black', 8000, 'WBS83CD0X1234567', 'Automatic', 'Petrol', '3.0L I6 Twin-Turbo',
'Black', 'Red', 8000, 'BMW M4 Competition with aggressive styling and powerful performance.',
'["https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
4, 85000, 92000, 'active', 'BMW M4 Competition with premium features.',
'{"inspection": "passed", "notes": "minor wear", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
'{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Twin-turbo engine", "Magnetic ride control", "Launch control"]}',
'Only 8,000 miles, well-maintained, full service history.',
'Chicago, IL', 'BMWChicago', 'Dealer', 'LOT-004', '["Low mileage", "Clean title", "M package"]',
4, '0xabc123def456ghi789', '2024-01-04T00:00:00Z', '2024-01-04T00:00:00Z'),

(5, 'Mercedes-Benz', 'AMG GT', 2021, 'Silver', 15000, 'WDDYJ7JA0KA123456', 'Automatic', 'Petrol', '4.0L V8 Biturbo',
'Silver', 'Black', 15000, 'Mercedes-AMG GT with handcrafted engine and premium features.',
'["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
5, 120000, 135000, 'active', 'Mercedes-AMG GT with handcrafted performance.',
'{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
'{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Handcrafted V8", "Magnetic ride control", "Launch control"]}',
'15,000 miles, well-maintained, full service history.',
'Houston, TX', 'MercedesHouston', 'Dealer', 'LOT-005', '["Handcrafted engine", "Clean title", "AMG package"]',
5, '0xdef456ghi789abc123', '2024-01-05T00:00:00Z', '2024-01-05T00:00:00Z'),

-- Classic Cars
(6, 'Ford', 'Mustang GT', 1969, 'Blue', 45000, '9F02R123456', 'Manual', 'Petrol', '5.0L V8',
'Blue', 'Black', 45000, 'Classic 1969 Ford Mustang GT in excellent condition.',
'["https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
6, 45000, 52000, 'active', 'Classic 1969 Ford Mustang GT.',
'{"inspection": "passed", "notes": "restored", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history", "Restoration documents"]',
'{"interior": ["Vinyl seats", "Original trim", "AM radio"], "exterior": ["Original paint", "Chrome trim", "Classic wheels"], "mechanical": ["Original engine", "Manual transmission", "Classic suspension"]}',
'45,000 miles, fully restored, matching numbers.',
'Detroit, MI', 'ClassicCarDetroit', 'Dealer', 'LOT-006', '["Classic", "Restored", "Matching numbers"]',
6, '0xghi789abc123def456', '2024-01-06T00:00:00Z', '2024-01-06T00:00:00Z'),

(7, 'Chevrolet', 'Corvette Stingray', 1967, 'Red', 38000, '194677S123456', 'Manual', 'Petrol', '5.7L V8',
'Red', 'Black', 38000, 'Iconic 1967 Chevrolet Corvette Stingray.',
'["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
7, 65000, 72000, 'active', 'Iconic 1967 Chevrolet Corvette Stingray.',
'{"inspection": "passed", "notes": "restored", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history", "Restoration documents"]',
'{"interior": ["Vinyl seats", "Original trim", "AM radio"], "exterior": ["Original paint", "Chrome trim", "Classic wheels"], "mechanical": ["Original engine", "Manual transmission", "Classic suspension"]}',
'38,000 miles, fully restored, matching numbers.',
'Atlanta, GA', 'ClassicCarAtlanta', 'Dealer', 'LOT-007', '["Classic", "Restored", "Matching numbers"]',
7, '0xabc123def456ghi789', '2024-01-07T00:00:00Z', '2024-01-07T00:00:00Z'),

-- Electric Cars
(8, 'Tesla', 'Model S Plaid', 2023, 'White', 3000, '5YJS4E12345678901', 'Automatic', 'Electric', 'Tri-Motor',
'White', 'Black', 3000, 'Tesla Model S Plaid with incredible performance.',
'["https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
8, 120000, 125000, 'active', 'Tesla Model S Plaid with incredible performance.',
'{"inspection": "passed", "notes": "like new", "condition": "mint"}',
'["Owner''s manual", "Charging cable", "Extra key", "Service history"]',
'{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Glass roof", "Carbon fiber body"], "mechanical": ["Tri-motor setup", "Autopilot", "Launch control"]}',
'Only 3,000 miles, like new condition.',
'San Francisco, CA', 'TeslaSF', 'Dealer', 'LOT-008', '["Electric", "Low mileage", "Plaid performance"]',
8, '0xdef456ghi789abc123', '2024-01-08T00:00:00Z', '2024-01-08T00:00:00Z'),

(9, 'Porsche', 'Taycan Turbo S', 2022, 'Blue', 12000, 'WP0AB2Y1234567890', 'Automatic', 'Electric', 'Dual-Motor',
'Blue', 'Black', 12000, 'Porsche Taycan Turbo S with incredible performance.',
'["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
9, 180000, 190000, 'active', 'Porsche Taycan Turbo S with incredible performance.',
'{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
'["Owner''s manual", "Charging cable", "Extra key", "Service history"]',
'{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Glass roof", "Carbon fiber body"], "mechanical": ["Dual-motor setup", "Autopilot", "Launch control"]}',
'12,000 miles, well-maintained, full service history.',
'Seattle, WA', 'PorscheSeattle', 'Dealer', 'LOT-009', '["Electric", "Turbo S", "Premium features"]',
9, '0xghi789abc123def456', '2024-01-09T00:00:00Z', '2024-01-09T00:00:00Z'),

-- SUV/Luxury
(10, 'Range Rover', 'Sport SVR', 2021, 'Black', 25000, 'SALGS2SVXKA123456', 'Automatic', 'Petrol', '5.0L V8 Supercharged',
'Black', 'Tan', 25000, 'Range Rover Sport SVR with incredible performance.',
'["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
10, 95000, 105000, 'active', 'Range Rover Sport SVR with incredible performance.',
'{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
'["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
'{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Supercharged V8", "Magnetic ride control", "Launch control"]}',
'25,000 miles, well-maintained, full service history.',
'Denver, CO', 'RangeRoverDenver', 'Dealer', 'LOT-010', '["SVR performance", "Clean title", "Premium features"]',
10, '0xabc123def456ghi789', '2024-01-10T00:00:00Z', '2024-01-10T00:00:00Z');

-- Insert Auctions
INSERT INTO auction (
    id, car_id, start_time, end_time, current_bid, bid_count, seller, status, created_at, updated_at
) VALUES
(1, 1, '2024-01-15T00:00:00Z', '2024-01-22T00:00:00Z', 215000, 5, '0x123abc456def789ghi', 'active', '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
(2, 2, '2024-01-16T00:00:00Z', '2024-01-23T00:00:00Z', 195000, 3, '0x456def789ghi123abc', 'active', '2024-01-16T00:00:00Z', '2024-01-16T00:00:00Z'),
(3, 3, '2024-01-17T00:00:00Z', '2024-01-24T00:00:00Z', 235000, 7, '0x789ghi123abc456def', 'active', '2024-01-17T00:00:00Z', '2024-01-17T00:00:00Z'),
(4, 4, '2024-01-18T00:00:00Z', '2024-01-25T00:00:00Z', 92000, 4, '0xabc123def456ghi789', 'active', '2024-01-18T00:00:00Z', '2024-01-18T00:00:00Z'),
(5, 5, '2024-01-19T00:00:00Z', '2024-01-26T00:00:00Z', 135000, 6, '0xdef456ghi789abc123', 'active', '2024-01-19T00:00:00Z', '2024-01-19T00:00:00Z'),
(6, 6, '2024-01-20T00:00:00Z', '2024-01-27T00:00:00Z', 52000, 8, '0xghi789abc123def456', 'active', '2024-01-20T00:00:00Z', '2024-01-20T00:00:00Z'),
(7, 7, '2024-01-21T00:00:00Z', '2024-01-28T00:00:00Z', 72000, 5, '0xabc123def456ghi789', 'active', '2024-01-21T00:00:00Z', '2024-01-21T00:00:00Z'),
(8, 8, '2024-01-22T00:00:00Z', '2024-01-29T00:00:00Z', 125000, 4, '0xdef456ghi789abc123', 'active', '2024-01-22T00:00:00Z', '2024-01-22T00:00:00Z'),
(9, 9, '2024-01-23T00:00:00Z', '2024-01-30T00:00:00Z', 190000, 3, '0xghi789abc123def456', 'active', '2024-01-23T00:00:00Z', '2024-01-23T00:00:00Z'),
(10, 10, '2024-01-24T00:00:00Z', '2024-01-31T00:00:00Z', 105000, 6, '0xabc123def456ghi789', 'active', '2024-01-24T00:00:00Z', '2024-01-24T00:00:00Z');

-- Insert Bids
INSERT INTO bid (
    id, auction_id, bidder_id, amount, created_at, updated_at
) VALUES
-- Ferrari 488 GTB bids
(1, 1, 1, 200000, '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
(2, 1, 2, 205000, '2024-01-15T11:30:00Z', '2024-01-15T11:30:00Z'),
(3, 1, 3, 210000, '2024-01-15T14:15:00Z', '2024-01-15T14:15:00Z'),
(4, 1, 1, 212000, '2024-01-15T16:45:00Z', '2024-01-15T16:45:00Z'),
(5, 1, 4, 215000, '2024-01-15T18:20:00Z', '2024-01-15T18:20:00Z'),

-- Lamborghini Huracán bids
(6, 2, 2, 180000, '2024-01-16T09:00:00Z', '2024-01-16T09:00:00Z'),
(7, 2, 5, 185000, '2024-01-16T12:30:00Z', '2024-01-16T12:30:00Z'),
(8, 2, 1, 195000, '2024-01-16T15:45:00Z', '2024-01-16T15:45:00Z'),

-- Porsche 911 GT3 RS bids
(9, 3, 3, 220000, '2024-01-17T08:00:00Z', '2024-01-17T08:00:00Z'),
(10, 3, 6, 225000, '2024-01-17T10:30:00Z', '2024-01-17T10:30:00Z'),
(11, 3, 1, 230000, '2024-01-17T13:15:00Z', '2024-01-17T13:15:00Z'),
(12, 3, 7, 232000, '2024-01-17T16:45:00Z', '2024-01-17T16:45:00Z'),
(13, 3, 3, 235000, '2024-01-17T19:20:00Z', '2024-01-17T19:20:00Z'),

-- BMW M4 Competition bids
(14, 4, 4, 85000, '2024-01-18T09:30:00Z', '2024-01-18T09:30:00Z'),
(15, 4, 8, 87000, '2024-01-18T12:00:00Z', '2024-01-18T12:00:00Z'),
(16, 4, 2, 90000, '2024-01-18T15:30:00Z', '2024-01-18T15:30:00Z'),
(17, 4, 4, 92000, '2024-01-18T18:45:00Z', '2024-01-18T18:45:00Z'),

-- Mercedes-AMG GT bids
(18, 5, 5, 120000, '2024-01-19T10:00:00Z', '2024-01-19T10:00:00Z'),
(19, 5, 9, 125000, '2024-01-19T13:30:00Z', '2024-01-19T13:30:00Z'),
(20, 5, 1, 130000, '2024-01-19T16:15:00Z', '2024-01-19T16:15:00Z'),
(21, 5, 5, 132000, '2024-01-19T19:45:00Z', '2024-01-19T19:45:00Z'),
(22, 5, 3, 135000, '2024-01-19T21:30:00Z', '2024-01-19T21:30:00Z'),

-- Ford Mustang GT bids
(23, 6, 6, 45000, '2024-01-20T08:30:00Z', '2024-01-20T08:30:00Z'),
(24, 6, 10, 47000, '2024-01-20T11:00:00Z', '2024-01-20T11:00:00Z'),
(25, 6, 2, 49000, '2024-01-20T14:30:00Z', '2024-01-20T14:30:00Z'),
(26, 6, 6, 50000, '2024-01-20T17:15:00Z', '2024-01-20T17:15:00Z'),
(27, 6, 4, 51000, '2024-01-20T19:45:00Z', '2024-01-20T19:45:00Z'),
(28, 6, 6, 52000, '2024-01-20T21:30:00Z', '2024-01-20T21:30:00Z'),

-- Chevrolet Corvette Stingray bids
(29, 7, 7, 65000, '2024-01-21T09:15:00Z', '2024-01-21T09:15:00Z'),
(30, 7, 1, 67000, '2024-01-21T12:45:00Z', '2024-01-21T12:45:00Z'),
(31, 7, 3, 69000, '2024-01-21T16:30:00Z', '2024-01-21T16:30:00Z'),
(32, 7, 7, 70000, '2024-01-21T19:15:00Z', '2024-01-21T19:15:00Z'),
(33, 7, 5, 72000, '2024-01-21T21:45:00Z', '2024-01-21T21:45:00Z'),

-- Tesla Model S Plaid bids
(34, 8, 8, 120000, '2024-01-22T10:30:00Z', '2024-01-22T10:30:00Z'),
(35, 8, 2, 122000, '2024-01-22T13:00:00Z', '2024-01-22T13:00:00Z'),
(36, 8, 4, 124000, '2024-01-22T16:30:00Z', '2024-01-22T16:30:00Z'),
(37, 8, 8, 125000, '2024-01-22T19:15:00Z', '2024-01-22T19:15:00Z'),

-- Porsche Taycan Turbo S bids
(38, 9, 9, 180000, '2024-01-23T11:00:00Z', '2024-01-23T11:00:00Z'),
(39, 9, 1, 185000, '2024-01-23T14:30:00Z', '2024-01-23T14:30:00Z'),
(40, 9, 6, 190000, '2024-01-23T17:45:00Z', '2024-01-23T17:45:00Z'),

-- Range Rover Sport SVR bids
(41, 10, 10, 95000, '2024-01-24T09:45:00Z', '2024-01-24T09:45:00Z'),
(42, 10, 3, 98000, '2024-01-24T12:15:00Z', '2024-01-24T12:15:00Z'),
(43, 10, 7, 100000, '2024-01-24T15:30:00Z', '2024-01-24T15:30:00Z'),
(44, 10, 10, 102000, '2024-01-24T18:45:00Z', '2024-01-24T18:45:00Z'),
(45, 10, 5, 104000, '2024-01-24T21:15:00Z', '2024-01-24T21:15:00Z'),
(46, 10, 10, 105000, '2024-01-24T23:30:00Z', '2024-01-24T23:30:00Z');

-- Insert Comments
INSERT INTO comment (
    id, auction_id, user, content, created_at, updated_at
) VALUES
(1, 1, 'john_doe', 'Beautiful Ferrari! What''s the service history like?', '2024-01-15T10:30:00Z', '2024-01-15T10:30:00Z'),
(2, 1, 'jane_smith', 'Is this the original paint?', '2024-01-15T11:45:00Z', '2024-01-15T11:45:00Z'),
(3, 1, 'mike_wilson', 'Great car! How many owners?', '2024-01-15T14:20:00Z', '2024-01-15T14:20:00Z'),
(4, 2, 'sarah_jones', 'Stunning Lamborghini! Any modifications?', '2024-01-16T09:30:00Z', '2024-01-16T09:30:00Z'),
(5, 2, 'david_brown', 'What''s the current mileage?', '2024-01-16T12:15:00Z', '2024-01-16T12:15:00Z'),
(6, 3, 'lisa_garcia', 'Track day car? How many track days?', '2024-01-17T08:30:00Z', '2024-01-17T08:30:00Z'),
(7, 3, 'tom_lee', 'Is the engine original?', '2024-01-17T10:45:00Z', '2024-01-17T10:45:00Z'),
(8, 4, 'amy_chen', 'BMW M4 looks great! Any accidents?', '2024-01-18T09:45:00Z', '2024-01-18T09:45:00Z'),
(9, 5, 'chris_martin', 'AMG GT is a beast! Service records?', '2024-01-19T10:30:00Z', '2024-01-19T10:30:00Z'),
(10, 6, 'emma_davis', 'Classic Mustang! Is it numbers matching?', '2024-01-20T08:45:00Z', '2024-01-20T08:45:00Z'),
(11, 7, 'alex_taylor', 'Corvette looks amazing! Original engine?', '2024-01-21T09:30:00Z', '2024-01-21T09:30:00Z'),
(12, 8, 'sophie_white', 'Tesla Plaid is incredible! Battery health?', '2024-01-22T10:45:00Z', '2024-01-22T10:45:00Z'),
(13, 9, 'ryan_clark', 'Porsche Taycan is beautiful! Range?', '2024-01-23T11:15:00Z', '2024-01-23T11:15:00Z'),
(14, 10, 'olivia_king', 'Range Rover SVR is perfect! Off-road tested?', '2024-01-24T09:30:00Z', '2024-01-24T09:30:00Z');

-- Insert Saved Auctions
INSERT INTO saved_auction (
    id, user, auction_id, created_at
) VALUES
(1, 'john_doe', 1, '2024-01-15T10:00:00Z'),
(2, 'jane_smith', 1, '2024-01-15T11:00:00Z'),
(3, 'mike_wilson', 1, '2024-01-15T12:00:00Z'),
(4, 'sarah_jones', 2, '2024-01-16T09:00:00Z'),
(5, 'david_brown', 2, '2024-01-16T10:00:00Z'),
(6, 'lisa_garcia', 3, '2024-01-17T08:00:00Z'),
(7, 'tom_lee', 3, '2024-01-17T09:00:00Z'),
(8, 'amy_chen', 4, '2024-01-18T09:00:00Z'),
(9, 'chris_martin', 5, '2024-01-19T10:00:00Z'),
(10, 'emma_davis', 6, '2024-01-20T08:00:00Z'),
(11, 'alex_taylor', 7, '2024-01-21T09:00:00Z'),
(12, 'sophie_white', 8, '2024-01-22T10:00:00Z'),
(13, 'ryan_clark', 9, '2024-01-23T11:00:00Z'),
(14, 'olivia_king', 10, '2024-01-24T09:00:00Z'),
(15, 'john_doe', 3, '2024-01-17T10:00:00Z'),
(16, 'jane_smith', 5, '2024-01-19T11:00:00Z'),
(17, 'mike_wilson', 7, '2024-01-21T10:00:00Z'),
(18, 'sarah_jones', 9, '2024-01-23T12:00:00Z'),
(19, 'david_brown', 4, '2024-01-18T10:00:00Z'),
(20, 'lisa_garcia', 6, '2024-01-20T09:00:00Z');

-- Update auction bid counts based on actual bids
UPDATE auction SET bid_count = (
    SELECT COUNT(*) FROM bid WHERE bid.auction_id = auction.id
);

-- Update auction current_bid to highest bid amount
UPDATE auction SET current_bid = (
    SELECT MAX(amount) FROM bid WHERE bid.auction_id = auction.id
); 