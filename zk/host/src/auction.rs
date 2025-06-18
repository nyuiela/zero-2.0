use std::sync::Arc;

use axum::Json;
use car_auction_core::AuctionState;
use db::get_all_auctions;
use entity::AuctionModel;
use methods::{ INIT_AUCTION_ELF, INIT_AUCTION_ID };
use risc0_zkvm::{ default_prover, ExecutorEnv, Receipt };
use serde::{ Deserialize, Serialize };
use serde_json::{ json, Value };

use crate::SessionStats;

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
