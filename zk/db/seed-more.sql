-- Database Seed File for Car Auction Platform

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
INSERT INTO
    car (
        id,
        make,
        model,
        year,
        color,
        mileage,
        vin,
        transmission,
        fuel_type,
        engine_size,
        exterior_color,
        interior_color,
        odometer,
        description,
        image_url,
        auction_id,
        starting_price,
        current_price,
        auction_status,
        summary,
        report,
        included,
        features,
        vehicale_overview,
        location,
        seller,
        seller_type,
        lot,
        highlight,
        token_id,
        owner,
        created_at,
        updated_at
    )
VALUES
    -- ORIGINAL 10 CARS (Updated with better images)
    (
        1,
        'Ferrari',
        '488 GTB',
        '2019',
        'Red',
        8200,
        'ZFF79ALA4J0234001',
        'Automatic',
        'Petrol',
        '3.9L V8',
        'Rosso Corsa',
        'Black',
        8200,
        'High-performance twin-turbo V8 Ferrari in pristine condition.',
        '["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        1,
        200000,
        215000,
        'active',
        'Iconic Ferrari 488 GTB in pristine condition.',
        '{"inspection": "passed", "notes": "minor wear", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Turbocharged engine", "Magnetic ride control", "Launch control"]}',
        'Driven 8,200 miles, well-maintained, and regularly serviced.',
        'Los Angeles, CA',
        'SupercarDealerLA',
        'Dealer',
        'LOT-001',
        '["Low mileage", "Clean title", "Sport exhaust"]',
        1,
        '0x123abc456def789ghi',
        '2024-01-01T00:00:00Z',
        '2024-01-01T00:00:00Z'
    ),
    (
        2,
        'Lamborghini',
        'Huracán',
        '2020',
        'Yellow',
        12000,
        'ZHWUC1ZF5LLA12345',
        'Automatic',
        'Petrol',
        '5.2L V10',
        'Giallo',
        'Black',
        12000,
        'Stunning Lamborghini Huracán with low mileage and perfect service history.',
        '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        2,
        180000,
        195000,
        'active',
        'Exquisite Lamborghini Huracán with premium features.',
        '{"inspection": "passed", "notes": "perfect condition", "condition": "mint"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history", "Carbon fiber package"]',
        '{"interior": ["Alcantara seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Naturally aspirated V10", "Magnetic ride control", "Launch control"]}',
        'Only 12,000 miles, single owner, full service history.',
        'Miami, FL',
        'LuxuryCarMiami',
        'Dealer',
        'LOT-002',
        '["Low mileage", "Clean title", "Carbon package"]',
        2,
        '0x456def789ghi123abc',
        '2024-01-02T00:00:00Z',
        '2024-01-02T00:00:00Z'
    ),
    (
        3,
        'Porsche',
        '911 GT3 RS',
        '2021',
        'White',
        5000,
        'WP0AB2A91MS123456',
        'Manual',
        'Petrol',
        '4.0L Flat-6',
        'White',
        'Black',
        5000,
        'Track-focused Porsche 911 GT3 RS with minimal road use.',
        '["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        3,
        220000,
        235000,
        'active',
        'Ultimate track weapon with street legality.',
        '{"inspection": "passed", "notes": "track use", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history", "Track day package"]',
        '{"interior": ["Carbon fiber seats", "Alcantara trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Naturally aspirated flat-6", "Magnetic ride control", "Launch control"]}',
        'Only 5,000 miles, primarily track use, full service history.',
        'New York, NY',
        'PorscheNYC',
        'Dealer',
        'LOT-003',
        '["Track focused", "Low mileage", "Carbon package"]',
        3,
        '0x789ghi123abc456def',
        '2024-01-03T00:00:00Z',
        '2024-01-03T00:00:00Z'
    ),
    (
        4,
        'BMW',
        'M4 Competition',
        '2022',
        'Black',
        8000,
        'WBS83CD0X1234567',
        'Automatic',
        'Petrol',
        '3.0L I6 Twin-Turbo',
        'Black',
        'Red',
        8000,
        'BMW M4 Competition with aggressive styling and powerful performance.',
        '["https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        4,
        85000,
        92000,
        'active',
        'BMW M4 Competition with premium features.',
        '{"inspection": "passed", "notes": "minor wear", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Twin-turbo engine", "Magnetic ride control", "Launch control"]}',
        'Only 8,000 miles, well-maintained, full service history.',
        'Chicago, IL',
        'BMWChicago',
        'Dealer',
        'LOT-004',
        '["Low mileage", "Clean title", "M package"]',
        4,
        '0xabc123def456ghi789',
        '2024-01-04T00:00:00Z',
        '2024-01-04T00:00:00Z'
    ),
    (
        5,
        'Mercedes-Benz',
        'AMG GT',
        '2021',
        'Silver',
        15000,
        'WDDYJ7JA0KA123456',
        'Automatic',
        'Petrol',
        '4.0L V8 Biturbo',
        'Silver',
        'Black',
        15000,
        'Mercedes-AMG GT with handcrafted engine and premium features.',
        '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        5,
        120000,
        135000,
        'active',
        'Mercedes-AMG GT with handcrafted performance.',
        '{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Handcrafted V8", "Magnetic ride control", "Launch control"]}',
        '15,000 miles, well-maintained, full service history.',
        'Houston, TX',
        'MercedesHouston',
        'Dealer',
        'LOT-005',
        '["Handcrafted engine", "Clean title", "AMG package"]',
        5,
        '0xdef456ghi789abc123',
        '2024-01-05T00:00:00Z',
        '2024-01-05T00:00:00Z'
    ),
    (
        6,
        'Ford',
        'Mustang GT',
        '1969',
        'Blue',
        45000,
        '9F02R123456',
        'Manual',
        'Petrol',
        '5.0L V8',
        'Blue',
        'Black',
        45000,
        'Classic 1969 Ford Mustang GT in excellent condition.',
        '["https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        6,
        45000,
        52000,
        'active',
        'Classic 1969 Ford Mustang GT.',
        '{"inspection": "passed", "notes": "restored", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history", "Restoration documents"]',
        '{"interior": ["Vinyl seats", "Original trim", "AM radio"], "exterior": ["Original paint", "Chrome trim", "Classic wheels"], "mechanical": ["Original engine", "Manual transmission", "Classic suspension"]}',
        '45,000 miles, fully restored, matching numbers.',
        'Detroit, MI',
        'ClassicCarDetroit',
        'Dealer',
        'LOT-006',
        '["Classic", "Restored", "Matching numbers"]',
        6,
        '0xghi789abc123def456',
        '2024-01-06T00:00:00Z',
        '2024-01-06T00:00:00Z'
    ),
    (
        7,
        'Chevrolet',
        'Corvette Stingray',
        '1967',
        'Red',
        38000,
        '194677S123456',
        'Manual',
        'Petrol',
        '5.7L V8',
        'Red',
        'Black',
        38000,
        'Iconic 1967 Chevrolet Corvette Stingray.',
        '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        7,
        65000,
        72000,
        'active',
        'Iconic 1967 Chevrolet Corvette Stingray.',
        '{"inspection": "passed", "notes": "restored", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history", "Restoration documents"]',
        '{"interior": ["Vinyl seats", "Original trim", "AM radio"], "exterior": ["Original paint", "Chrome trim", "Classic wheels"], "mechanical": ["Original engine", "Manual transmission", "Classic suspension"]}',
        '38,000 miles, fully restored, matching numbers.',
        'Atlanta, GA',
        'ClassicCarAtlanta',
        'Dealer',
        'LOT-007',
        '["Classic", "Restored", "Matching numbers"]',
        7,
        '0xabc123def456ghi789',
        '2024-01-07T00:00:00Z',
        '2024-01-07T00:00:00Z'
    ),
    (
        8,
        'Tesla',
        'Model S Plaid',
        '2023',
        'White',
        3000,
        '5YJS4E12345678901',
        'Automatic',
        'Electric',
        'Tri-Motor',
        'White',
        'Black',
        3000,
        'Tesla Model S Plaid with incredible performance.',
        '["https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        8,
        120000,
        125000,
        'active',
        'Tesla Model S Plaid with incredible performance.',
        '{"inspection": "passed", "notes": "like new", "condition": "mint"}',
        '["Owner''s manual", "Charging cable", "Extra key", "Service history"]',
        '{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Glass roof", "Carbon fiber body"], "mechanical": ["Tri-motor setup", "Autopilot", "Launch control"]}',
        'Only 3,000 miles, like new condition.',
        'San Francisco, CA',
        'TeslaSF',
        'Dealer',
        'LOT-008',
        '["Electric", "Low mileage", "Plaid performance"]',
        8,
        '0xdef456ghi789abc123',
        '2024-01-08T00:00:00Z',
        '2024-01-08T00:00:00Z'
    ),
    (
        9,
        'Porsche',
        'Taycan Turbo S',
        '2022',
        'Blue',
        12000,
        'WP0AB2Y1234567890',
        'Automatic',
        'Electric',
        'Dual-Motor',
        'Blue',
        'Black',
        12000,
        'Porsche Taycan Turbo S with incredible performance.',
        '["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        9,
        180000,
        190000,
        'active',
        'Porsche Taycan Turbo S with incredible performance.',
        '{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
        '["Owner''s manual", "Charging cable", "Extra key", "Service history"]',
        '{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Glass roof", "Carbon fiber body"], "mechanical": ["Dual-motor setup", "Autopilot", "Launch control"]}',
        '12,000 miles, well-maintained, full service history.',
        'Seattle, WA',
        'PorscheSeattle',
        'Dealer',
        'LOT-009',
        '["Electric", "Turbo S", "Premium features"]',
        9,
        '0xghi789abc123def456',
        '2024-01-09T00:00:00Z',
        '2024-01-09T00:00:00Z'
    ),
    (
        10,
        'Range Rover',
        'Sport SVR',
        '2021',
        'Black',
        25000,
        'SALGS2SVXKA123456',
        'Automatic',
        'Petrol',
        '5.0L V8 Supercharged',
        'Black',
        'Tan',
        25000,
        'Range Rover Sport SVR with incredible performance.',
        '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        10,
        95000,
        105000,
        'active',
        'Range Rover Sport SVR with incredible performance.',
        '{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Leather seats", "Carbon fiber trim", "Premium audio"], "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"], "mechanical": ["Supercharged V8", "Magnetic ride control", "Launch control"]}',
        '25,000 miles, well-maintained, full service history.',
        'Denver, CO',
        'RangeRoverDenver',
        'Dealer',
        'LOT-010',
        '["SVR performance", "Clean title", "Premium features"]',
        10,
        '0xabc123def456ghi789',
        '2024-01-10T00:00:00Z',
        '2024-01-10T00:00:00Z'
    ),
    (
        330,
        'Ford',
        'GT Holman Moody Heritage Edition',
        '2022',
        'Gulf Racing Blue',
        2500,
        'WF0AF2A96JGL12345',
        'Automatic',
        'Petrol',
        '3.5L Twin-Turbo V6',
        'Gulf Racing Blue',
        'Carbon Fiber with Alcantara',
        2500,
        'This exceptional 2022 Ford GT Holman Moody Heritage Edition represents the pinnacle of American automotive engineering and racing heritage. With only 2,500 miles on the odometer, this pristine example showcases the legendary partnership between Ford and Holman Moody Racing.',
        '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        330,
        500000,
        701500,
        'active',
        'Exceptional Ford GT Heritage Edition with racing pedigree.',
        '{"inspection": "passed", "notes": "pristine condition", "condition": "mint"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Complete service records", "Heritage documentation"]',
        '{"interior": ["Carbon Fiber Body Panels", "Track Package", "Racing Harnesses", "Roll Cage"], "exterior": ["Michelin Pilot Sport Cup 2 Tires", "Carbon Fiber Interior Trim", "Titanium Roll Cage"], "mechanical": ["Traction Management System", "Launch Control", "Bilstein Adaptive Dampers"]}',
        'Originally delivered to Holman Moody Racing for development testing, meticulously maintained by authorized Ford technicians.',
        'Cologne, Germany',
        'Premium Automotive Collection',
        'Dealer',
        'LOT-330',
        '["Heritage Edition", "Track Package", "Carbon Fiber"]',
        330,
        '0x330abc456def789ghi',
        '2024-01-01T00:00:00Z',
        '2024-01-01T00:00:00Z'
    ),
    (
        334,
        'Morgan',
        'Aero 8 Supersports',
        '2011',
        'Silver',
        15000,
        'SAJAA01A8BLM12345',
        'Automatic',
        'Petrol',
        '4.8L V8',
        'Silver',
        'Black Leather',
        15000,
        'A rare Morgan Aero 8 Supersports, combining British craftsmanship with modern performance. Low mileage, well maintained.',
        '["https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        334,
        80000,
        96000,
        'active',
        'Rare Morgan Aero 8 Supersports with British craftsmanship.',
        '{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Convertible Roof", "Premium Audio", "Navigation", "Leather Seats"], "exterior": ["Alloy Wheels", "LED lights"], "mechanical": ["V8 Engine", "Sport Suspension"]}',
        'Single owner, always garaged, full service history.',
        'Dubai, United Arab Emirates',
        'Morgan Dubai',
        'Dealer',
        'LOT-334',
        '["British Heritage", "Low mileage", "Convertible"]',
        334,
        '0x334def789ghi123abc',
        '2024-01-02T00:00:00Z',
        '2024-01-02T00:00:00Z'
    ),
    (
        335,
        'Ferrari',
        '488 Spider',
        '2016',
        'Rosso Corsa',
        18000,
        'ZFF80AMA4G0234567',
        'Automatic',
        'Petrol',
        '3.9L Twin-Turbo V8',
        'Rosso Corsa',
        'Black Leather',
        18000,
        'A stunning Ferrari 488 Spider in pristine condition, finished in classic Rosso Corsa.',
        '["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        335,
        600000,
        675000,
        'active',
        'Stunning Ferrari 488 Spider in classic Rosso Corsa.',
        '{"inspection": "passed", "notes": "pristine condition", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Convertible", "Carbon Fiber Trim", "Premium Audio"], "exterior": ["Forged Alloy Wheels", "LED Headlights"], "mechanical": ["Twin-Turbo V8", "Carbon-Ceramic Brakes", "Magnetic Ride Control"]}',
        'Dealer maintained, accident free, full service history.',
        'Dubai, United Arab Emirates',
        'Ferrari Dubai',
        'Dealer',
        'LOT-335',
        '["Convertible", "Carbon Fiber", "Pristine"]',
        335,
        '0x335ghi123abc456def',
        '2024-01-03T00:00:00Z',
        '2024-01-03T00:00:00Z'
    ),
    (
        339,
        'Ferrari',
        '360 Modena',
        '2004',
        'Rosso Corsa Red',
        28000,
        'ZFFYR51A040123456',
        'Manual',
        'Petrol',
        '3.6L Naturally Aspirated V8',
        'Rosso Corsa Red',
        'Tan Leather with Carbon Fiber',
        28000,
        'A stunning example of Ferrari''s legendary 360 Modena, this 2004 model represents the perfect balance of classic Ferrari design and modern performance. With its naturally aspirated V8 engine and timeless silhouette, this Modena continues the proud tradition of mid-engine Ferrari excellence.',
        '["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        339,
        65000,
        81000,
        'active',
        'Classic Ferrari 360 Modena with naturally aspirated V8.',
        '{"inspection": "passed", "notes": "well maintained", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service records", "Tubi exhaust documentation"]',
        '{"interior": ["F1 Paddle Shift Transmission", "Carbon Fiber Interior Accents", "Sport Seats", "Navigation System"], "exterior": ["18 Challenge Stradale Wheels", "Yellow Brake Calipers", "Scuderia Ferrari Shields"], "mechanical": ["Tubi Exhaust System", "Premium Audio System", "Climate Control"]}',
        'California car with clean Carfax, complete maintenance records available.',
        'Riverside, CA, USA',
        'Classic Ferrari Specialists',
        'Dealer',
        'LOT-339',
        '["F1 Transmission", "Tubi Exhaust", "Clean Carfax"]',
        339,
        '0x339abc123def456ghi',
        '2024-01-04T00:00:00Z',
        '2024-01-04T00:00:00Z'
    ),
    (
        289,
        'Bentley',
        'GT W12 Speed',
        '2024',
        'Blue',
        55,
        'SCBCE8ZA6PC012345',
        'Automatic',
        'Petrol',
        '6.0L W12 Twin-Turbo',
        'Blue',
        'White Leather',
        55,
        'Brand new Bentley GT W12 Speed with only 55km on the clock. Ultimate luxury and performance.',
        '["https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        289,
        180000,
        201000,
        'active',
        'Brand new Bentley GT W12 Speed with delivery mileage.',
        '{"inspection": "passed", "notes": "brand new", "condition": "mint"}',
        '["Owner''s manual", "Tool kit", "All keys", "Warranty documentation"]',
        '{"interior": ["Heated Seats", "Massage Seats", "Premium Audio", "Climate Control"], "exterior": ["21 Alloy Wheels", "LED Headlights"], "mechanical": ["W12 Twin-Turbo", "All-Wheel Drive", "Carbon-Ceramic Brakes"]}',
        'Brand new, delivery mileage only, full warranty.',
        'Bautzen, Germany',
        'Bentley Bautzen',
        'Dealer',
        'LOT-289',
        '["Brand New", "W12 Engine", "Ultimate Luxury"]',
        289,
        '0x289def456ghi789abc',
        '2024-01-05T00:00:00Z',
        '2024-01-05T00:00:00Z'
    ),
    (
        327,
        'Nissan',
        'Skyline R34 GT-R',
        '1999',
        'Midnight Purple II',
        45000,
        'BNR34-123456',
        'Manual',
        'Petrol',
        '2.6L Twin-Turbo I6 (RB26DETT)',
        'Midnight Purple II',
        'Black Cloth with Alcantara',
        45000,
        'An iconic 1999 Nissan Skyline R34 GT-R, the final and most refined iteration of the legendary GT-R lineage. This example features the legendary RB26DETT twin-turbo inline-6 engine and ATTESA E-TS Pro all-wheel drive system that made the R34 a legend on both street and track.',
        '["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        327,
        120000,
        155000,
        'active',
        'Iconic R34 GT-R with legendary RB26DETT engine.',
        '{"inspection": "passed", "notes": "well maintained", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Import documentation", "Performance upgrade records"]',
        '{"interior": ["ATTESA E-TS Pro AWD System", "Active LSD", "Multi-Function Display", "Recaro Sport Seats"], "exterior": ["18 BBS LM Wheels", "HICAS 4-Wheel Steering"], "mechanical": ["Nismo Exhaust System", "Boost Controller", "Oil Cooler", "Strut Tower Brace"]}',
        'JDM import with documented history, performance upgrades while maintaining authentic character.',
        'Dubai, United Arab Emirates',
        'JDM Legends Dubai',
        'Dealer',
        'LOT-327',
        '["JDM Import", "RB26DETT", "Performance Upgrades"]',
        327,
        '0x327ghi789abc123def',
        '2024-01-06T00:00:00Z',
        '2024-01-06T00:00:00Z'
    ),
    (
        343,
        'Mercedes-Benz',
        'AMG GT 63 S Brabus 800',
        '2020',
        'Black',
        12000,
        'WDD1782X0LA123456',
        'Automatic',
        'Petrol',
        '4.0L V8 Biturbo',
        'Black',
        'Red Leather',
        12000,
        'A rare Brabus 800 edition of the AMG GT 63 S, with full options and low mileage.',
        '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        343,
        250000,
        285000,
        'active',
        'Rare Brabus 800 edition with incredible performance.',
        '{"inspection": "passed", "notes": "showroom condition", "condition": "mint"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Brabus documentation"]',
        '{"interior": ["Brabus Package", "Panoramic Roof", "Burmester Audio"], "exterior": ["Brabus Monoblock Wheels", "Carbon Fiber Elements"], "mechanical": ["800hp Brabus Tune", "Carbon-Ceramic Brakes", "Sport Exhaust"]}',
        'One owner, showroom condition, full Brabus package.',
        'Dubai, United Arab Emirates',
        'Brabus Dubai',
        'Dealer',
        'LOT-343',
        '["Brabus 800", "One Owner", "800hp"]',
        343,
        '0x343abc123def456ghi',
        '2024-01-07T00:00:00Z',
        '2024-01-07T00:00:00Z'
    ),
    (
        336,
        'Nissan',
        'GT-R 50th Anniversary',
        '2020',
        'Pearl White',
        8000,
        'JN1AR5EF5LM123456',
        'Automatic',
        'Petrol',
        '3.8L Twin-Turbo V6',
        'Pearl White',
        'Black and Red',
        8000,
        'Special 50th Anniversary edition GT-R with unique styling and performance enhancements.',
        '["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        336,
        250000,
        275000,
        'active',
        'Special 50th Anniversary GT-R edition.',
        '{"inspection": "passed", "notes": "excellent condition", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Anniversary documentation"]',
        '{"interior": ["Anniversary Interior", "Premium Audio", "Carbon Trim"], "exterior": ["Special Paint", "Anniversary Wheels", "Unique Badges"], "mechanical": ["Twin-Turbo V6", "AWD System", "Launch Control"]}',
        'Low mileage 50th Anniversary edition with all special features.',
        'Dubai, United Arab Emirates',
        'Nissan Heritage Dubai',
        'Dealer',
        'LOT-336',
        '["50th Anniversary", "Special Edition", "Low Mileage"]',
        336,
        '0x336def456ghi789abc',
        '2024-01-08T00:00:00Z',
        '2024-01-08T00:00:00Z'
    ),
    (
        345,
        'Mercedes-Benz',
        'Metris Custom',
        '2023',
        'White',
        240,
        'WD3PE7CD5NP123456',
        'Automatic',
        'Petrol',
        '2.0L Turbo I4',
        'White',
        'Black',
        240,
        'Custom Mercedes Metris van with only 240 miles, perfect for luxury transport or conversion.',
        '["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        345,
        55000,
        65000,
        'active',
        'Custom Mercedes Metris with ultra-low mileage.',
        '{"inspection": "passed", "notes": "like new", "condition": "mint"}',
        '["Owner''s manual", "Tool kit", "All keys", "Custom build documentation"]',
        '{"interior": ["Custom Interior", "Premium Audio", "Climate Control"], "exterior": ["Custom Paint", "Alloy Wheels"], "mechanical": ["Turbo Engine", "Automatic Transmission"]}',
        'Only 240 miles, custom build, like new condition.',
        'Los Angeles, CA, USA',
        'Custom Van Specialists',
        'Dealer',
        'LOT-345',
        '["Ultra Low Miles", "Custom Build", "Like New"]',
        345,
        '0x345ghi789abc123def',
        '2024-01-09T00:00:00Z',
        '2024-01-09T00:00:00Z'
    ),
    (
        346,
        'Porsche',
        '356 B',
        '1962',
        'Silver',
        65000,
        '220356B123456',
        'Manual',
        'Petrol',
        '1.6L Flat-4',
        'Silver',
        'Black',
        65000,
        'Classic 1962 Porsche 356 B in excellent condition, a true collector''s piece.',
        '["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        346,
        20000,
        25000,
        'active',
        'Classic Porsche 356 B collector''s piece.',
        '{"inspection": "passed", "notes": "restored", "condition": "excellent"}',
        '["Owner''s manual", "Tool kit", "Restoration documentation", "Authenticity certificate"]',
        '{"interior": ["Original Interior", "Classic Gauges", "Period Radio"], "exterior": ["Chrome Bumpers", "Classic Wheels", "Original Trim"], "mechanical": ["Flat-4 Engine", "Manual Transmission", "Classic Suspension"]}',
        'Restored classic with matching numbers and excellent provenance.',
        'Bridgeport, CT, USA',
        'Classic Porsche Specialists',
        'Dealer',
        'LOT-346',
        '["Classic", "Restored", "Matching Numbers"]',
        346,
        '0x346abc123def456ghi',
        '2024-01-10T00:00:00Z',
        '2024-01-10T00:00:00Z'
    ),
    (
        331,
        'Audi',
        'R8',
        '2020',
        'Black',
        15000,
        'WUAAAAFY0L7123456',
        'Automatic',
        'Petrol',
        '5.2L V10',
        'Black',
        'Black',
        15000,
        'Modified Audi R8 with 1,300 hp, extreme performance build.',
        '["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        331,
        20000,
        25000,
        'active',
        'Heavily modified Audi R8 with 1,300 hp.',
        '{"inspection": "passed", "notes": "heavily modified", "condition": "modified"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Modification documentation"]',
        '{"interior": ["Racing Interior", "Carbon Trim", "Roll Cage"], "exterior": ["Wide Body Kit", "Carbon Fiber", "Racing Wheels"], "mechanical": ["1300hp Engine", "Turbo Kit", "Racing Suspension"]}',
        'Heavily modified for extreme performance, 1,300 hp build.',
        'Opa-locka, FL, USA',
        'Performance Specialists',
        'Dealer',
        'LOT-331',
        '["1300hp", "Heavily Modified", "Extreme Performance"]',
        331,
        '0x331def456ghi789abc',
        '2024-01-11T00:00:00Z',
        '2024-01-11T00:00:00Z'
    ),
    (
        340,
        'Dodge',
        'Viper SRT-10 Roadster',
        '2010',
        'Red',
        25000,
        '1B3JZ65Z2AV123456',
        'Manual',
        'Petrol',
        '8.4L V10',
        'Red',
        'Black',
        25000,
        'Classic American supercar with massive V10 engine and convertible top.',
        '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]',
        340,
        15000,
        19000,
        'active',
        'Classic Dodge Viper SRT-10 Roadster.',
        '{"inspection": "passed", "notes": "good condition", "condition": "good"}',
        '["Owner''s manual", "Tool kit", "Extra key", "Service history"]',
        '{"interior": ["Sport Seats", "Manual Top", "Basic Audio"], "exterior": ["Convertible Top", "Alloy Wheels", "Side Pipes"], "mechanical": ["8.4L V10", "Manual Transmission", "Sport Suspension"]}',
        'Classic American supercar with massive naturally aspirated V10.',
        'Houston, TX, USA',
        'American Muscle Cars',
        'Dealer',
        'LOT-340',
        '["V10 Engine", "Convertible", "American Muscle"]',
        340,
        '0x340ghi789abc123def',
        '2024-01-12T00:00:00Z',
        '2024-01-12T00:00:00Z'
    );

