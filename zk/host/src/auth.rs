use axum::{
    extract::{ Request },
    http::{ header, HeaderMap, HeaderValue, StatusCode },
    middleware::Next,
    response::{ IntoResponse, Response },
};
use methods::{ VERIFY_ELF, VERIFY_ID };
use risc0_zkvm::{ default_prover, ExecutorEnv, Receipt };
use sea_orm::sqlx::types::uuid;
use serde::{ Deserialize, Serialize };
use ethers::{ types::Address, utils::hex::hex };
use ethers::utils::{ hash_message };
use axum::{ Json };
use serde_json::{ json, Value };
use jsonwebtoken::{ decode, DecodingKey, Validation };

use crate::{ jwt::{ issue_token, Claims }, redis::{ get_nonce, store_nonce }, SessionStats };

#[derive(Deserialize)]
pub struct SignaturePayload {
    pub address: String, // user-supplied wallet address
    pub message: String, // original message signed
    pub signature: String, // 65-byte signature (hex)
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct VerifyParams {
    pub message: String,
    pub signature_bytes: Vec<u8>,
    pub expected_addr: Vec<u8>,
    pub timestamp: i64,
    pub username: String,
}
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct VerifyPayload {
    message: String,
    signature_bytes: String,
    expected_addr: String,
    username: String,
    nonce: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct VerifyCommit {
    receipt: Receipt,
    stats: SessionStats,
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct VerifyState {
    pub verified: bool,
    pub address: Vec<u8>,
    pub timestamp: i64,
    pub username: String,
}

impl VerifyCommit {
    //  pub fn get_state() {}
    pub fn get_commit(&self) -> Result<VerifyState, String> {
        let state = self.receipt.journal.decode().map_err(|e| e.to_string())?;
        Ok(state)
    }
    pub fn verify_and_get_commit(&self) -> Result<VerifyState, String> {
        self.receipt.verify(VERIFY_ID).map_err(|e| e.to_string())?;
        self.get_commit()
    }
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

// pub struct NoncePayload {
//     address: String,
// }
pub async fn get_verify_handler(
    // axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    // Json(payload): Json<NoncePayload>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    // convert to Vec
    let nonce = uuid::Uuid::new_v4().to_string();
    // let now = chrono::Utc::now().timestamp();
    let rs = store_nonce(&nonce).await.unwrap();
    Ok(Json(json!({
      "token": rs.0,
      "msg": rs.1
    })))
}
pub async fn verify_signature_handler(
    // axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(payload): Json<VerifyPayload>
) -> Result<Json<Value>, (axum::http::StatusCode, String)> {
    // convert to Vec
    let message = get_nonce(&payload.nonce).await.unwrap();
    print!("Get nonce {}", message);
    let signature_bytes: [u8; 65] = hex
        ::decode(&payload.signature_bytes)
        .expect("Invalid hex")
        .try_into()
        .expect("expected 65 bytes");
    let expected_addr: [u8; 20] = hex
        ::decode(&payload.expected_addr)
        .expect("Invalid hex")
        .try_into()
        .expect("expected 20 bytes");
    let now = chrono::Utc::now().timestamp();
    let vec_payload = VerifyParams {
        message: message,
        signature_bytes: signature_bytes.to_vec(),
        expected_addr: expected_addr.to_vec(),
        timestamp: now,
        username: payload.username,
    };
    let env = ExecutorEnv::builder().write(&vec_payload).unwrap().build().unwrap();
    let prover = default_prover();
    let prove_info = prover.prove(env, VERIFY_ELF).unwrap();
    let verify_commit = VerifyCommit {
        receipt: prove_info.receipt,
        stats: SessionStats {
            segments: prove_info.stats.segments,
            total_cycles: prove_info.stats.total_cycles,
            user_cycles: prove_info.stats.user_cycles,
            paging_cycles: prove_info.stats.paging_cycles,
            reserved_cycles: prove_info.stats.reserved_cycles,
        },
    };
    Ok(Json(json!(verify_commit)))
}

pub async fn verify_auth_handler(
    // axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(payload): Json<VerifyCommit>
) -> Result<Response, StatusCode> {
    let state = payload;
    let commit = state
        .verify_and_get_commit()
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))
        .unwrap();
    // .ok()
    // .unwrap();
    let addr = std::str::from_utf8(&commit.address).unwrap();

    let mut key: Option<String> = None;
    if !commit.verified {
        key = Some(issue_token(addr, &commit.username));
    } else {
        return Err(StatusCode::UNAUTHORIZED);
    }
    let mut headers = HeaderMap::new();
    headers.insert(
        axum::http::header::AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", key.unwrap()))
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Invalid header value".to_string()))
            .unwrap()
    );

    Ok((headers, Json(json!(commit))).into_response())
    // Ok(Json(json!(commit)))
}
use tokio::task_local;

task_local! {
    pub static USER: Claims;
}

pub async fn auth(req: Request, next: Next) -> Result<Response, StatusCode> {
    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;
    let token = auth_header.strip_prefix("Bearer ").ok_or(StatusCode::UNAUTHORIZED)?;

    if let Some(current_user) = authorize_current_user(token).await {
        Ok(USER.scope(current_user, next.run(req)).await)
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }

    //     // State is setup here in the middleware
    //     Ok(USER.scope(current_user, next.run(req)).await)
    // } else {
    //     Err(StatusCode::UNAUTHORIZED)
    // }
}
async fn authorize_current_user(auth_token: &str) -> Option<Claims> {
    let token_data = decode::<Claims>(
        auth_token,
        &DecodingKey::from_secret("your-secret".as_bytes()),
        &Validation::default()
    ).ok()?;

    // check expiry
    Some(token_data.claims)
}

struct UserResponse;

impl IntoResponse for UserResponse {
    fn into_response(self) -> Response {
        // State is accessed here in the IntoResponse implementation
        let current_user = USER.with(|u| Claims {
            username: u.username.clone(),
            addr: u.addr.clone(),
            exp: u.exp.clone(),
        });

        (StatusCode::OK, Json(json!(current_user))).into_response()
    }
}
