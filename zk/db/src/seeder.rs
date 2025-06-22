use ::entity::{ auction, bid, car, comment, saved_auction, Status };
use sea_orm::*;
use serde_json::json;
use chrono::{ DateTime, Utc };
// use entity::{ car, auction, bid, comment, saved_auction, sea_orm_active_enums::Status };
use sea_orm::ActiveValue::Set;

pub async fn seed_database(db: &DatabaseConnection) -> Result<(), DbErr> {
    println!("🌱 Starting database seeding...");

    // Clear existing data
    clear_database(db).await?;

    // Seed cars
    let cars = seed_cars(db).await?;
    println!("✅ Seeded {} cars", cars.len());

    // Seed auctions
    let auctions = seed_auctions(db).await?;
    println!("✅ Seeded {} auctions", auctions.len());

    // Seed bids
    let bids = seed_bids(db).await?;
    println!("✅ Seeded {} bids", bids.len());

    // Seed comments
    let comments = seed_comments(db).await?;
    println!("✅ Seeded {} comments", comments.len());

    // Seed saved auctions
    let saved_auctions = seed_saved_auctions(db).await?;
    println!("✅ Seeded {} saved auctions", saved_auctions.len());

    // Update auction statistics
    update_auction_stats(db).await?;
    println!("✅ Updated auction statistics");

    println!("🎉 Database seeding completed successfully!");
    Ok(())
}

async fn clear_database(db: &DatabaseConnection) -> Result<(), DbErr> {
    // Clear in reverse order of dependencies
    saved_auction::Entity::delete_many().exec(db).await?;
    comment::Entity::delete_many().exec(db).await?;
    bid::Entity::delete_many().exec(db).await?;
    auction::Entity::delete_many().exec(db).await?;
    car::Entity::delete_many().exec(db).await?;
    Ok(())
}