-- Insert Auctions (22 total auctions)
INSERT INTO
    auction (
        id,
        car_id,
        start_time,
        end_time,
        current_bid,
        bid_count,
        seller,
        status,
        created_at,
        updated_at
    )
VALUES
    -- Original 10 auctions
    (
        1,
        1,
        '2024-01-15T00:00:00Z',
        '2024-01-22T00:00:00Z',
        215000,
        5,
        '0x123abc456def789ghi',
        'active',
        '2024-01-15T00:00:00Z',
        '2024-01-15T00:00:00Z'
    ),
    (
        2,
        2,
        '2024-01-16T00:00:00Z',
        '2024-01-23T00:00:00Z',
        195000,
        3,
        '0x456def789ghi123abc',
        'active',
        '2024-01-16T00:00:00Z',
        '2024-01-16T00:00:00Z'
    ),
    (
        3,
        3,
        '2024-01-17T00:00:00Z',
        '2024-01-24T00:00:00Z',
        235000,
        7,
        '0x789ghi123abc456def',
        'active',
        '2024-01-17T00:00:00Z',
        '2024-01-17T00:00:00Z'
    ),
    (
        4,
        4,
        '2024-01-18T00:00:00Z',
        '2024-01-25T00:00:00Z',
        92000,
        4,
        '0xabc123def456ghi789',
        'active',
        '2024-01-18T00:00:00Z',
        '2024-01-18T00:00:00Z'
    ),
    (
        5,
        5,
        '2024-01-19T00:00:00Z',
        '2024-01-26T00:00:00Z',
        135000,
        6,
        '0xdef456ghi789abc123',
        'active',
        '2024-01-19T00:00:00Z',
        '2024-01-19T00:00:00Z'
    ),
    (
        6,
        6,
        '2024-01-20T00:00:00Z',
        '2024-01-27T00:00:00Z',
        52000,
        8,
        '0xghi789abc123def456',
        'active',
        '2024-01-20T00:00:00Z',
        '2024-01-20T00:00:00Z'
    ),
    (
        7,
        7,
        '2024-01-21T00:00:00Z',
        '2024-01-28T00:00:00Z',
        72000,
        5,
        '0xabc123def456ghi789',
        'active',
        '2024-01-21T00:00:00Z',
        '2024-01-21T00:00:00Z'
    ),
    (
        8,
        8,
        '2024-01-22T00:00:00Z',
        '2024-01-29T00:00:00Z',
        125000,
        4,
        '0xdef456ghi789abc123',
        'active',
        '2024-01-22T00:00:00Z',
        '2024-01-22T00:00:00Z'
    ),
    (
        9,
        9,
        '2024-01-23T00:00:00Z',
        '2024-01-30T00:00:00Z',
        190000,
        3,
        '0xghi789abc123def456',
        'active',
        '2024-01-23T00:00:00Z',
        '2024-01-23T00:00:00Z'
    ),
    (
        10,
        10,
        '2024-01-24T00:00:00Z',
        '2024-01-31T00:00:00Z',
        105000,
        6,
        '0xabc123def456ghi789',
        'active',
        '2024-01-24T00:00:00Z',
        '2024-01-24T00:00:00Z'
    ),
    (
        330,
        330,
        '2024-06-27T00:00:00Z',
        '2024-06-28T13:06:33Z',
        701500,
        30,
        '0x330abc456def789ghi',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        334,
        334,
        '2024-06-27T00:00:00Z',
        '2024-06-28T14:36:33Z',
        96000,
        22,
        '0x334def789ghi123abc',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        335,
        335,
        '2024-06-27T00:00:00Z',
        '2024-06-28T14:56:33Z',
        675000,
        19,
        '0x335ghi123abc456def',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        339,
        339,
        '2024-06-27T00:00:00Z',
        '2024-06-28T15:36:33Z',
        81000,
        31,
        '0x339abc123def456ghi',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        289,
        289,
        '2024-06-27T00:00:00Z',
        '2024-06-29T12:36:33Z',
        201000,
        27,
        '0x289def456ghi789abc',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        327,
        327,
        '2024-06-27T00:00:00Z',
        '2024-06-29T14:36:33Z',
        155000,
        24,
        '0x327ghi789abc123def',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        343,
        343,
        '2024-06-27T00:00:00Z',
        '2024-06-29T18:00:00Z',
        285000,
        24,
        '0x343abc123def456ghi',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        336,
        336,
        '2024-06-27T00:00:00Z',
        '2024-06-30T18:00:00Z',
        275000,
        31,
        '0x336def456ghi789abc',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        345,
        345,
        '2024-06-27T00:00:00Z',
        '2024-06-30T18:00:00Z',
        65000,
        25,
        '0x345ghi789abc123def',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        346,
        346,
        '2024-06-27T00:00:00Z',
        '2024-06-30T18:00:00Z',
        25000,
        32,
        '0x346abc123def456ghi',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        331,
        331,
        '2024-06-27T00:00:00Z',
        '2024-07-01T18:00:00Z',
        25000,
        32,
        '0x331def456ghi789abc',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    ),
    (
        340,
        340,
        '2024-06-27T00:00:00Z',
        '2024-07-01T18:00:00Z',
        19000,
        18,
        '0x340ghi789abc123def',
        'active',
        '2024-06-27T00:00:00Z',
        '2024-06-27T00:00:00Z'
    );

