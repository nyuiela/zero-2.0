use std::sync::Arc;

use axum::Json;
use car_auction_core::AuctionState;
use chrono::Utc;
// use db::auction::get_all_auctions;
use entity::{ auction, bid, car, AuctionModel };
use methods::{ INIT_AUCTION_ELF, INIT_AUCTION_ID };
use risc0_zkvm::{ default_prover, ExecutorEnv, Receipt };
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::Set,
    DatabaseConnection,
    DbErr,
    EntityTrait,
    QueryFilter,
    QueryOrder,
};
use serde::{ Deserialize, Serialize };
use serde_json::{ json, Value };

use crate::{ auth::USER, overall::sync_overall_state, SessionStats };

pub fn get_auction_leaves(aucs: &Vec<AuctionModel>) -> Vec<String> {
    let mut leaves = vec![];
    // let tree: Vec<&'static str> = vec!["s", "ss"];
    for auc in aucs {
        let auc_record = format!(
            "{}:{}:{}:{}:{:?}:{}:{}",
            auc.id,
            auc.car_id,
            auc.start_time.and_utc().timestamp(),
            auc.end_time.and_utc().timestamp(),
            auc.status.clone().unwrap(),
            auc.created_at.and_utc().timestamp(),
            auc.updated_at.and_utc().timestamp()
        );
        leaves.push(auc_record);
    }
    leaves
}

#[derive(Serialize, Deserialize)]
pub struct AuctionCommit {
    pub receipt: Receipt,
    pub stats: SessionStats,
}
impl AuctionCommit {
    //  pub fn get_state() {}
    pub fn get_commit(&self) -> Result<AuctionState, String> {
        let state = self.receipt.journal.decode().map_err(|e| e.to_string())?;
        Ok(state)
    }
    pub fn verify_and_get_commit(&self) -> Result<AuctionState, String> {
        self.receipt.verify(INIT_AUCTION_ID).map_err(|e| e.to_string())?;
        self.get_commit()
    }
}

pub fn init_auction(leaves: Vec<String>) -> Result<AuctionCommit, String> {
    let env = ExecutorEnv::builder().write(&leaves).unwrap().build().unwrap();
    let prover = default_prover();
    let prove_info = prover.prove(env, INIT_AUCTION_ELF).unwrap();
    let auction_commit = AuctionCommit {
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

pub async fn init_auction_handler(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    let aucs = get_all_auctions(&db).await.unwrap();
    let leaves = get_auction_leaves(&aucs);
    let result = init_auction(leaves).map_err(|e| (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        e.to_string(),
    ))?;
    Ok(Json(json!(result)))
}

#[axum::debug_handler]
pub async fn create_auction(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(auction_data): Json<AuctionModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let user = USER.get();
    eprintln!("Request from user: {:?}", user.addr);
    eprintln!("Request from username: {}", user.username);
    let now_naive: chrono::NaiveDateTime = Utc::now().naive_utc();
    let auction_id = auction::Entity
        ::find()
        .order_by_desc(auction::Column::Id)
        .one(&*db).await
        .unwrap()
        .unwrap();
    let auction_model = auction::ActiveModel {
        id: Set(auction_id.id + 1),
        car_id: Set(auction_data.car_id.clone()),
        start_time: Set(auction_data.start_time.to_owned()),
        end_time: Set(auction_data.end_time.to_owned()),
        current_bid: Set(auction_data.current_bid.to_owned()),
        bid_count: Set(auction_data.bid_count.to_owned()),
        seller: Set(user.addr),
        status: Set(auction_data.status.to_owned()),
        created_at: Set(now_naive.clone()),
        updated_at: Set(now_naive),
        ..Default::default()
    };

    if let Some(car) = car::Entity::find_by_id(auction_data.car_id).one(&*db).await.unwrap() {
        // 2. Convert it into an ActiveModel
        let mut car_model: car::ActiveModel = car.into();

        // 3. Update the field(s)
        car_model.auction_id = Set(auction_id.id + 1); // example status

        // 4. Save the updated model
        car_model.update(&*db).await.unwrap();
    }
    auction_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let (hash, commit) = sync_overall_state(db).await.unwrap();
    Ok(
        Json(
            json!({
    "status": "success",
    "message": "auction created succesfully",
    "cid": hash,
    "receipt": commit.receipt,
    "stats": commit.stats
  })
        )
    )
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
pub async fn complete_bid_by_id(
    axum::extract::Path(id): axum::extract::Path<i32>,
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let user = USER.get();
    let bid = bid::Entity
        ::find_by_id(id)
        .one(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))
        .unwrap()
        .unwrap();

    let highest_bids = bid::Entity
        ::find()
        .order_by_desc(bid::Column::Amount)
        .one(&*db).await
        .unwrap()
        .unwrap();

    if highest_bids.id != bid.id && highest_bids.bidder_id != user.addr {
        return Err((
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "Bid not the highest or the owner of the bid".to_string(),
        ));
    }
    let auctions = auction::Entity
        ::find_by_id(bid.auction_id)
        .one(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match auctions {
        Some(auctions) => {
            let now = chrono::Utc::now().timestamp();
            if auctions.end_time.and_utc().timestamp() <= now {
                return Err((
                    axum::http::StatusCode::TOO_EARLY,
                    "Auction time not yet up".to_string(),
                ));
            }

            if auctions.seller != user.addr {
                return Err((axum::http::StatusCode::FORBIDDEN, "Not owner".to_string()));
            }

            Ok(
                Json(
                    json!({
            
            "status": "success",
            "data": auctions
          })
                )
            )
        }
        None => Err((axum::http::StatusCode::NOT_FOUND, "Auction not found".to_string())),
    }
}
pub async fn get_all_auctions(
    db: &DatabaseConnection
) -> Result<Vec<::entity::auction::Model>, DbErr> {
    ::entity::auction::Entity::find().all(db).await
}
