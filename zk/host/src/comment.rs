use ::entity::{ comment, CommentModel };
use sea_orm::{ ActiveModelTrait, ColumnTrait, QueryFilter, QueryOrder, Set };
use axum::{ response::{ Json } };
use sea_orm::{ EntityTrait };
use serde_json::{ Value, json };
use std::sync::Arc;

use crate::auth::USER;

pub async fn create_comment(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(com_data): Json<CommentModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let com_id = comment::Entity
        ::find()
        .order_by_desc(comment::Column::Id)
        .one(&*db).await
        .unwrap()
        .unwrap();
    let user = USER.get();
    let com_model = comment::ActiveModel {
        id: Set(com_id.id + 1),
        auction_id: Set(com_data.auction_id),
        user: Set(user.addr),
        content: Set(com_data.content),
        created_at: Set(com_data.created_at),
        updated_at: Set(com_data.updated_at),
        ..Default::default()
    };

    com_model
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
