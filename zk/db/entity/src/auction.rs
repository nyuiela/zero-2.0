//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.0

use super::sea_orm_active_enums::Status;
use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Deserialize, Serialize)]
#[sea_orm(table_name = "auction")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub car_id: i32,
    pub start_time: DateTime,
    pub end_time: DateTime,
    pub current_bid: i32,
    pub bid_count: i32,
    pub seller: String,
    pub status: Option<Status>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::bid::Entity")]
    Bid,
    #[sea_orm(
        belongs_to = "super::car::Entity",
        from = "Column::CarId",
        to = "super::car::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    Car,
    #[sea_orm(has_many = "super::comment::Entity")]
    Comment,
    #[sea_orm(has_many = "super::saved_auction::Entity")]
    SavedAuction,
}

impl Related<super::bid::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Bid.def()
    }
}

impl Related<super::car::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Car.def()
    }
}

impl Related<super::comment::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Comment.def()
    }
}

impl Related<super::saved_auction::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SavedAuction.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