-- Insert sample bids for all 22 auctions
INSERT INTO
    bid (
        id,
        auction_id,
        bidder_id,
        amount,
        created_at,
        updated_at
    )
VALUES
    -- Original car bids (IDs 1-50)
    (
        1,
        1,
        1,
        200000,
        '2024-01-15T10:00:00Z',
        '2024-01-15T10:00:00Z'
    ),
    (
        2,
        1,
        2,
        205000,
        '2024-01-15T11:30:00Z',
        '2024-01-15T11:30:00Z'
    ),
    (
        3,
        1,
        3,
        210000,
        '2024-01-15T14:15:00Z',
        '2024-01-15T14:15:00Z'
    ),
    (
        4,
        1,
        1,
        212000,
        '2024-01-15T16:45:00Z',
        '2024-01-15T16:45:00Z'
    ),
    (
        5,
        1,
        4,
        215000,
        '2024-01-15T18:20:00Z',
        '2024-01-15T18:20:00Z'
    ),
    (
        6,
        2,
        2,
        180000,
        '2024-01-16T09:00:00Z',
        '2024-01-16T09:00:00Z'
    ),
    (
        7,
        2,
        5,
        185000,
        '2024-01-16T12:30:00Z',
        '2024-01-16T12:30:00Z'
    ),
    (
        8,
        2,
        1,
        195000,
        '2024-01-16T15:45:00Z',
        '2024-01-16T15:45:00Z'
    ),
    (
        9,
        3,
        3,
        220000,
        '2024-01-17T08:00:00Z',
        '2024-01-17T08:00:00Z'
    ),
    (
        10,
        3,
        6,
        225000,
        '2024-01-17T10:30:00Z',
        '2024-01-17T10:30:00Z'
    ),
    (
        11,
        3,
        1,
        230000,
        '2024-01-17T13:15:00Z',
        '2024-01-17T13:15:00Z'
    ),
    (
        12,
        3,
        7,
        232000,
        '2024-01-17T16:45:00Z',
        '2024-01-17T16:45:00Z'
    ),
    (
        13,
        3,
        3,
        235000,
        '2024-01-17T19:20:00Z',
        '2024-01-17T19:20:00Z'
    ),
    (
        14,
        4,
        4,
        85000,
        '2024-01-18T09:30:00Z',
        '2024-01-18T09:30:00Z'
    ),
    (
        15,
        4,
        8,
        87000,
        '2024-01-18T12:00:00Z',
        '2024-01-18T12:00:00Z'
    ),
    (
        16,
        4,
        2,
        90000,
        '2024-01-18T15:30:00Z',
        '2024-01-18T15:30:00Z'
    ),
    (
        17,
        4,
        4,
        92000,
        '2024-01-18T18:45:00Z',
        '2024-01-18T18:45:00Z'
    ),
    (
        18,
        5,
        5,
        120000,
        '2024-01-19T10:00:00Z',
        '2024-01-19T10:00:00Z'
    ),
    (
        19,
        5,
        9,
        125000,
        '2024-01-19T13:30:00Z',
        '2024-01-19T13:30:00Z'
    ),
    (
        20,
        5,
        1,
        130000,
        '2024-01-19T16:15:00Z',
        '2024-01-19T16:15:00Z'
    ),
    (
        21,
        5,
        5,
        132000,
        '2024-01-19T19:45:00Z',
        '2024-01-19T19:45:00Z'
    ),
    (
        22,
        5,
        3,
        135000,
        '2024-01-19T21:30:00Z',
        '2024-01-19T21:30:00Z'
    ),
    (
        23,
        6,
        6,
        45000,
        '2024-01-20T08:30:00Z',
        '2024-01-20T08:30:00Z'
    ),
    (
        24,
        6,
        10,
        47000,
        '2024-01-20T11:00:00Z',
        '2024-01-20T11:00:00Z'
    ),
    (
        25,
        6,
        2,
        49000,
        '2024-01-20T14:30:00Z',
        '2024-01-20T14:30:00Z'
    ),
    (
        26,
        6,
        6,
        50000,
        '2024-01-20T17:15:00Z',
        '2024-01-20T17:15:00Z'
    ),
    (
        27,
        6,
        4,
        51000,
        '2024-01-20T19:45:00Z',
        '2024-01-20T19:45:00Z'
    ),
    (
        28,
        6,
        6,
        52000,
        '2024-01-20T21:30:00Z',
        '2024-01-20T21:30:00Z'
    ),
    (
        29,
        7,
        7,
        65000,
        '2024-01-21T09:15:00Z',
        '2024-01-21T09:15:00Z'
    ),
    (
        30,
        7,
        1,
        67000,
        '2024-01-21T12:45:00Z',
        '2024-01-21T12:45:00Z'
    ),
    (
        31,
        7,
        3,
        69000,
        '2024-01-21T16:30:00Z',
        '2024-01-21T16:30:00Z'
    ),
    (
        32,
        7,
        7,
        70000,
        '2024-01-21T19:15:00Z',
        '2024-01-21T19:15:00Z'
    ),
    (
        33,
        7,
        5,
        72000,
        '2024-01-21T21:45:00Z',
        '2024-01-21T21:45:00Z'
    ),
    (
        34,
        8,
        8,
        120000,
        '2024-01-22T10:30:00Z',
        '2024-01-22T10:30:00Z'
    ),
    (
        35,
        8,
        2,
        122000,
        '2024-01-22T13:00:00Z',
        '2024-01-22T13:00:00Z'
    ),
    (
        36,
        8,
        4,
        124000,
        '2024-01-22T16:30:00Z',
        '2024-01-22T16:30:00Z'
    ),
    (
        37,
        8,
        8,
        125000,
        '2024-01-22T19:15:00Z',
        '2024-01-22T19:15:00Z'
    ),
    (
        38,
        9,
        9,
        180000,
        '2024-01-23T11:00:00Z',
        '2024-01-23T11:00:00Z'
    ),
    (
        39,
        9,
        1,
        185000,
        '2024-01-23T14:30:00Z',
        '2024-01-23T14:30:00Z'
    ),
    (
        40,
        9,
        6,
        190000,
        '2024-01-23T17:45:00Z',
        '2024-01-23T17:45:00Z'
    ),
    (
        41,
        10,
        10,
        95000,
        '2024-01-24T09:45:00Z',
        '2024-01-24T09:45:00Z'
    ),
    (
        42,
        10,
        3,
        98000,
        '2024-01-24T12:15:00Z',
        '2024-01-24T12:15:00Z'
    ),
    (
        43,
        10,
        7,
        100000,
        '2024-01-24T15:30:00Z',
        '2024-01-24T15:30:00Z'
    ),
    (
        44,
        10,
        10,
        102000,
        '2024-01-24T18:45:00Z',
        '2024-01-24T18:45:00Z'
    ),
    (
        45,
        10,
        5,
        104000,
        '2024-01-24T21:15:00Z',
        '2024-01-24T21:15:00Z'
    ),
    (
        46,
        10,
        10,
        105000,
        '2024-01-24T23:30:00Z',
        '2024-01-24T23:30:00Z'
    ),
    (
        51,
        330,
        1,
        500000,
        '2024-06-27T10:00:00Z',
        '2024-06-27T10:00:00Z'
    ),
    (
        52,
        330,
        2,
        650000,
        '2024-06-27T11:30:00Z',
        '2024-06-27T11:30:00Z'
    ),
    (
        53,
        330,
        3,
        680000,
        '2024-06-27T14:15:00Z',
        '2024-06-27T14:15:00Z'
    ),
    (
        54,
        330,
        1,
        700000,
        '2024-06-27T16:45:00Z',
        '2024-06-27T16:45:00Z'
    ),
    (
        55,
        330,
        4,
        701500,
        '2024-06-27T18:20:00Z',
        '2024-06-27T18:20:00Z'
    ),
    (
        56,
        334,
        2,
        80000,
        '2024-06-27T09:00:00Z',
        '2024-06-27T09:00:00Z'
    ),
    (
        57,
        334,
        5,
        90000,
        '2024-06-27T12:30:00Z',
        '2024-06-27T12:30:00Z'
    ),
    (
        58,
        334,
        1,
        96000,
        '2024-06-27T15:45:00Z',
        '2024-06-27T15:45:00Z'
    ),
    (
        59,
        335,
        3,
        600000,
        '2024-06-27T08:00:00Z',
        '2024-06-27T08:00:00Z'
    ),
    (
        60,
        335,
        6,
        650000,
        '2024-06-27T10:30:00Z',
        '2024-06-27T10:30:00Z'
    ),
    (
        61,
        335,
        1,
        675000,
        '2024-06-27T13:15:00Z',
        '2024-06-27T13:15:00Z'
    ),
    (
        62,
        339,
        7,
        65000,
        '2024-06-27T16:45:00Z',
        '2024-06-27T16:45:00Z'
    ),
    (
        63,
        339,
        3,
        75000,
        '2024-06-27T19:20:00Z',
        '2024-06-27T19:20:00Z'
    ),
    (
        64,
        339,
        8,
        81000,
        '2024-06-27T21:15:00Z',
        '2024-06-27T21:15:00Z'
    ),
    (
        65,
        289,
        4,
        180000,
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        66,
        289,
        8,
        190000,
        '2024-06-27T12:00:00Z',
        '2024-06-27T12:00:00Z'
    ),
    (
        67,
        289,
        2,
        201000,
        '2024-06-27T15:30:00Z',
        '2024-06-27T15:30:00Z'
    ),
    (
        68,
        327,
        5,
        120000,
        '2024-06-27T10:00:00Z',
        '2024-06-27T10:00:00Z'
    ),
    (
        69,
        327,
        9,
        140000,
        '2024-06-27T13:30:00Z',
        '2024-06-27T13:30:00Z'
    ),
    (
        70,
        327,
        1,
        155000,
        '2024-06-27T16:15:00Z',
        '2024-06-27T16:15:00Z'
    ),
    (
        71,
        343,
        6,
        250000,
        '2024-06-27T08:30:00Z',
        '2024-06-27T08:30:00Z'
    ),
    (
        72,
        343,
        10,
        270000,
        '2024-06-27T11:00:00Z',
        '2024-06-27T11:00:00Z'
    ),
    (
        73,
        343,
        2,
        285000,
        '2024-06-27T14:30:00Z',
        '2024-06-27T14:30:00Z'
    ),
    (
        74,
        336,
        7,
        250000,
        '2024-06-27T09:15:00Z',
        '2024-06-27T09:15:00Z'
    ),
    (
        75,
        336,
        1,
        260000,
        '2024-06-27T12:45:00Z',
        '2024-06-27T12:45:00Z'
    ),
    (
        76,
        336,
        3,
        275000,
        '2024-06-27T16:30:00Z',
        '2024-06-27T16:30:00Z'
    ),
    (
        77,
        345,
        8,
        55000,
        '2024-06-27T10:30:00Z',
        '2024-06-27T10:30:00Z'
    ),
    (
        78,
        345,
        2,
        60000,
        '2024-06-27T13:00:00Z',
        '2024-06-27T13:00:00Z'
    ),
    (
        79,
        345,
        4,
        65000,
        '2024-06-27T16:30:00Z',
        '2024-06-27T16:30:00Z'
    ),
    (
        80,
        346,
        9,
        20000,
        '2024-06-27T11:00:00Z',
        '2024-06-27T11:00:00Z'
    ),
    (
        81,
        346,
        1,
        22000,
        '2024-06-27T14:30:00Z',
        '2024-06-27T14:30:00Z'
    ),
    (
        82,
        346,
        6,
        25000,
        '2024-06-27T17:45:00Z',
        '2024-06-27T17:45:00Z'
    ),
    (
        83,
        331,
        10,
        20000,
        '2024-06-27T09:45:00Z',
        '2024-06-27T09:45:00Z'
    ),
    (
        84,
        331,
        3,
        22000,
        '2024-06-27T12:15:00Z',
        '2024-06-27T12:15:00Z'
    ),
    (
        85,
        331,
        7,
        25000,
        '2024-06-27T15:30:00Z',
        '2024-06-27T15:30:00Z'
    ),
    (
        86,
        340,
        5,
        15000,
        '2024-06-27T21:15:00Z',
        '2024-06-27T21:15:00Z'
    ),
    (
        87,
        340,
        8,
        17000,
        '2024-06-27T22:30:00Z',
        '2024-06-27T22:30:00Z'
    ),
    (
        88,
        340,
        4,
        19000,
        '2024-06-27T23:45:00Z',
        '2024-06-27T23:45:00Z'
    );

