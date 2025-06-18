use axum::Json;
use car_auction_core::CarState;
use db::car::get_all_cars;
use entity::CarModel;
use methods::{ INIT_CAR_ELF, INIT_CAR_ID };
use risc0_zkvm::{ default_prover, ExecutorEnv, Receipt };
use serde::{ Deserialize, Serialize };
use serde_json::{ Value, json };
use std::sync::Arc;

use crate::SessionStats;

pub fn get_car_leaves(cars: &Vec<CarModel>) -> Vec<String> {
    let mut leaves = vec![];
    // let tree: Vec<&'static str> = vec!["s", "ss"];
    for car in cars {
        let car_record = format!(
            "{}:{}:{}:{}:{}:{}:{}:{}:{}:{}:{}:{}:{}:{}:{:?}:{}:{}:{}:{:?}:{}:{}",
            car.id,
            car.make,
            car.model,
            car.year,
            car.color,
            car.mileage,
            car.vin,
            car.transmission,
            car.fuel_type,
            car.engine_size,
            car.exterior_color,
            car.interior_color,
            car.odometer,
            car.description,
            car.image_url.as_ref(),
            car.auction_id,
            car.starting_price,
            car.current_price,
            car.auction_status.clone().unwrap(),
            car.created_at.and_utc().timestamp(),
            car.updated_at.and_utc().timestamp()
        );
        leaves.push(car_record);
    }
    leaves
}

#[derive(Serialize, Deserialize)]
pub struct CarCommit {
    pub receipt: Receipt,
    pub stats: SessionStats,
}
impl CarCommit {
    //  pub fn get_state() {}
    pub fn get_commit(&self) -> Result<CarState, String> {
        let state = self.receipt.journal.decode().map_err(|e| e.to_string())?;
        Ok(state)
    }
    pub fn verify_and_get_commit(&self) -> Result<CarState, String> {
        self.receipt.verify(INIT_CAR_ID).map_err(|e| e.to_string())?;
        self.get_commit()
    }
}

pub fn init_car(leaves: Vec<String>) -> Result<CarCommit, String> {
    let env = ExecutorEnv::builder().write(&leaves).unwrap().build().unwrap();
    let prover = default_prover();
    let prove_info = prover.prove(env, INIT_CAR_ELF).unwrap();
    let auction_commit = CarCommit {
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

pub async fn init_car_handler(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    let cars = get_all_cars(&db).await.unwrap();
    let leaves = get_car_leaves(&cars);
    let result = init_car(leaves).map_err(|e| (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        e.to_string(),
    ))?;
    Ok(Json(json!(result)))
}
