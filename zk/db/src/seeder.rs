use ::entity::{ auction, bid, car, comment, saved_auction, Status };
use sea_orm::*;
use serde_json::json;
use chrono::{ DateTime, Utc };
// use entity::{ car, auction, bid, comment, saved_auction, sea_orm_active_enums::Status };
use sea_orm::ActiveValue::Set;
use serde::Deserialize;
use serde_json::Value;
use std::fs;
use serde_json::from_str;

#[derive(Deserialize)]
pub struct CarSeed {
    pub id: i32,
    pub make: String,
    pub model: String,
    pub year: i32,
    pub color: String,
    pub mileage: i32,
    pub vin: String,
    pub transmission: String,
    pub fuel_type: String,
    pub engine_size: String,
    pub exterior_color: String,
    pub interior_color: String,
    pub odometer: i32,
    pub description: String,
    pub image_url: Option<Vec<String>>,
    pub auction_id: i32,
    pub starting_price: i32,
    pub current_price: i32,
    pub auction_status: String,
    pub summary: String,
    pub report: Value,
    pub included: Value,
    pub features: Value,
    pub vehicale_overview: String,
    pub location: String,
    pub seller: String,
    pub seller_type: String,
    pub lot: String,
    pub highlight: Option<Vec<String>>,
    pub token_id: i32,
    pub owner: String,
    pub created_at: String,
    pub updated_at: String,
}

pub async fn seed_database(db: &DatabaseConnection) -> Result<(), DbErr> {
    println!("🌱 Starting database seeding...");

    // Clear existing data
    clear_database(db).await?;

    // Seed cars
    seed_cars_from_json(db, "db/data/cars.json").await?;
    println!("✅ Seeded cars");

    // Seed auctions
    seed_auctions(db).await?;
    println!("✅ Seeded auctions");

    // Seed bids
    seed_bids(db).await?;
    println!("✅ Seeded bids");

    // Seed comments
    seed_comments(db).await?;
    println!("✅ Seeded comments");

    // Seed saved auctions
    seed_saved_auctions(db).await?;
    println!("✅ Seeded saved auctions");

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

pub async fn seed_cars_from_json(db: &DatabaseConnection, path: &str) -> Result<(), DbErr> {
    let data = fs::read_to_string(path).expect("Unable to read file");
    let cars: Vec<CarSeed> = from_str(&data).expect("JSON was not well-formatted");

    for car in cars {
        let model = car::ActiveModel {
            id: Set(car.id),
            make: Set(car.make),
            model: Set(car.model),
            year: Set(car.year),
            color: Set(car.color),
            mileage: Set(car.mileage),
            vin: Set(car.vin),
            transmission: Set(car.transmission),
            fuel_type: Set(car.fuel_type),
            engine_size: Set(car.engine_size),
            exterior_color: Set(car.exterior_color),
            interior_color: Set(car.interior_color),
            odometer: Set(car.odometer),
            description: Set(car.description),
            image_url: Set(car.image_url),
            auction_id: Set(car.auction_id),
            starting_price: Set(car.starting_price),
            current_price: Set(car.current_price),
            auction_status: Set(
                Some(match car.auction_status.as_str() {
                    "active" => Status::Active,
                    "inactive" => Status::Pending,
                    _ => Status::Active, // default/fallback
                })
            ),
            summary: Set(car.summary),
            report: Set(car.report),
            included: Set(car.included),
            features: Set(car.features),
            vehicale_overview: Set(car.vehicale_overview),
            location: Set(car.location),
            seller: Set(car.seller),
            seller_type: Set(car.seller_type),
            lot: Set(car.lot),
            highlight: Set(car.highlight),
            token_id: Set(car.token_id),
            owner: Set(car.owner),
            created_at: Set(
                DateTime::parse_from_rfc3339(&car.created_at)
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            updated_at: Set(
                DateTime::parse_from_rfc3339(&car.updated_at)
                    .unwrap()
                    .with_timezone(&Utc)
                    .naive_utc()
            ),
            ..Default::default()
        };
        model.insert(db).await?;
    }
    Ok(())
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