async fn seed_cars(db: &DatabaseConnection) -> Result<Vec<car::Model>, DbErr> {
    let cars_data = vec![
        // Ferrari 488 GTB
        car::ActiveModel {
            id: Set(1),
            make: Set("Ferrari".to_string()),
            model: Set("488 GTB".to_string()),
            year: Set(2019),
            color: Set("Red".to_string()),
            mileage: Set(8200),
            vin: Set("ZFF79ALA4J0234001".to_string()),
            transmission: Set("Automatic".to_string()),
            fuel_type: Set("Petrol".to_string()),
            engine_size: Set("3.9L V8".to_string()),
            exterior_color: Set("Rosso Corsa".to_string()),
            interior_color: Set("Black".to_string()),
            odometer: Set(8200),
            description: Set(
                "High-performance twin-turbo V8 Ferrari in pristine condition.".to_string()
            ),
            image_url: Set(
                Some(
                    vec![
                        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80".to_string()
                    ]
                )
            ),
            auction_id: Set(1),
            starting_price: Set(200000),
            current_price: Set(215000),
            auction_status: Set(Some(Status::Active)),
            summary: Set("Iconic Ferrari 488 GTB in pristine condition.".to_string()),
            report: Set(
                json!({"inspection": "passed", "notes": "minor wear", "condition": "excellent"})
            ),
            included: Set(json!(["Owner's manual", "Tool kit", "Extra key", "Service history"])),
            features: Set(
                json!({
                "interior": ["Leather seats", "Carbon fiber trim", "Premium audio"],
                "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"],
                "mechanical": ["Turbocharged engine", "Magnetic ride control", "Launch control"]
            })
            ),
            vehicale_overview: Set(
                "Driven 8,200 miles, well-maintained, and regularly serviced.".to_string()
            ),
            location: Set("Los Angeles, CA".to_string()),
            seller: Set("SupercarDealerLA".to_string()),
            seller_type: Set("Dealer".to_string()),
            lot: Set("LOT-001".to_string()),
            highlight: Set(
                Some(
                    vec![
                        "Low mileage".to_string(),
                        "Clean title".to_string(),
                        "Sport exhaust".to_string()
                    ]
                )
            ),
            token_id: Set(1),
            owner: Set("0x123abc456def789ghi".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-01T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-01T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // Lamborghini Huracán
        car::ActiveModel {
            id: Set(2),
            make: Set("Lamborghini".to_string()),
            model: Set("Huracán".to_string()),
            year: Set(2020),
            color: Set("Yellow".to_string()),
            mileage: Set(12000),
            vin: Set("ZHWUC1ZF5LLA12345".to_string()),
            transmission: Set("Automatic".to_string()),
            fuel_type: Set("Petrol".to_string()),
            engine_size: Set("5.2L V10".to_string()),
            exterior_color: Set("Giallo".to_string()),
            interior_color: Set("Black".to_string()),
            odometer: Set(12000),
            description: Set(
                "Stunning Lamborghini Huracán with low mileage and perfect service history.".to_string()
            ),
            image_url: Set(
                Some(
                    vec![
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80".to_string()
                    ]
                )
            ),
            auction_id: Set(2),
            starting_price: Set(180000),
            current_price: Set(195000),
            auction_status: Set(Some(Status::Active)),
            summary: Set("Exquisite Lamborghini Huracán with premium features.".to_string()),
            report: Set(
                json!({"inspection": "passed", "notes": "perfect condition", "condition": "mint"})
            ),
            included: Set(
                json!([
                    "Owner's manual",
                    "Tool kit",
                    "Extra key",
                    "Service history",
                    "Carbon fiber package",
                ])
            ),
            features: Set(
                json!({
                "interior": ["Alcantara seats", "Carbon fiber trim", "Premium audio"],
                "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"],
                "mechanical": ["Naturally aspirated V10", "Magnetic ride control", "Launch control"]
            })
            ),
            vehicale_overview: Set(
                "Only 12,000 miles, single owner, full service history.".to_string()
            ),
            location: Set("Miami, FL".to_string()),
            seller: Set("LuxuryCarMiami".to_string()),
            seller_type: Set("Dealer".to_string()),
            lot: Set("LOT-002".to_string()),
            highlight: Set(
                Some(
                    vec![
                        "Low mileage".to_string(),
                        "Clean title".to_string(),
                        "Carbon package".to_string()
                    ]
                )
            ),
            token_id: Set(2),
            owner: Set("0x456def789ghi123abc".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-02T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-02T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // Porsche 911 GT3 RS
        car::ActiveModel {
            id: Set(3),
            make: Set("Porsche".to_string()),
            model: Set("911 GT3 RS".to_string()),
            year: Set(2021),
            color: Set("White".to_string()),
            mileage: Set(5000),
            vin: Set("WP0AB2A91MS123456".to_string()),
            transmission: Set("Manual".to_string()),
            fuel_type: Set("Petrol".to_string()),
            engine_size: Set("4.0L Flat-6".to_string()),
            exterior_color: Set("White".to_string()),
            interior_color: Set("Black".to_string()),
            odometer: Set(5000),
            description: Set("Track-focused Porsche 911 GT3 RS with minimal road use.".to_string()),
            image_url: Set(
                Some(
                    vec![
                        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80".to_string()
                    ]
                )
            ),
            auction_id: Set(3),
            starting_price: Set(220000),
            current_price: Set(235000),
            auction_status: Set(Some(Status::Active)),
            summary: Set("Ultimate track weapon with street legality.".to_string()),
            report: Set(
                json!({"inspection": "passed", "notes": "track use", "condition": "excellent"})
            ),
            included: Set(
                json!([
                    "Owner's manual",
                    "Tool kit",
                    "Extra key",
                    "Service history",
                    "Track day package",
                ])
            ),
            features: Set(
                json!({
                "interior": ["Carbon fiber seats", "Alcantara trim", "Premium audio"],
                "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"],
                "mechanical": ["Naturally aspirated flat-6", "Magnetic ride control", "Launch control"]
            })
            ),
            vehicale_overview: Set(
                "Only 5,000 miles, primarily track use, full service history.".to_string()
            ),
            location: Set("New York, NY".to_string()),
            seller: Set("PorscheNYC".to_string()),
            seller_type: Set("Dealer".to_string()),
            lot: Set("LOT-003".to_string()),
            highlight: Set(
                Some(
                    vec![
                        "Track focused".to_string(),
                        "Low mileage".to_string(),
                        "Carbon package".to_string()
                    ]
                )
            ),
            token_id: Set(3),
            owner: Set("0x789ghi123abc456def".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-03T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-03T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // BMW M4 Competition
        car::ActiveModel {
            id: Set(4),
            make: Set("BMW".to_string()),
            model: Set("M4 Competition".to_string()),
            year: Set(2022),
            color: Set("Black".to_string()),
            mileage: Set(8000),
            vin: Set("WBS83CD0X1234567".to_string()),
            transmission: Set("Automatic".to_string()),
            fuel_type: Set("Petrol".to_string()),
            engine_size: Set("3.0L I6 Twin-Turbo".to_string()),
            exterior_color: Set("Black".to_string()),
            interior_color: Set("Red".to_string()),
            odometer: Set(8000),
            description: Set(
                "BMW M4 Competition with aggressive styling and powerful performance.".to_string()
            ),
            image_url: Set(
                Some(
                    vec![
                        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80".to_string()
                    ]
                )
            ),
            auction_id: Set(4),
            starting_price: Set(85000),
            current_price: Set(92000),
            auction_status: Set(Some(Status::Active)),
            summary: Set("BMW M4 Competition with premium features.".to_string()),
            report: Set(
                json!({"inspection": "passed", "notes": "minor wear", "condition": "excellent"})
            ),
            included: Set(json!(["Owner's manual", "Tool kit", "Extra key", "Service history"])),
            features: Set(
                json!({
                "interior": ["Leather seats", "Carbon fiber trim", "Premium audio"],
                "exterior": ["LED headlights", "Sport exhaust", "Carbon fiber body"],
                "mechanical": ["Twin-turbo engine", "Magnetic ride control", "Launch control"]
            })
            ),
            vehicale_overview: Set(
                "Only 8,000 miles, well-maintained, full service history.".to_string()
            ),
            location: Set("Chicago, IL".to_string()),
            seller: Set("BMWChicago".to_string()),
            seller_type: Set("Dealer".to_string()),
            lot: Set("LOT-004".to_string()),
            highlight: Set(
                Some(
                    vec![
                        "Low mileage".to_string(),
                        "Clean title".to_string(),
                        "M package".to_string()
                    ]
                )
            ),
            token_id: Set(4),
            owner: Set("0xabc123def456ghi789".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-04T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-04T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // Tesla Model S Plaid
        car::ActiveModel {
            id: Set(5),
            make: Set("Tesla".to_string()),
            model: Set("Model S Plaid".to_string()),
            year: Set(2023),
            color: Set("White".to_string()),
            mileage: Set(3000),
            vin: Set("5YJS4E12345678901".to_string()),
            transmission: Set("Automatic".to_string()),
            fuel_type: Set("Electric".to_string()),
            engine_size: Set("Tri-Motor".to_string()),
            exterior_color: Set("White".to_string()),
            interior_color: Set("Black".to_string()),
            odometer: Set(3000),
            description: Set("Tesla Model S Plaid with incredible performance.".to_string()),
            image_url: Set(
                Some(
                    vec![
                        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80".to_string()
                    ]
                )
            ),
            auction_id: Set(5),
            starting_price: Set(120000),
            current_price: Set(125000),
            auction_status: Set(Some(Status::Active)),
            summary: Set("Tesla Model S Plaid with incredible performance.".to_string()),
            report: Set(json!({"inspection": "passed", "notes": "like new", "condition": "mint"})),
            included: Set(
                json!(["Owner's manual", "Charging cable", "Extra key", "Service history"])
            ),
            features: Set(
                json!({
                "interior": ["Leather seats", "Carbon fiber trim", "Premium audio"],
                "exterior": ["LED headlights", "Glass roof", "Carbon fiber body"],
                "mechanical": ["Tri-motor setup", "Autopilot", "Launch control"]
            })
            ),
            vehicale_overview: Set("Only 3,000 miles, like new condition.".to_string()),
            location: Set("San Francisco, CA".to_string()),
            seller: Set("TeslaSF".to_string()),
            seller_type: Set("Dealer".to_string()),
            lot: Set("LOT-005".to_string()),
            highlight: Set(
                Some(
                    vec![
                        "Electric".to_string(),
                        "Low mileage".to_string(),
                        "Plaid performance".to_string()
                    ]
                )
            ),
            token_id: Set(5),
            owner: Set("0xdef456ghi789abc123".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-05T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-05T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        }
    ];

    let mut cars = Vec::new();
    for car_data in cars_data {
        let car = car_data.insert(db).await?;
        cars.push(car);
    }

    Ok(cars)
}

async fn seed_auctions(db: &DatabaseConnection) -> Result<Vec<auction::Model>, DbErr> {
    let auctions_data = vec![
        auction::ActiveModel {
            id: Set(1),
            car_id: Set(1),
            start_time: Set(
                DateTime::parse_from_rfc3339("2024-01-15T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            end_time: Set(
                DateTime::parse_from_rfc3339("2024-01-22T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            current_bid: Set(215000),
            bid_count: Set(5),
            seller: Set("0x123abc456def789ghi".to_string()),
            status: Set(Some(Status::Active)),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        auction::ActiveModel {
            id: Set(2),
            car_id: Set(2),
            start_time: Set(
                DateTime::parse_from_rfc3339("2024-01-16T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            end_time: Set(
                DateTime::parse_from_rfc3339("2024-01-23T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            current_bid: Set(195000),
            bid_count: Set(3),
            seller: Set("0x456def789ghi123abc".to_string()),
            status: Set(Some(Status::Active)),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        auction::ActiveModel {
            id: Set(3),
            car_id: Set(3),
            start_time: Set(
                DateTime::parse_from_rfc3339("2024-01-17T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            end_time: Set(
                DateTime::parse_from_rfc3339("2024-01-24T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            current_bid: Set(235000),
            bid_count: Set(7),
            seller: Set("0x789ghi123abc456def".to_string()),
            status: Set(Some(Status::Active)),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        auction::ActiveModel {
            id: Set(4),
            car_id: Set(4),
            start_time: Set(
                DateTime::parse_from_rfc3339("2024-01-18T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            end_time: Set(
                DateTime::parse_from_rfc3339("2024-01-25T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            current_bid: Set(92000),
            bid_count: Set(4),
            seller: Set("0xabc123def456ghi789".to_string()),
            status: Set(Some(Status::Active)),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        auction::ActiveModel {
            id: Set(5),
            car_id: Set(5),
            start_time: Set(
                DateTime::parse_from_rfc3339("2024-01-19T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            end_time: Set(
                DateTime::parse_from_rfc3339("2024-01-26T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            current_bid: Set(125000),
            bid_count: Set(4),
            seller: Set("0xdef456ghi789abc123".to_string()),
            status: Set(Some(Status::Active)),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T00:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        }
    ];

    let mut auctions = Vec::new();
    for auction_data in auctions_data {
        let auction = auction_data.insert(db).await?;
        auctions.push(auction);
    }

    Ok(auctions)
}

async fn seed_bids(db: &DatabaseConnection) -> Result<Vec<bid::Model>, DbErr> {
    let bids_data = vec![
        // Ferrari 488 GTB bids
        bid::ActiveModel {
            id: Set(1),
            auction_id: Set(1),
            bidder_id: Set("0x123abc456def789ghi".to_string()),
            amount: Set(200000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(2),
            auction_id: Set(1),
            bidder_id: Set("0x456def789ghi123abc".to_string()),
            amount: Set(205000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T11:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T11:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(3),
            auction_id: Set(1),
            bidder_id: Set("0x789ghi123abc456def".to_string()),
            amount: Set(210000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T14:15:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T14:15:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(4),
            auction_id: Set(1),
            bidder_id: Set("0x123abc456def789ghi".to_string()),
            amount: Set(212000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T16:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T16:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(5),
            auction_id: Set(1),
            bidder_id: Set("0xabc123def456ghi789".to_string()),
            amount: Set(215000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T18:20:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T18:20:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // Lamborghini Huracán bids
        bid::ActiveModel {
            id: Set(6),
            auction_id: Set(2),
            bidder_id: Set("0x456def789ghi123abc".to_string()),
            amount: Set(180000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T09:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T09:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(7),
            auction_id: Set(2),
            bidder_id: Set("0xdef456ghi789abc123".to_string()),
            amount: Set(185000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T12:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T12:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(8),
            auction_id: Set(2),
            bidder_id: Set("0x123abc456def789ghi".to_string()),
            amount: Set(195000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T15:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T15:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // Porsche 911 GT3 RS bids
        bid::ActiveModel {
            id: Set(9),
            auction_id: Set(3),
            bidder_id: Set("0x789ghi123abc456def".to_string()),
            amount: Set(220000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T08:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T08:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(10),
            auction_id: Set(3),
            bidder_id: Set("0x987fed654321cba987".to_string()),
            amount: Set(225000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T10:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T10:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(11),
            auction_id: Set(3),
            bidder_id: Set("0x123abc456def789ghi".to_string()),
            amount: Set(230000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T13:15:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T13:15:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(12),
            auction_id: Set(3),
            bidder_id: Set("0x654321fedcba987654".to_string()),
            amount: Set(232000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T16:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T16:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(13),
            auction_id: Set(3),
            bidder_id: Set("0x789ghi123abc456def".to_string()),
            amount: Set(235000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T19:20:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T19:20:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // BMW M4 Competition bids
        bid::ActiveModel {
            id: Set(14),
            auction_id: Set(4),
            bidder_id: Set("0xabc123def456ghi789".to_string()),
            amount: Set(85000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T09:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T09:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(15),
            auction_id: Set(4),
            bidder_id: Set("0x321cba987fed654321".to_string()),
            amount: Set(87000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T12:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T12:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(16),
            auction_id: Set(4),
            bidder_id: Set("0x456def789ghi123abc".to_string()),
            amount: Set(90000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T15:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T15:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(17),
            auction_id: Set(4),
            bidder_id: Set("0xabc123def456ghi789".to_string()),
            amount: Set(92000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T18:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T18:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        // Tesla Model S Plaid bids
        bid::ActiveModel {
            id: Set(18),
            auction_id: Set(5),
            bidder_id: Set("0xdef456ghi789abc123".to_string()),
            amount: Set(120000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(19),
            auction_id: Set(5),
            bidder_id: Set("0x987fed654321cba987".to_string()),
            amount: Set(122000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T13:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T13:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(20),
            auction_id: Set(5),
            bidder_id: Set("0x123abc456def789ghi".to_string()),
            amount: Set(124000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T16:15:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T16:15:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        bid::ActiveModel {
            id: Set(21),
            auction_id: Set(5),
            bidder_id: Set("0xdef456ghi789abc123".to_string()),
            amount: Set(125000),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T19:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T19:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        }
    ];

    let mut bids = Vec::new();
    for bid_data in bids_data {
        let bid = bid_data.insert(db).await?;
        bids.push(bid);
    }

    Ok(bids)
}

async fn seed_comments(db: &DatabaseConnection) -> Result<Vec<comment::Model>, DbErr> {
    let comments_data = vec![
        comment::ActiveModel {
            id: Set(1),
            auction_id: Set(1),
            user: Set("john_doe".to_string()),
            content: Set("Beautiful Ferrari! What's the service history like?".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T10:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T10:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        comment::ActiveModel {
            id: Set(2),
            auction_id: Set(1),
            user: Set("jane_smith".to_string()),
            content: Set("Is this the original paint?".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T11:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T11:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        comment::ActiveModel {
            id: Set(3),
            auction_id: Set(2),
            user: Set("sarah_jones".to_string()),
            content: Set("Stunning Lamborghini! Any modifications?".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T09:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T09:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        comment::ActiveModel {
            id: Set(4),
            auction_id: Set(3),
            user: Set("lisa_garcia".to_string()),
            content: Set("Track day car? How many track days?".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T08:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T08:30:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        comment::ActiveModel {
            id: Set(5),
            auction_id: Set(4),
            user: Set("amy_chen".to_string()),
            content: Set("BMW M4 looks great! Any accidents?".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T09:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T09:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        comment::ActiveModel {
            id: Set(6),
            auction_id: Set(5),
            user: Set("sophie_white".to_string()),
            content: Set("Tesla Plaid is incredible! Battery health?".to_string()),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T10:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T10:45:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        }
    ];

    let mut comments = Vec::new();
    for comment_data in comments_data {
        let comment = comment_data.insert(db).await?;
        comments.push(comment);
    }

    Ok(comments)
}

async fn seed_saved_auctions(db: &DatabaseConnection) -> Result<Vec<saved_auction::Model>, DbErr> {
    let saved_auctions_data = vec![
        saved_auction::ActiveModel {
            id: Set(1),
            user: Set("john_doe".to_string()),
            auction_id: Set(1),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(2),
            user: Set("jane_smith".to_string()),
            auction_id: Set(1),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T11:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(3),
            user: Set("mike_wilson".to_string()),
            auction_id: Set(1),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-15T12:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(4),
            user: Set("sarah_jones".to_string()),
            auction_id: Set(2),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T09:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(5),
            user: Set("david_brown".to_string()),
            auction_id: Set(2),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-16T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(6),
            user: Set("lisa_garcia".to_string()),
            auction_id: Set(3),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T08:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(7),
            user: Set("tom_lee".to_string()),
            auction_id: Set(3),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-17T09:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(8),
            user: Set("amy_chen".to_string()),
            auction_id: Set(4),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-18T09:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(9),
            user: Set("chris_martin".to_string()),
            auction_id: Set(5),
            created_at: Set(
                DateTime::parse_from_rfc3339("2024-01-19T10:00:00Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        },
        saved_auction::ActiveModel {
            id: Set(10),
            user: Set("john_doe".to_string()),
            auction_id: Set(3),
            created_at: Set(
                DateTime::parse_from_rfc3339("2025-06-15T18:42:57.530698Z")
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        }
    ];

    let mut saved_auctions = Vec::new();
    for saved_auction_data in saved_auctions_data {
        let saved_auction = saved_auction_data.insert(db).await?;
        saved_auctions.push(saved_auction);
    }

    Ok(saved_auctions)
}

async fn update_auction_stats(db: &DatabaseConnection) -> Result<(), DbErr> {
    // Update auction bid counts based on actual bids
    let auctions = auction::Entity::find().all(db).await?;

    for auction in auctions {
        let bid_count = bid::Entity
            ::find()
            .filter(bid::Column::AuctionId.eq(auction.id))
            .count(db).await?;

        let max_bid = bid::Entity
            ::find()
            .filter(bid::Column::AuctionId.eq(auction.id))
            .order_by_desc(bid::Column::Amount)
            .limit(1)
            .one(db).await?;

        let current_bid = max_bid.map(|bid| bid.amount).unwrap_or(0);

        (auction::ActiveModel {
            id: Set(auction.id),
            bid_count: Set(bid_count as i32),
            current_bid: Set(current_bid),
            ..Default::default()
        }).update(db).await?;
    }

    Ok(())
}
