use sea_orm::*;
use serde::{ Deserialize, Serialize };
use chrono::{ DateTime, Utc };
use rust_decimal::Decimal;
use migration::{ Migrator, MigratorTrait };
// use ::entity::prelude::*;

// Remove the re-exports since we're using the prelude
// pub use entity;
// pub use entity::car;

// use entity::{ auction, bid, car, AuctionModel, BidModel, CarModel };

// pub mod car;
// pub mod bid;
// pub mod auction;
// pub mod comment;
// pub mod saved_auction;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Car {
    pub id: i32,
    pub make: String,
    pub model: String,
    pub year: i32,
    pub vin: String,
    pub mileage: i32,
    pub description: String,
    pub starting_price: Decimal,
    pub current_price: Decimal,
    pub status: AuctionStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Auction {
    pub id: i32,
    pub car_id: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub status: AuctionStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Bid {
    pub id: i32,
    pub auction_id: i32,
    pub user_id: i32,
    pub amount: Decimal,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AuctionStatus {
    Pending,
    Active,
    Completed,
    Cancelled,
}

pub async fn establish_connection(database_url: &str) -> Result<DatabaseConnection, DbErr> {
    let db = Database::connect(database_url).await?;
    Migrator::up(&db, None).await?;
    Ok(db)
}

// pub async fn create_car(db: &DatabaseConnection, car: Car) -> Result<Car, DbErr> {
//     // For now, just return the car as is since we haven't set up the database tables yet
//     Ok(car)
// }
