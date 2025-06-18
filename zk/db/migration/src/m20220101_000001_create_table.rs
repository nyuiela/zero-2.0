use sea_orm_migration::{ prelude::*, schema::* };
use sea_orm::{ EnumIter, Iterable };
use sea_orm_migration::prelude::extension::postgres::Type;
#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
pub enum Auction {
    Table,
    Id,
    CarId,
    StartTime,
    EndTime,
    Status,
    CurrentBid,
    BidCount,
    Seller,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
pub enum Bid {
    Table,
    Id,
    AuctionId,
    BidderId,
    Amount,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
pub enum Comment {
    Table,
    Id,
    AuctionId,
    User,
    Content,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
pub enum SavedAuction {
    Table,
    Id,
    User,
    AuctionId,
    CreatedAt,
}

// #[derive(DeriveIden)]
// pub enum Car {
//     Table,
//     Id,
//     Make,
//     Model,
//     Year,
//     Color,
//     Mileage,
//     VIN,
//     Transmission,
//     FuelType,
//     EngineSize,
//     ExteriorColor,
//     InteriorColor,
//     Odometer,
//     Description,
//     ImageUrl,
//     AuctionId,
//     StartingPrice,
//     CurrentPrice,
//     AuctionStatus,
//     CreatedAt,
//     UpdatedAt,
// }

#[derive(DeriveIden)]
pub enum Car {
    Table,
    Id,
    Make,
    Model,
    Year,
    Color,
    Mileage,
    VIN,
    Transmission,
    FuelType,
    EngineSize,
    ExteriorColor,
    InteriorColor,
    Odometer,
    Description,
    ImageUrl,
    AuctionId,
    StartingPrice,
    CurrentPrice,
    AuctionStatus,
    Summary, // text
    Report, //text/json
    Included, //json
    Features, // json (interior, exterior, mechanical)
    VehicaleOverview, // text
    Location, // location
    Seller, // address
    SellerType, // seller type
    Lot, // number
    Highlight, // array
    TokenId,
    Owner,
    CreatedAt,
    UpdatedAt,
}

// #[derive(Iden, EnumIter, Debug)]
// pub enum AuctionStatus {
//     #[iden = "pending"]
//     Pending,
//     #[iden = "active"]
//     Active,
//     #[iden = "completed"]
//     Completed,
//     #[iden = "cancelled"]
//     Cancelled,
// }

#[derive(Iden)]
pub enum AuctionStatusEnumType {
    #[iden = "status"]
    Status,
}

#[derive(EnumIter)]
pub enum AuctionStatus {
    Pending,
    Active,
    Completed,
    Cancelled,
}

impl AuctionStatus {
    fn as_str(&self) -> &'static str {
        match self {
            AuctionStatus::Pending => "pending",
            AuctionStatus::Active => "active",
            AuctionStatus::Completed => "completed",
            AuctionStatus::Cancelled => "cancelled",
        }
    }
}
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();
        manager.create_type(
            Type::create()
                .as_enum("status")
                .values(AuctionStatus::iter().map(|v| v.as_str()))
                .to_owned()
        ).await?;

        manager.create_table(
            Table::create()
                .table(Car::Table)
                .if_not_exists()
                .col(pk_auto(Car::Id))
                .col(string(Car::Make))
                .col(string(Car::Model))
                .col(integer(Car::Year))
                .col(string(Car::Color))
                .col(integer(Car::Mileage))
                .col(string(Car::VIN))
                .col(string(Car::Transmission))
                .col(string(Car::FuelType))
                .col(string(Car::EngineSize))
                .col(string(Car::ExteriorColor))
                .col(string(Car::InteriorColor))
                .col(integer(Car::Odometer))
                .col(text(Car::Description)) // For long text
                .col(ColumnDef::new(Car::ImageUrl).array(ColumnType::Text).null()) // Or text, if needed
                .col(integer(Car::AuctionId))
                .col(integer(Car::StartingPrice))
                .col(integer(Car::CurrentPrice))
                .col(
                    enumeration_null(Car::AuctionStatus, AuctionStatusEnumType::Status, [
                        "pending",
                        "active",
                        "completed",
                        "cancelled",
                    ])
                )

                // ✅ Extended fields:
                .col(text(Car::Summary))
                .col(json(Car::Report)) // JSON field for report
                .col(json(Car::Included)) // JSON array or object
                .col(json(Car::Features)) // JSON with nested keys
                .col(text(Car::VehicaleOverview)) // Car write-up
                .col(string(Car::Location)) // Could be JSON too
                .col(string(Car::Seller)) // Could be FK or JSON
                .col(string(Car::SellerType)) // Enum or string
                .col(string(Car::Lot)) // Lot number (can be int if always numeric)

                // ✅ Array example (PostgreSQL only)
                .col(ColumnDef::new(Car::Highlight).array(ColumnType::Text).null()) // ARRAY(TEXT)
                .col(integer(Car::TokenId))
                .col(string(Car::Owner))
                .col(timestamp(Car::CreatedAt))
                .col(timestamp(Car::UpdatedAt))
                // .foreign_key(
                //     ForeignKey::create()
                //         .name("fk_car_auction_id")
                //         .from(Car::Table, Car::AuctionId)
                //         .to(Auction::Table, Auction::Id)
                //         .on_delete(ForeignKeyAction::SetNull)
                // )
                .to_owned()
        ).await?;

