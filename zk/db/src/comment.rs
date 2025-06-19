use ::entity::{ comment, CommentModel };
use sea_orm::{ ActiveModelTrait, QueryFilter, Set, ColumnTrait };
use axum::{ response::{ Json } };
use sea_orm::{ EntityTrait };
use serde_json::{ Value, json };
use std::sync::Arc;

pub async fn create_comment(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(bid_data): Json<CommentModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let bid_model = comment::ActiveModel {
        id: Set(bid_data.id),
        auction_id: Set(bid_data.auction_id),
        user: Set(bid_data.user),
        content: Set(bid_data.content),
        created_at: Set(bid_data.created_at),
        updated_at: Set(bid_data.updated_at),
        ..Default::default()
    };

    bid_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(json!({
    "status": "success",
    "message": "Comment created succesfully"
  })))
}
pub async fn get_comments(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    axum::extract::Path(id): axum::extract::Path<u32>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let comments = comment::Entity
        ::find()
        .filter(comment::Column::AuctionId.eq(id)) // Convert u32 to i32 for the filter
        .all(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(json!({
    "status": "success",
    "data": comments
  })))
}

// pub async fn get_bid_by_id(
//     axum::extract::Path(id): axum::extract::Path<i32>,
//     axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>
// ) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
//     let bid = bid::Entity
//         ::find_by_id(id)
//         .one(&*db).await
//         .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
//     match bid {
//         Some(bid) => Ok(Json(json!({
//     "status": "success",
//     "data": bid
//   }))),
//         None => Err((axum::http::StatusCode::NOT_FOUND, "Bid not found".to_string())),
//     }
// }
// pub async fn get_all_bids(db: &DatabaseConnection) -> Result<Vec<::entity::bid::Model>, DbErr> {
//     ::entity::bid::Entity::find().all(db).await
// }
