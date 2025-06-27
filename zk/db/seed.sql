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

-- Insert Cars (Updated with TypeScript data and real images)
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
    -- Ford GT Holman Moody Heritage Edition (ID: 330)
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

-- Morgan Aero 8 Supersports (ID: 334)
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

-- Ferrari 488 Spider (ID: 335)
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

-- Ferrari 360 Modena (ID: 339)
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

-- Bentley GT W12 Speed (ID: 289)
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

-- Nissan Skyline R34 GT-R (ID: 327)
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

-- Mercedes-Benz AMG GT 63 S Brabus 800 (ID: 343)
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

-- Nissan GT-R 50th Anniversary (ID: 336)
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

-- Mercedes-Benz Metris Custom (ID: 345)
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

-- Porsche 356 B (ID: 346)
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

-- Audi R8 (ID: 331)
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

-- Dodge Viper SRT-10 Roadster (ID: 340)
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

-- Insert Auctions (Updated to match car IDs)
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
VALUES (
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

-- Insert sample bids for the updated auctions
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
    -- Ford GT bids
    (
        1,
        330,
        1,
        500000,
        '2024-06-27T10:00:00Z',
        '2024-06-27T10:00:00Z'
    ),
    (
        2,
        330,
        2,
        650000,
        '2024-06-27T11:30:00Z',
        '2024-06-27T11:30:00Z'
    ),
    (
        3,
        330,
        3,
        680000,
        '2024-06-27T14:15:00Z',
        '2024-06-27T14:15:00Z'
    ),
    (
        4,
        330,
        1,
        700000,
        '2024-06-27T16:45:00Z',
        '2024-06-27T16:45:00Z'
    ),
    (
        5,
        330,
        4,
        701500,
        '2024-06-27T18:20:00Z',
        '2024-06-27T18:20:00Z'
    ),

-- Morgan Aero 8 bids
(
    6,
    334,
    2,
    80000,
    '2024-06-27T09:00:00Z',
    '2024-06-27T09:00:00Z'
),
(
    7,
    334,
    5,
    90000,
    '2024-06-27T12:30:00Z',
    '2024-06-27T12:30:00Z'
),
(
    8,
    334,
    1,
    96000,
    '2024-06-27T15:45:00Z',
    '2024-06-27T15:45:00Z'
),

-- Ferrari 488 Spider bids
(
    9,
    335,
    3,
    600000,
    '2024-06-27T08:00:00Z',
    '2024-06-27T08:00:00Z'
),
(
    10,
    335,
    6,
    650000,
    '2024-06-27T10:30:00Z',
    '2024-06-27T10:30:00Z'
),
(
    11,
    335,
    1,
    675000,
    '2024-06-27T13:15:00Z',
    '2024-06-27T13:15:00Z'
),

-- Ferrari 360 Modena bids
(
    12,
    339,
    7,
    65000,
    '2024-06-27T16:45:00Z',
    '2024-06-27T16:45:00Z'
),
(
    13,
    339,
    3,
    75000,
    '2024-06-27T19:20:00Z',
    '2024-06-27T19:20:00Z'
),
(
    14,
    339,
    8,
    81000,
    '2024-06-27T21:15:00Z',
    '2024-06-27T21:15:00Z'
),

-- Bentley GT W12 Speed bids
(
    15,
    289,
    4,
    180000,
    '2024-06-27T09:30:00Z',
    '2024-06-27T09:30:00Z'
),
(
    16,
    289,
    8,
    190000,
    '2024-06-27T12:00:00Z',
    '2024-06-27T12:00:00Z'
),
(
    17,
    289,
    2,
    201000,
    '2024-06-27T15:30:00Z',
    '2024-06-27T15:30:00Z'
),

-- Nissan Skyline R34 GT-R bids
(
    18,
    327,
    5,
    120000,
    '2024-06-27T10:00:00Z',
    '2024-06-27T10:00:00Z'
),
(
    19,
    327,
    9,
    140000,
    '2024-06-27T13:30:00Z',
    '2024-06-27T13:30:00Z'
),
(
    20,
    327,
    1,
    155000,
    '2024-06-27T16:15:00Z',
    '2024-06-27T16:15:00Z'
),

-- Mercedes-AMG GT 63 S Brabus 800 bids
(
    21,
    343,
    6,
    250000,
    '2024-06-27T08:30:00Z',
    '2024-06-27T08:30:00Z'
),
(
    22,
    343,
    10,
    270000,
    '2024-06-27T11:00:00Z',
    '2024-06-27T11:00:00Z'
),
(
    23,
    343,
    2,
    285000,
    '2024-06-27T14:30:00Z',
    '2024-06-27T14:30:00Z'
),

-- Nissan GT-R 50th Anniversary bids
(
    24,
    336,
    7,
    250000,
    '2024-06-27T09:15:00Z',
    '2024-06-27T09:15:00Z'
),
(
    25,
    336,
    1,
    260000,
    '2024-06-27T12:45:00Z',
    '2024-06-27T12:45:00Z'
),
(
    26,
    336,
    3,
    275000,
    '2024-06-27T16:30:00Z',
    '2024-06-27T16:30:00Z'
),

-- Mercedes Metris Custom bids
(
    27,
    345,
    8,
    55000,
    '2024-06-27T10:30:00Z',
    '2024-06-27T10:30:00Z'
),
(
    28,
    345,
    2,
    60000,
    '2024-06-27T13:00:00Z',
    '2024-06-27T13:00:00Z'
),
(
    29,
    345,
    4,
    65000,
    '2024-06-27T16:30:00Z',
    '2024-06-27T16:30:00Z'
),

-- Porsche 356 B bids
(
    30,
    346,
    9,
    20000,
    '2024-06-27T11:00:00Z',
    '2024-06-27T11:00:00Z'
),
(
    31,
    346,
    1,
    22000,
    '2024-06-27T14:30:00Z',
    '2024-06-27T14:30:00Z'
),
(
    32,
    346,
    6,
    25000,
    '2024-06-27T17:45:00Z',
    '2024-06-27T17:45:00Z'
),

-- Audi R8 bids
(
    33,
    331,
    10,
    20000,
    '2024-06-27T09:45:00Z',
    '2024-06-27T09:45:00Z'
),
(
    34,
    331,
    3,
    22000,
    '2024-06-27T12:15:00Z',
    '2024-06-27T12:15:00Z'
),
(
    35,
    331,
    7,
    25000,
    '2024-06-27T15:30:00Z',
    '2024-06-27T15:30:00Z'
),

-- Dodge Viper SRT-10 Roadster bids
(
    36,
    340,
    5,
    15000,
    '2024-06-27T21:15:00Z',
    '2024-06-27T21:15:00Z'
),
(
    37,
    340,
    8,
    17000,
    '2024-06-27T22:30:00Z',
    '2024-06-27T22:30:00Z'
),
(
    38,
    340,
    4,
    19000,
    '2024-06-27T23:45:00Z',
    '2024-06-27T23:45:00Z'
);

-- Insert Comments for the new auctions
INSERT INTO
    comment (
        id,
        auction_id,
        user,
        content,
        created_at,
        updated_at
    )
VALUES (
        1,
        330,
        'john_doe',
        'Incredible Ford GT! The Heritage Edition is so rare. What''s the service history like?',
        '2024-06-27T10:30:00Z',
        '2024-06-27T10:30:00Z'
    ),
    (
        2,
        330,
        'jane_smith',
        'Gulf livery looks amazing! Is this the original paint?',
        '2024-06-27T11:45:00Z',
        '2024-06-27T11:45:00Z'
    ),
    (
        3,
        330,
        'mike_wilson',
        'Dream car! How many of these Heritage Editions were made?',
        '2024-06-27T14:20:00Z',
        '2024-06-27T14:20:00Z'
    ),
    (
        4,
        334,
        'sarah_jones',
        'Beautiful Morgan! Love the classic British craftsmanship. Any modifications?',
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        5,
        334,
        'david_brown',
        'What''s the current mileage? Has it been garaged?',
        '2024-06-27T12:15:00Z',
        '2024-06-27T12:15:00Z'
    ),
    (
        6,
        335,
        'lisa_garcia',
        'Stunning 488 Spider! Is the convertible top in perfect working order?',
        '2024-06-27T08:30:00Z',
        '2024-06-27T08:30:00Z'
    ),
    (
        7,
        335,
        'tom_lee',
        'Rosso Corsa is the perfect color for a Ferrari. Any track use?',
        '2024-06-27T10:45:00Z',
        '2024-06-27T10:45:00Z'
    ),
    (
        8,
        339,
        'amy_chen',
        '360 Modena is a classic! Love the F1 transmission. Any clutch issues?',
        '2024-06-27T09:45:00Z',
        '2024-06-27T09:45:00Z'
    ),
    (
        9,
        339,
        'chris_martin',
        'That Tubi exhaust sounds incredible! Service records available?',
        '2024-06-27T16:30:00Z',
        '2024-06-27T16:30:00Z'
    ),
    (
        10,
        289,
        'emma_davis',
        'Brand new Bentley! Only 55km is incredible. What options does it have?',
        '2024-06-27T08:45:00Z',
        '2024-06-27T08:45:00Z'
    ),
    (
        11,
        327,
        'alex_taylor',
        'R34 GT-R! The legend itself. Is this Midnight Purple II authentic?',
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        12,
        327,
        'sophie_white',
        'RB26DETT is the best engine ever made! Any engine modifications?',
        '2024-06-27T11:45:00Z',
        '2024-06-27T11:45:00Z'
    ),
    (
        13,
        343,
        'ryan_clark',
        'Brabus 800! That''s serious power. Has it been dyno tested?',
        '2024-06-27T11:15:00Z',
        '2024-06-27T11:15:00Z'
    ),
    (
        14,
        336,
        'olivia_king',
        '50th Anniversary GT-R is special! What makes this edition unique?',
        '2024-06-27T09:30:00Z',
        '2024-06-27T09:30:00Z'
    ),
    (
        15,
        345,
        'mark_johnson',
        'Custom Metris with only 240 miles! What customizations were done?',
        '2024-06-27T10:15:00Z',
        '2024-06-27T10:15:00Z'
    ),
    (
        16,
        346,
        'anna_wilson',
        'Classic 356B! Beautiful restoration. Are the numbers matching?',
        '2024-06-27T11:30:00Z',
        '2024-06-27T11:30:00Z'
    ),
    (
        17,
        331,
        'carlos_rodriguez',
        '1300hp R8?! That''s insane! What turbo setup is used?',
        '2024-06-27T12:45:00Z',
        '2024-06-27T12:45:00Z'
    ),
    (
        18,
        340,
        'melissa_brown',
        'Classic Viper! That V10 sound is unmatched. Original engine?',
        '2024-06-27T14:00:00Z',
        '2024-06-27T14:00:00Z'
    );

-- Insert Saved Auctions for the new car auctions
INSERT INTO
    saved_auction (
        id,
        user,
        auction_id,
        created_at
    )
VALUES (
        1,
        'john_doe',
        330,
        '2024-06-27T10:00:00Z'
    ),
    (
        2,
        'jane_smith',
        330,
        '2024-06-27T11:00:00Z'
    ),
    (
        3,
        'mike_wilson',
        330,
        '2024-06-27T12:00:00Z'
    ),
    (
        4,
        'sarah_jones',
        334,
        '2024-06-27T09:00:00Z'
    ),
    (
        5,
        'david_brown',
        334,
        '2024-06-27T10:00:00Z'
    ),
    (
        6,
        'lisa_garcia',
        335,
        '2024-06-27T08:00:00Z'
    ),
    (
        7,
        'tom_lee',
        335,
        '2024-06-27T09:00:00Z'
    ),
    (
        8,
        'amy_chen',
        339,
        '2024-06-27T09:00:00Z'
    ),
    (
        9,
        'chris_martin',
        339,
        '2024-06-27T10:00:00Z'
    ),
    (
        10,
        'emma_davis',
        289,
        '2024-06-27T08:00:00Z'
    ),
    (
        11,
        'alex_taylor',
        327,
        '2024-06-27T09:00:00Z'
    ),
    (
        12,
        'sophie_white',
        327,
        '2024-06-27T10:00:00Z'
    ),
    (
        13,
        'ryan_clark',
        343,
        '2024-06-27T11:00:00Z'
    ),
    (
        14,
        'olivia_king',
        336,
        '2024-06-27T09:00:00Z'
    ),
    (
        15,
        'mark_johnson',
        345,
        '2024-06-27T10:00:00Z'
    ),
    (
        16,
        'anna_wilson',
        346,
        '2024-06-27T11:00:00Z'
    ),
    (
        17,
        'carlos_rodriguez',
        331,
        '2024-06-27T12:00:00Z'
    ),
    (
        18,
        'melissa_brown',
        340,
        '2024-06-27T14:00:00Z'
    ),
    (
        19,
        'john_doe',
        327,
        '2024-06-27T10:00:00Z'
    ),
    (
        20,
        'jane_smith',
        343,
        '2024-06-27T11:00:00Z'
    ),
    (
        21,
        'mike_wilson',
        336,
        '2024-06-27T12:00:00Z'
    ),
    (
        22,
        'sarah_jones',
        339,
        '2024-06-27T09:00:00Z'
    ),
    (
        23,
        'david_brown',
        289,
        '2024-06-27T10:00:00Z'
    ),
    (
        24,
        'lisa_garcia',
        331,
        '2024-06-27T08:00:00Z'
    ),
    (
        25,
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