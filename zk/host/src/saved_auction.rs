use ::entity::{ saved_auction, SavedAuctionModel };
use sea_orm::{
    ActiveModelTrait,
    ColumnTrait,
    DatabaseConnection,
    EntityTrait,
    QueryFilter,
    QueryOrder,
    Set,
};
use axum::response::Json;
use serde_json::{ Value, json };
use std::sync::Arc;

use crate::auth::USER;

// POST: Create a saved auction entry
pub async fn create_saved_auction(
    axum::extract::State(db): axum::extract::State<Arc<DatabaseConnection>>,
    Json(saved_data): Json<SavedAuctionModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let save_id = saved_auction::Entity
        ::find()
        .order_by_desc(saved_auction::Column::Id)
        .one(&*db).await
        .unwrap()
        .unwrap();
    let user = USER.get();
    let saved_model = saved_auction::ActiveModel {
        id: Set(save_id.id),
        auction_id: Set(saved_data.auction_id),
        user: Set(user.addr),
        created_at: Set(saved_data.created_at),
        ..Default::default()
    };

    saved_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(json!({
        "status": "success",
        "message": "Auction added to saved"
    })))
}

// GET: Fetch all saved auctions by auction ID (or filter by user if preferred)
pub async fn get_saved_auctions(
    axum::extract::State(db): axum::extract::State<Arc<DatabaseConnection>>,
    axum::extract::Path(auction_id): axum::extract::Path<u32>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let saved = saved_auction::Entity
        ::find()
        .filter(saved_auction::Column::AuctionId.eq(auction_id as i32))
        .all(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(json!({
        "status": "success",
        "data": saved
    })))
}

//

// GET: Fetch all saved auctions by auction ID (or filter by user if preferred)
pub async fn get_saved_auctions_by_user(
    axum::extract::State(db): axum::extract::State<Arc<DatabaseConnection>>,
    axum::extract::Path(user): axum::extract::Path<String>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let saved = saved_auction::Entity
        ::find()
        .filter(saved_auction::Column::User.eq(user))
        .all(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(json!({
      "status": "success",
      "data": saved
  })))
}
