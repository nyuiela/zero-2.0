use ::entity::{ car, CarModel };
use sea_orm::{ ActiveModelTrait, DatabaseConnection, DbErr };
use axum::{ response::{ Json } };
use sea_orm::{ EntityTrait };
use serde_json::{ Value, json };
use std::sync::Arc;
use host::auth::{ Claims, USER };

#[axum::debug_handler]
pub async fn create_car(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(car_data): Json<CarModel>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    // Access the user from the task_local
    let current_user = USER.with(|user| user.clone());

    // You can now use the user's data.
    // For example, let's print the user's address and set it as the car owner.
    println!("Request from user: {}", current_user.addr);
    println!("Request from username: {}", current_user.username);

    use sea_orm::ActiveValue::Set;

    let car_model = car::ActiveModel {
        id: Set(car_data.id.to_owned()),
        make: Set(car_data.make.to_owned()),
        model: Set(car_data.model.to_owned()),
        year: Set(car_data.year),
        color: Set(car_data.color.to_owned()),
        mileage: Set(car_data.mileage),
        vin: Set(car_data.vin.to_owned()),
        transmission: Set(car_data.transmission.to_owned()),
        fuel_type: Set(car_data.fuel_type.to_owned()),
        engine_size: Set(car_data.engine_size.to_owned()),
        exterior_color: Set(car_data.exterior_color.to_owned()),
        interior_color: Set(car_data.interior_color.to_owned()),
        odometer: Set(car_data.odometer),
        description: Set(car_data.description.to_owned()),
        image_url: Set(car_data.image_url.clone()), // Vec<String>
        auction_id: Set(car_data.auction_id),
        starting_price: Set(car_data.starting_price),
        current_price: Set(car_data.current_price),
        auction_status: Set(car_data.auction_status.clone()), // Option<Status>
        summary: Set(car_data.summary.to_owned()),
        report: Set(car_data.report.clone()), // Json
        included: Set(car_data.included.clone()), // Json
        features: Set(car_data.features.clone()), // Json
        vehicale_overview: Set(car_data.vehicale_overview.to_owned()),
        location: Set(car_data.location.to_owned()),
        seller: Set(car_data.seller.to_owned()),
        seller_type: Set(car_data.seller_type.to_owned()),
        lot: Set(car_data.lot.to_owned()),
        highlight: Set(car_data.highlight.clone()), // Option<Vec<String>>
        token_id: Set(car_data.token_id),
        // Set the owner to the address from the JWT
        owner: Set(current_user.addr),
        created_at: Set(car_data.created_at),
        updated_at: Set(car_data.updated_at),
        ..Default::default()
    };

    car_model
        .insert(&*db).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(json!({
      "status": "success",
      "message": "Car inserted successfully"
  })))
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
        Some(car) => Ok(Json(json!({
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
pub async fn get_all_cars(db: &DatabaseConnection) -> Result<Vec<::entity::car::Model>, DbErr> {
    ::entity::car::Entity::find().all(db).await
}
