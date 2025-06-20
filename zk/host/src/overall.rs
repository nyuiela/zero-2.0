use std::sync::Arc;

use axum::Json;
use car_auction_core::OverallState;
use crate::{ auction::get_all_auctions, bid::get_all_bids, car::get_all_cars };
use risc0_zkvm::{ default_prover, ExecutorEnv, Receipt };
use serde::{ Deserialize, Serialize };
use serde_json::{ json, Value };
use methods::{ INIT_OVERALL_ELF, INIT_OVERALL_ID };

use crate::{ auction::get_auction_leaves, bid::get_bid_leaves, car::get_car_leaves, SessionStats };
#[derive(Serialize, Deserialize)]
pub struct OverallCommit {
    pub receipt: Receipt,
    pub stats: SessionStats,
}
#[derive(Serialize, Deserialize)]
pub struct OverallParams {
    pub car_leaves: Vec<String>,
    pub auc_leaves: Vec<String>,
    pub bid_leaves: Vec<String>,
}
impl OverallCommit {
    //  pub fn get_state() {}
    pub fn get_commit(&self) -> Result<OverallState, String> {
        let state = self.receipt.journal.decode().map_err(|e| e.to_string())?;
        Ok(state)
    }
    pub fn verify_and_get_commit(&self) -> Result<OverallState, String> {
        self.receipt.verify(INIT_OVERALL_ID).map_err(|e| e.to_string())?;
        self.get_commit()
    }
}
pub fn init_overall(
    car_leaves: Vec<String>,
    auc_leaves: Vec<String>,
    bid_leaves: Vec<String>
) -> Result<OverallCommit, String> {
    let params = OverallParams {
        car_leaves,
        auc_leaves,
        bid_leaves,
    };
    let env = ExecutorEnv::builder()
        .write(&params)
        // .write()
        .unwrap()
        .build()
        .unwrap();
    let prover = default_prover();
    let prove_info = prover.prove(env, INIT_OVERALL_ELF).unwrap();
    let auction_commit = OverallCommit {
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

pub async fn init_overall_handler(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    // car leaves
    let cars = get_all_cars(&db).await.unwrap();
    let car_leaves = get_car_leaves(&cars);

    // auct leaves
    let auc = get_all_auctions(&db).await.unwrap();
    let auc_leaves = get_auction_leaves(&auc);

    // bid leaves
    let bids = get_all_bids(&db).await.unwrap();
    let bid_leaves = get_bid_leaves(&bids);

    let result = init_overall(car_leaves, auc_leaves, bid_leaves).map_err(|e| (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        e.to_string(),
    ))?;
    Ok(Json(json!(result)))
}
