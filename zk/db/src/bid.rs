use ::entity::{ bid, BidModel };
use sea_orm::{ ActiveModelTrait, DatabaseConnection, DbErr, Set };
use axum::{ response::{ Json } };
use sea_orm::{ EntityTrait };
use serde_json::{ Value, json };
use std::sync::Arc;

pub async fn create_bid(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(bid_data): Json<BidModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let bid_model = bid::ActiveModel {
        id: Set(bid_data.id),
        auction_id: Set(bid_data.auction_id),
        bidder_id: Set(bid_data.bidder_id),
        amount: Set(bid_data.amount),
        created_at: Set(bid_data.created_at),
        updated_at: Set(bid_data.updated_at),
        ..Default::default()
    };

    bid_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(json!({
    "status": "success",
    "message": "bid created succesfully"
  })))
}
pub async fn get_bids(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    let bids = bid::Entity
        ::find()
        .all(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(json!({
    "status": "success",
    "data": bids
  })))
}

pub async fn get_bid_by_id(
    axum::extract::Path(id): axum::extract::Path<i32>,
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let bid = bid::Entity
        ::find_by_id(id)
        .one(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    match bid {
        Some(bid) => Ok(Json(json!({
    "status": "success",
    "data": bid
  }))),
        None => Err((axum::http::StatusCode::NOT_FOUND, "Bid not found".to_string())),
    }
}
pub async fn get_all_bids(db: &DatabaseConnection) -> Result<Vec<::entity::bid::Model>, DbErr> {
    ::entity::bid::Entity::find().all(db).await
}
