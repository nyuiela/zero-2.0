use sea_orm::*;
// use serde_json::{ json };
use std::env;
use std::process;
use dotenv::dotenv;

mod seeder;

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv().ok();

    // Get database URL from environment variable
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
        eprintln!("Error: DATABASE_URL environment variable is required");
        eprintln!("Please make sure you have a .env file with DATABASE_URL set");
        eprintln!("Example: DATABASE_URL=postgres://user:password@localhost:5432/car_auction");
        process::exit(1);
    });

    // Connect to database
    let db = match Database::connect(&database_url).await {
        Ok(db) => {
            println!("✅ Connected to database successfully");
            db
        }
        Err(err) => {
            eprintln!("❌ Failed to connect to database: {}", err);
            process::exit(1);
        }
    };

    // Run the seeder
    if let Err(err) = seeder::seed_database(&db).await {
        eprintln!("❌ Failed to seed database: {}", err);
        process::exit(1);
    }
}
