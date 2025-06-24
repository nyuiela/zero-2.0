use sea_orm::*;
use std::env;
use std::process;
use dotenv::dotenv;
use migration::{ Migrator, MigratorTrait };

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv().ok();

    // Get database URL from environment variable
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
        eprintln!("Error: DATABASE_URL environment variable is required");
        eprintln!("Please make sure you have a .env file with DATABASE_URL set");
        eprintln!("Example: DATABASE_URL=postgres://user:password@localhost:5432/zero");
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

    // Run migrations
    match Migrator::up(&db, None).await {
        Ok(_) => {
            println!("✅ Database migrations completed successfully");
        }
        Err(err) => {
            eprintln!("❌ Failed to run migrations: {}", err);
            process::exit(1);
        }
    }
} 