        manager.create_table(
            Table::create()
                .table(Auction::Table)
                .if_not_exists()
                .col(pk_auto(Auction::Id))
                .col(integer(Auction::CarId))
                .col(timestamp(Auction::StartTime))
                .col(timestamp(Auction::EndTime))
                // .col(string(Auction::Status))
                .col(integer(Auction::CurrentBid))
                .col(integer(Auction::BidCount))
                .col(string(Auction::Seller))
                .col(
                    enumeration_null(Auction::Status, AuctionStatusEnumType::Status, [
                        "pending",
                        "active",
                        "completed",
                        "cancelled",
                    ])
                )
                .col(timestamp(Auction::CreatedAt))
                .col(timestamp(Auction::UpdatedAt))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_auction_car_id")
                        .from(Auction::Table, Auction::CarId)
                        .to(Car::Table, Car::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        manager.create_table(
            Table::create()
                .table(Bid::Table)
                .if_not_exists()
                .col(pk_auto(Bid::Id))
                .col(integer(Bid::AuctionId))
                .col(integer(Bid::BidderId))
                .col(integer(Bid::Amount))
                .col(timestamp(Bid::CreatedAt))
                .col(timestamp(Bid::UpdatedAt))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_car_auction_id")
                        .from(Bid::Table, Bid::AuctionId)
                        .to(Auction::Table, Auction::Id)
                        .on_delete(ForeignKeyAction::SetNull)
                )
                .to_owned()
        ).await?;

        manager.create_table(
            Table::create()
                .table(Comment::Table)
                .if_not_exists()
                .col(pk_auto(Comment::Id))
                .col(integer(Comment::AuctionId))
                .col(string(Comment::User))
                .col(text(Comment::Content))
                .col(timestamp(Comment::CreatedAt))
                .col(timestamp(Comment::UpdatedAt))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_comments_auction_id")
                        .from(Comment::Table, Comment::AuctionId)
                        .to(Auction::Table, Auction::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        manager.create_table(
            Table::create()
                .table(SavedAuction::Table)
                .if_not_exists()
                .col(pk_auto(SavedAuction::Id))
                .col(string(SavedAuction::User))
                .col(integer(SavedAuction::AuctionId))
                .col(timestamp(SavedAuction::CreatedAt))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_saved_auction_id")
                        .from(SavedAuction::Table, SavedAuction::AuctionId)
                        .to(Auction::Table, Auction::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        // manager.create_table(
        //     Table::create()
        //         .table(Car::Table)
        //         .if_not_exists()
        //         .col(pk_auto(Car::Id))
        //         .col(string(Car::Make))
        //         .col(string(Car::Model))
        //         .col(integer(Car::Year))
        //         .col(string(Car::Color))
        //         .col(integer(Car::Mileage))
        //         .col(string(Car::VIN))
        //         .col(string(Car::Transmission))
        //         .col(string(Car::FuelType))
        //         .col(string(Car::EngineSize))
        //         .col(string(Car::ExteriorColor))
        //         .col(string(Car::InteriorColor))
        //         .col(integer(Car::Odometer))
        //         .col(string(Car::Description))
        //         .col(string(Car::ImageUrl))
        //         .col(integer(Car::AuctionId))
        //         .col(integer(Car::StartingPrice))
        //         .col(integer(Car::CurrentPrice))
        //         // .col(string(Car::AuctionStatus))
        //         // .col(
        //         //     enumeration_null(
        //         //         Car::AuctionStatus,
        //         //         Alias::new("AuctionStatus"),
        //         //         AuctionStatus::iter()
        //         //     )
        //         // )
        //         .col(
        //             enumeration_null(Car::AuctionStatus, AuctionStatusEnumType::Status, [
        //                 "pending",
        //                 "active",
        //                 "completed",
        //                 "cancelled",
        //             ])
        //         )
        //         .col(timestamp(Car::CreatedAt))
        //         .col(timestamp(Car::UpdatedAt))
        //         .to_owned()
        // ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        // manager.drop_table(Table::drop().table(Post::Table).to_owned()).await
        manager.drop_table(Table::drop().table(SavedAuction::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Comment::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Bid::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Auction::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Car::Table).to_owned()).await?;
        manager.drop_type(Type::drop().name("status").to_owned()).await?;
        Ok(())
    }
}
