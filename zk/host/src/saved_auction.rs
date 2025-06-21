use ::entity::{ saved_auction, SavedAuctionModel };
use sea_orm::{ ActiveModelTrait, DatabaseConnection, EntityTrait, QueryFilter, Set, ColumnTrait };
use axum::response::Json;
use serde_json::{ Value, json };
use std::sync::Arc;

// POST: Create a saved auction entry
pub async fn create_saved_auction(
    axum::extract::State(db): axum::extract::State<Arc<DatabaseConnection>>,
    Json(saved_data): Json<SavedAuctionModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let saved_model = saved_auction::ActiveModel {
        id: Set(saved_data.id),
        auction_id: Set(saved_data.auction_id),
        user: Set(saved_data.user),
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
