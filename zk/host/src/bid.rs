use std::sync::Arc;

use axum::Json;
use car_auction_core::BidState;
use chrono::Utc;
use entity::{ bid, BidModel };
use methods::{ INIT_BID_ELF, INIT_BID_ID };
use risc0_zkvm::{ default_prover, ExecutorEnv, Receipt };
use sea_orm::{
    ActiveModelTrait,
    DatabaseConnection,
    DbErr,
    EntityTrait,
    QueryOrder,
    Set,
    ColumnTrait,
    QueryFilter,
};
use serde::{ Deserialize, Serialize };
use serde_json::{ json, Value };

use crate::{ auth::USER, overall::sync_overall_state, SessionStats };

pub fn get_bid_leaves(bids: &Vec<BidModel>) -> Vec<String> {
    let mut leaves = vec![];
    // let tree: Vec<&'static str> = vec!["s", "ss"];
    for bid in bids {
        let bid_record = format!(
            "{}:{}:{}:{}:{}:{}",
            bid.id,
            bid.auction_id,
            bid.bidder_id,
            bid.amount,
            bid.created_at.and_utc().timestamp(),
            bid.updated_at.and_utc().timestamp()
        );
        leaves.push(bid_record);
    }
    leaves
}

#[derive(Serialize, Deserialize)]
pub struct BidCommit {
    pub receipt: Receipt,
    pub stats: SessionStats,
}
impl BidCommit {
    //  pub fn get_state() {}
    pub fn get_commit(&self) -> Result<BidState, String> {
        let state = self.receipt.journal.decode().map_err(|e| e.to_string())?;
        Ok(state)
    }
    pub fn verify_and_get_commit(&self) -> Result<BidState, String> {
        self.receipt.verify(INIT_BID_ID).map_err(|e| e.to_string())?;
        self.get_commit()
    }
}
pub fn init_bid(leaves: Vec<String>) -> Result<BidCommit, String> {
    let env = ExecutorEnv::builder().write(&leaves).unwrap().build().unwrap();
    let prover = default_prover();
    let prove_info = prover.prove(env, INIT_BID_ELF).unwrap();
    let auction_commit = BidCommit {
        receipt: prove_info.receipt,
        stats: SessionStats {
            segments: prove_info.stats.segments,
            total_cycles: prove_info.stats.total_cycles,
            user_cycles: prove_info.stats.user_cycles,
            paging_cycles: prove_info.stats.paging_cycles,
            reserved_cycles: prove_info.stats.reserved_cycles,
        },
    };
    Ok(auction_commit)
    // prove_info.receipt
}

pub async fn init_bid_handler(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    let bids = get_all_bids(&db).await.unwrap();
    let leaves = get_bid_leaves(&bids);
    let result = init_bid(leaves).map_err(|e| (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        e.to_string(),
    ))?;
    Ok(Json(json!(result)))
}

pub async fn create_bid(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(bid_data): Json<BidModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let user = USER.get();
    eprint!("{:?}", user);
    let bid_id = bid::Entity
        ::find()
        .order_by_desc(bid::Column::Id)
        .one(&*db).await
        .unwrap()
        .unwrap();
    let now_naive: chrono::NaiveDateTime = Utc::now().naive_utc();
    let bid_model = bid::ActiveModel {
        id: Set(bid_id.id + 1),
        auction_id: Set(bid_data.auction_id),
        bidder_id: Set(user.addr),
        amount: Set(bid_data.amount),
        created_at: Set(now_naive.clone()),
        updated_at: Set(now_naive),
        ..Default::default()
    };

    bid_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let (hash, commit) = sync_overall_state(db).await.unwrap();
    Ok(
        Json(
            json!({
    "status": "success",
    "message": "bid created succesfully",
    "cid": hash,
    "receipt": commit.receipt,
    "stats": commit.stats
  })
        )
    )
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
pub async fn get_bid_by_auction_id(
    axum::extract::Path(id): axum::extract::Path<i32>,
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let bid: Vec<BidModel> = bid::Entity
        ::find()
        .filter(bid::Column::AuctionId.eq(id))
        .all(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    // match bid {
    // Some(bid) =>
    Ok(Json(json!({
    "status": "success",
    "data": bid
  })))
    //     None => Err((axum::http::StatusCode::NOT_FOUND, "Bid not found".to_string())),
    // }
}
pub async fn get_all_bids(db: &DatabaseConnection) -> Result<Vec<::entity::bid::Model>, DbErr> {
    ::entity::bid::Entity::find().all(db).await
}
