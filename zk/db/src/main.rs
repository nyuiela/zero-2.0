use db::{ car::get_all_cars, establish_connection };
use entity::{ auction, bid, car, AuctionModel, BidModel, CarModel };
// use rust_decimal::prelude::ToPrimitive;
use sea_orm::{ ActiveModelTrait, Set };
// use chrono::Utc;
// use entity::sea_orm_active_enums::Status;
// use uuid::Uuid;
use axum::{ response::{ Json }, routing::{ get, post }, Router };
use sea_orm::{ EntityTrait };
// use serde::{ Deserialize, Serialize };
use serde_json::{ Value, json };
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = establish_connection("postgres://kaleel:kaleel@127.0.0.1:5432/zero").await?;
    let db = Arc::new(db);

    // Create the router with our endpoints
    let app = Router::new()
        .route("/cars/{id}", get(get_car_by_id))
        .route("/cars", get(get_all_cars_handler))
        .route("/cars", post(create_car))
        .route("/auctions", get(get_auctions))
        .route("/auctions", post(create_auction))
        .route("/auctions/{id}", get(get_auction_by_id))
        .route("/bids", get(get_bids))
        .route("/bids", post(create_bid))
        .route("/bids/{id}", get(get_bid_by_id))
        .with_state(db);

    // Start the server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    println!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app.into_make_service()).await?;

    Ok(())
}

async fn create_bid(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(bid_data): Json<BidModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let bid_model = bid::ActiveModel {
        id: Set(bid_data.id.to_owned()),
        auction_id: Set(bid_data.auction_id.to_owned()),
        bidder_id: Set(bid_data.bidder_id.to_owned()),
        amount: Set(bid_data.amount.to_owned()),
        created_at: Set(bid_data.created_at.to_owned()),
        updated_at: Set(bid_data.updated_at.to_owned()),
        ..Default::default()
    };
    bid_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(
        Json(
            json!({
        "status": "success",
        "message": "bid created succesfully"
      })
        )
    )
}
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

#[axum::debug_handler]
pub async fn create_car(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(car_data): Json<CarModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let car_model = car::ActiveModel {
        id: Set(2),
        make: Set(car_data.make.to_owned()),
        model: Set(car_data.model.to_owned()),
        year: Set(car_data.year.to_owned()),
        color: Set(car_data.color.to_owned()),
        mileage: Set(car_data.mileage.to_owned()),
        vin: Set(car_data.vin.to_owned()),
        transmission: Set(car_data.transmission.to_owned()),
        fuel_type: Set(car_data.fuel_type.to_owned()),
        engine_size: Set(car_data.engine_size.to_owned()),
        exterior_color: Set(car_data.exterior_color.to_owned()),
        interior_color: Set(car_data.interior_color.to_owned()),
        odometer: Set(car_data.odometer.to_owned()),
        description: Set(car_data.description.to_owned()),
        image_url: Set(car_data.image_url.to_owned()),
        auction_id: Set(car_data.auction_id.to_owned()),
        starting_price: Set(car_data.starting_price.to_owned()),
        current_price: Set(car_data.current_price.to_owned()),
        auction_status: Set(car_data.auction_status.to_owned()),
        created_at: Set(car_data.created_at.to_owned()),
        updated_at: Set(car_data.updated_at.to_owned()),
        ..Default::default()
    };

    car_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(
        Json(
            json!({
        "status": "success",
        "message": "Car inserted successfully"
    })
        )
    )
}

// Handler to get a car by ID
pub async fn get_car_by_id(
    axum::extract::Path(id): axum::extract::Path<i32>,
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    let car = car::Entity
        ::find_by_id(id)
        .one(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match car {
        Some(car) =>
            Ok(Json(json!({
            "status": "success",
            "data": car
        }))),
        None => Err((axum::http::StatusCode::NOT_FOUND, "Car not found".to_string())),
    }
}

// Handler to get all cars
pub async fn get_all_cars_handler(axum::extract::State(
    db,
): axum::extract::State<Arc<sea_orm::DatabaseConnection>>) -> Result<
    Json<Value>,
    (axum::http::StatusCode, String)
> {
    let cars = get_all_cars(&*db).await.map_err(|e| (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        e.to_string(),
    ))?;

    Ok(Json(json!({
        "status": "success",
        "data": cars
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
        Some(auctions) =>
            Ok(Json(json!({
          "status": "success",
          "data": auctions
        }))),
        None => Err((axum::http::StatusCode::NOT_FOUND, "Auction not found".to_string())),
    }
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
