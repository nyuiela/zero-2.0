# Database Seeder

This directory contains the database seeder for the Car Auction Platform. The seeder populates the database with sample data including cars, auctions, bids, comments, and saved auctions.

## Files

- `seed.sql` - Raw SQL script for seeding the database
- `src/seeder.rs` - Rust-based seeder with programmatic data insertion
- `src/main.rs` - CLI interface to run the seeder

## Usage

### Option 1: Using the Rust Seeder (Recommended)

1. Set the `DATABASE_URL` environment variable:

   ```bash
   export DATABASE_URL="postgres://username:password@localhost:5432/car_auction"
   ```

2. Run the seeder:
   ```bash
   cd db
   cargo run
   ```

### Option 2: Using the SQL Script

1. Connect to your PostgreSQL database
2. Run the SQL script:
   ```bash
   psql -d car_auction -f seed.sql
   ```

## Sample Data

The seeder creates the following sample data:

### Cars (5 vehicles)

- Ferrari 488 GTB (2019) - Red
- Lamborghini Huracán (2020) - Yellow
- Porsche 911 GT3 RS (2021) - White
- BMW M4 Competition (2022) - Black
- Tesla Model S Plaid (2023) - White

### Auctions (5 active auctions)

Each car has an associated auction with realistic starting prices and current bids.

### Bids (21 total bids)

Multiple bids per auction with realistic bid progression.

### Comments (6 comments)

Sample user comments on various auctions.

### Saved Auctions (10 saved auctions)

Users saving auctions to their watchlist.

## Data Structure

The seeder maintains referential integrity and includes:

- Realistic VIN numbers
- Proper timestamps
- JSON data for features, reports, and included items
- Ethereum addresses for owners
- High-quality image URLs from Unsplash

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)

## Dependencies

- sea-orm
- serde_json
- chrono
- tokio

## Notes

- The seeder will clear existing data before inserting new data
- All timestamps are set to January 2024 for consistency
- Image URLs point to Unsplash for realistic car images
- Ethereum addresses are placeholder values for demonstration
