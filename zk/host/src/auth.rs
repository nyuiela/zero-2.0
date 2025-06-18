use std::sync::Arc;

use axum::{
    //     async_trait,
    //     extract::{ FromRef, FromRequestParts },
    http::{ header::AUTHORIZATION, request::Parts, StatusCode },
    //     RequestPartsExt,
};
// use sea_orm::{ DatabaseConnection, QueryFilter, ColumnTrait };
use serde::{ Deserialize, Serialize };

// use ethers::signers::Signer;
use ethers::{ types::Address, utils::hex::hex };
use ethers::utils::{ keccak256, hash_message };
use axum::{ Json };

#[derive(Deserialize)]
pub struct SignaturePayload {
    pub address: String, // user-supplied wallet address
    pub message: String, // original message signed
    pub signature: String, // 65-byte signature (hex)
}

pub async fn verify_signature(Json(payload): Json<SignaturePayload>) -> Result<
    Json<String>,
    (StatusCode, String)
> {
    let sig_bytes = match
        hex::decode(payload.signature.strip_prefix("0x").unwrap_or(&payload.signature))
    {
        Ok(b) => b,
        Err(_) => {
            return Err((StatusCode::BAD_REQUEST, "Invalid signature hex".into()));
        }
    };

    let signature = match ethers::types::Signature::try_from(&sig_bytes[..]) {
        Ok(sig) => sig,
        Err(_) => {
            return Err((StatusCode::BAD_REQUEST, "Invalid signature format".into()));
        }
    };

    // Hash the message with Ethereum's prefixing
    let message_hash = hash_message(&payload.message);

    // Recover address from signature
    let recovered = match signature.recover(message_hash) {
        Ok(addr) => addr,
        Err(_) => {
            return Err((StatusCode::UNAUTHORIZED, "Signature verification failed".into()));
        }
    };

    // Compare addresses (case-insensitive)
    let claimed = payload.address
        .parse::<Address>()
        .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid address".into()))?;

    if claimed != recovered {
        return Err((StatusCode::UNAUTHORIZED, "Address mismatch".into()));
    }

    // ✅ Verified! You can now issue JWT or create zk proof.
    Ok(Json(format!("Signature verified for address: {:?}", claimed)))
}

pub async fn verify_signature_handler(
    axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(payload): Json<SignaturePayload>
) {}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
// #[sea_orm(table_name = "user")]
pub struct UserModel {
    // #[sea_orm(primary_key)]
    pub id: i32,
    pub username: String,
    pub email: String,
    pub hashed_password: String,
    pub token: Option<String>, // or use a sessions table
    // pub created_at: DateTime,
    // pub updated_at: DateTime,
}

// pub struct AuthUser(pub UserModel);
// #[async_trait]
// impl<S> FromRequestParts<S> for AuthUser where S: Send + Sync, DatabaseConnection: FromRef<S> {
//     // 👇 Add the missing associated type
//     type Rejection = (StatusCode, String);

//     async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
//         let db = DatabaseConnection::from_ref(state);

//         // Extract the `Authorization` header
//         let auth_header = parts.headers
//             .get(AUTHORIZATION)
//             .ok_or((StatusCode::UNAUTHORIZED, "Missing Authorization header".into()))?;

//         let token = auth_header
//             .to_str()
//             .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid Authorization header".into()))?
//             .trim_start_matches("Bearer ")
//             .to_string();

//         // Lookup user by token
//         let user = user::Entity
//             ::find()
//             .filter(user::Column::Token.eq(token))
//             .one(&db).await
//             .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
//             .ok_or((StatusCode::UNAUTHORIZED, "Invalid or expired token".into()))?;

//         Ok(AuthUser(user))
//     }
// }