-- Insert Comments for all 22 auctions
INSERT INTO
    comment (
        id,
        auction_id,
        user,
        content,
        created_at,
        updated_at
    )
VALUES
    -- Original car comments
    (
        1,
        1,
        'john_doe',
        'Beautiful Ferrari 488 GTB! What''s the service history like?',
        '2024-01-15T10:30:00Z',
        '2024-01-15T10:30:00Z'
    ),
    (
        2,
        1,
        'jane_smith',
        'Is this the original paint? Looks pristine!',
        '2024-01-15T11:45:00Z',
        '2024-01-15T11:45:00Z'
    ),
    (
        3,
        2,
        'mike_wilson',
        'Stunning Huracán! How many owners has it had?',
        '2024-01-16T14:20:00Z',
        '2024-01-16T14:20:00Z'
    ),
    (
        4,
        2,
        'sarah_jones',
        'That yellow is gorgeous! Any modifications?',
        '2024-01-16T09:30:00Z',
        '2024-01-16T09:30:00Z'
    ),
    (
        5,
        3,
        'david_brown',
        'GT3 RS is the ultimate track car! Track history?',
        '2024-01-17T12:15:00Z',
        '2024-01-17T12:15:00Z'
    ),
    (
        6,
        3,
        'lisa_garcia',
        'White on black looks amazing! Original wheels?',
        '2024-01-17T08:30:00Z',
        '2024-01-17T08:30:00Z'
    ),
    (
        7,
        4,
        'tom_lee',
        'M4 Competition is perfect! Any accidents?',
        '2024-01-18T10:45:00Z',
        '2024-01-18T10:45:00Z'
    ),
    (
        8,
        5,
        'amy_chen',
        'AMG GT looks great! Maintenance records?',
        '2024-01-19T09:45:00Z',
        '2024-01-19T09:45:00Z'
    ),
    (
        9,
        6,
        'chris_martin',
        'Classic Mustang GT! Numbers matching?',
        '2024-01-20T10:30:00Z',
        '2024-01-20T10:30:00Z'
    ),
    (
        10,
        7,
        'emma_davis',
        'Corvette Stingray is iconic! Original engine?',
        '2024-01-21T08:45:00Z',
        '2024-01-21T08:45:00Z'
    ),
    (
        11,
        8,
        'alex_taylor',
        'Tesla Plaid is incredible! Battery health?',
        '2024-01-22T09:30:00Z',
        '2024-01-22T09:30:00Z'
    ),
    (
        12,
        9,
        'sophie_white',
        'Taycan Turbo S is beautiful! Range specs?',
        '2024-01-23T10:45:00Z',
        '2024-01-23T10:45:00Z'
    ),
    (
        13,
        10,
        'ryan_clark',
        'Range Rover SVR is perfect! Off-road use?',
        '2024-01-24T11:15:00Z',
        '2024-01-24T11:15:00Z'
    ),
    (
        14,
        330,
        'john_doe',
        'Incredible Ford GT Heritage Edition! The Gulf livery is perfect. Service history?',
        '2024-06-27T10:30:00Z',
        '2024-06-27T10:30:00Z'
    ),
    (
        15,
        330,
        'jane_smith',
        'Heritage Edition is so rare! Is this original paint?',
        '2024-06-27T11:45:00Z',
        '2024-06-27T11:45:00Z'
    ),
    (
        16,
        330,
        'mike_wilson',
        'Dream car! How many Heritage Editions exist?',
        '2024-06-27T14:20:00Z',
        '2024-06-27T14:20:00Z'
    ),
    (
        17,
        334,
        'sarah_jones',
        'Beautiful Morgan! Classic British craftsmanship. Modifications?',
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        18,
        334,
        'david_brown',
        'What''s the mileage? Always garaged?',
        '2024-06-27T12:15:00Z',
        '2024-06-27T12:15:00Z'
    ),
    (
        19,
        335,
        'lisa_garcia',
        'Stunning 488 Spider! Convertible top condition?',
        '2024-06-27T08:30:00Z',
        '2024-06-27T08:30:00Z'
    ),
    (
        20,
        335,
        'tom_lee',
        'Rosso Corsa is perfect! Any track use?',
        '2024-06-27T10:45:00Z',
        '2024-06-27T10:45:00Z'
    ),
    (
        21,
        339,
        'amy_chen',
        '360 Modena classic! F1 transmission condition?',
        '2024-06-27T09:45:00Z',
        '2024-06-27T09:45:00Z'
    ),
    (
        22,
        339,
        'chris_martin',
        'Tubi exhaust sounds amazing! Service records?',
        '2024-06-27T16:30:00Z',
        '2024-06-27T16:30:00Z'
    ),
    (
        23,
        289,
        'emma_davis',
        'Brand new Bentley! Only 55km incredible. Options?',
        '2024-06-27T08:45:00Z',
        '2024-06-27T08:45:00Z'
    ),
    (
        24,
        327,
        'alex_taylor',
        'R34 GT-R legend! Midnight Purple II authentic?',
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        25,
        327,
        'sophie_white',
        'RB26DETT best engine ever! Modifications?',
        '2024-06-27T11:45:00Z',
        '2024-06-27T11:45:00Z'
    ),
    (
        26,
        343,
        'ryan_clark',
        'Brabus 800! Serious power. Dyno tested?',
        '2024-06-27T11:15:00Z',
        '2024-06-27T11:15:00Z'
    ),
    (
        27,
        336,
        'olivia_king',
        '50th Anniversary GT-R special! Unique features?',
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        28,
        345,
        'mark_johnson',
        'Custom Metris 240 miles! What customizations?',
        '2024-06-27T10:15:00Z',
        '2024-06-27T10:15:00Z'
    ),
    (
        29,
        346,
        'anna_wilson',
        'Classic 356B! Beautiful restoration. Matching numbers?',
        '2024-06-27T11:30:00Z',
        '2024-06-27T11:30:00Z'
    ),
    (
        30,
        331,
        'carlos_rodriguez',
        '1300hp R8?! Insane! Turbo setup details?',
        '2024-06-27T12:45:00Z',
        '2024-06-27T12:45:00Z'
    ),
    (
        31,
        340,
        'melissa_brown',
        'Classic Viper! V10 sound unmatched. Original engine?',
        '2024-06-27T14:00:00Z',
        '2024-06-27T14:00:00Z'
    );

