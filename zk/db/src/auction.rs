use ::entity::{ auction, AuctionModel };
use sea_orm::{ ActiveModelTrait, DatabaseConnection, DbErr, Set };
use axum::{ response::{ Json } };
use sea_orm::{ EntityTrait };
use serde_json::{ Value, json };
use std::sync::Arc;

#[axum::debug_handler]
pub async fn create_auction(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(auction_data): Json<AuctionModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let auction_model = auction::ActiveModel {
        id: Set(auction_data.id.to_owned()),
        car_id: Set(auction_data.car_id.to_owned()),
        start_time: Set(auction_data.start_time.to_owned()),
        end_time: Set(auction_data.end_time.to_owned()),
        current_bid: Set(auction_data.current_bid.to_owned()),
        bid_count: Set(auction_data.bid_count.to_owned()),
        seller: Set(auction_data.seller.to_owned()),
        status: Set(auction_data.status.to_owned()),
        created_at: Set(auction_data.created_at.to_owned()),
        updated_at: Set(auction_data.updated_at.to_owned()),
        ..Default::default()
    };

    auction_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(json!({
    "status": "success",
    "message": "auction created succesfully"
  })))
}

pub async fn get_auctions(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    let auctions = auction::Entity
        ::find()
        .all(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(json!({
    "status": "success",
    "data": auctions
  })))
}

pub async fn get_auction_by_id(
    axum::extract::Path(id): axum::extract::Path<i32>,
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let auctions = auction::Entity
        ::find_by_id(id)
        .one(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match auctions {
        Some(auctions) => Ok(Json(json!({
      "status": "success",
      "data": auctions
    }))),
        None => Err((axum::http::StatusCode::NOT_FOUND, "Auction not found".to_string())),
    }
}
pub async fn get_all_auctions(
    db: &DatabaseConnection
) -> Result<Vec<::entity::auction::Model>, DbErr> {
    ::entity::auction::Entity::find().all(db).await
}