-- Insert Saved Auctions for all 22 cars
INSERT INTO
    saved_auction (
        id,
        user,
        auction_id,
        created_at
    )
VALUES
    -- Original cars saved auctions
    (
        1,
        'john_doe',
        1,
        '2024-01-15T10:00:00Z'
    ),
    (
        2,
        'jane_smith',
        1,
        '2024-01-15T11:00:00Z'
    ),
    (
        3,
        'mike_wilson',
        2,
        '2024-01-16T12:00:00Z'
    ),
    (
        4,
        'sarah_jones',
        2,
        '2024-01-16T09:00:00Z'
    ),
    (
        5,
        'david_brown',
        3,
        '2024-01-17T10:00:00Z'
    ),
    (
        6,
        'lisa_garcia',
        3,
        '2024-01-17T08:00:00Z'
    ),
    (
        7,
        'tom_lee',
        4,
        '2024-01-18T09:00:00Z'
    ),
    (
        8,
        'amy_chen',
        5,
        '2024-01-19T09:00:00Z'
    ),
    (
        9,
        'chris_martin',
        6,
        '2024-01-20T10:00:00Z'
    ),
    (
        10,
        'emma_davis',
        7,
        '2024-01-21T08:00:00Z'
    ),
    (
        11,
        'alex_taylor',
        8,
        '2024-01-22T09:00:00Z'
    ),
    (
        12,
        'sophie_white',
        9,
        '2024-01-23T10:00:00Z'
    ),
    (
        13,
        'ryan_clark',
        10,
        '2024-01-24T11:00:00Z'
    ),
    (
        14,
        'john_doe',
        330,
        '2024-06-27T10:00:00Z'
    ),
    (
        15,
        'jane_smith',
        330,
        '2024-06-27T11:00:00Z'
    ),
    (
        16,
        'mike_wilson',
        330,
        '2024-06-27T12:00:00Z'
    ),
    (
        17,
        'sarah_jones',
        334,
        '2024-06-27T09:00:00Z'
    ),
    (
        18,
        'david_brown',
        334,
        '2024-06-27T10:00:00Z'
    ),
    (
        19,
        'lisa_garcia',
        335,
        '2024-06-27T08:00:00Z'
    ),
    (
        20,
        'tom_lee',
        335,
        '2024-06-27T09:00:00Z'
    ),
    (
        21,
        'amy_chen',
        339,
        '2024-06-27T09:00:00Z'
    ),
    (
        22,
        'chris_martin',
        339,
        '2024-06-27T10:00:00Z'
    ),
    (
        23,
        'emma_davis',
        289,
        '2024-06-27T08:00:00Z'
    ),
    (
        24,
        'alex_taylor',
        327,
        '2024-06-27T09:00:00Z'
    ),
    (
        25,
        'sophie_white',
        327,
        '2024-06-27T10:00:00Z'
    ),
    (
        26,
        'ryan_clark',
        343,
        '2024-06-27T11:00:00Z'
    ),
    (
        27,
        'olivia_king',
        336,
        '2024-06-27T09:00:00Z'
    ),
    (
        28,
        'mark_johnson',
        345,
        '2024-06-27T10:00:00Z'
    ),
    (
        29,
        'anna_wilson',
        346,
        '2024-06-27T11:00:00Z'
    ),
    (
        30,
        'carlos_rodriguez',
        331,
        '2024-06-27T12:00:00Z'
    ),
    (
        31,
        'melissa_brown',
        340,
        '2024-06-27T14:00:00Z'
    ),
    (
        32,
        'john_doe',
        327,
        '2024-06-27T10:00:00Z'
    ),
    (
        33,
        'jane_smith',
        343,
        '2024-06-27T11:00:00Z'
    ),
    (
        34,
        'mike_wilson',
        336,
        '2024-06-27T12:00:00Z'
    ),
    (
        35,
        'sarah_jones',
        339,
        '2024-06-27T09:00:00Z'
    ),
    (
        36,
        'david_brown',
        289,
        '2024-06-27T10:00:00Z'
    ),
    (
        37,
        'lisa_garcia',
        331,
        '2024-06-27T08:00:00Z'
    ),
    (
        38,
        'tom_lee',
        340,
        '2024-06-27T09:00:00Z'
    );

-- Update auction bid counts based on actual bids
UPDATE auction
SET
    bid_count = (
        SELECT COUNT(*)
        FROM bid
        WHERE
            bid.auction_id = auction.id
    );

-- Update auction current_bid to highest bid amount
UPDATE auction
SET
    current_bid = (
        SELECT MAX(amount)
        FROM bid
        WHERE
            bid.auction_id = auction.id
    );