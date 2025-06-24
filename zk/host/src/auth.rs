#[warn(unused_assignments)]
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
use ethers::{ types::Address, utils::hex::{ hex } };
use axum::{ Json };
use serde_json::{ json, Value };
use jsonwebtoken::{ decode, DecodingKey, Validation };
use k256::{ ecdsa::{ RecoveryId, Signature, VerifyingKey } };
// use ecdsa::SigningKey;
use sha3::{ Digest, Keccak256 };

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
    pub signature_bytes: String,
    pub expected_addr: String,
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
    pub address: String,
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
    // let message_hash = hash_message(&payload.message);

    // Recover address from signature
    let recovered = match signature.recover(payload.message) {
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
) -> Result<Json<Value>, (StatusCode, String)> {
    // convert to Vec
    let nonce = uuid::Uuid::new_v4().to_string();
    // let now = chrono::Utc::now().timestamp();
    let rs = store_nonce(&nonce).await.unwrap();
    Ok(Json(json!({
      "nonce": rs.0,
      "msg": rs.1
    })))
}
fn _keccak256(data: &[u8]) -> [u8; 32] {
    let mut hasher = Keccak256::new();
    hasher.update(data);
    let result = hasher.finalize();
    let mut output = [0u8; 32];
    output.copy_from_slice(&result);
    output
}
// fn recover_ethereum_address(message: &[u8], signature_bytes: [u8; 65]) -> Option<[u8; 20]> {
//     // let msg_hash = ethereum_prefixed_message(message);
//     let message_hash = hash_message(message);
//     // let sig = Signature::from_bytes(&signature_bytes[..64]).ok()?;
//     let sig = Signature::from_bytes(GenericArray::from_slice(&signature_bytes[..64])).ok()?;

//     let recovery_id = Id::new(signature_bytes[64] % 27, false).ok()?; // recovery_id should be 0 or 1
//     let recoverable_sig = Signature::new(&sig, recovery_id).ok()?;

//     // Recover public key
//     let pubkey = recoverable_sig.recover_verify_key_from_digest_bytes(message_hash.into()).ok()?;

//     // Compute Ethereum address
//     let pubkey_encoded = pubkey.to_encoded_point(false);
//     let pubkey_bytes = pubkey_encoded.as_bytes();
//     let hash = keccak256(&pubkey_bytes[1..]); // Remove 0x04 prefix
//     let mut addr = [0u8; 20];
//     addr.copy_from_slice(&hash[12..]);
//     Some(addr)
// }

fn _recover_ethereum_address(signature_hex: &str, message: &str) -> Result<[u8; 20], String> {
    let signature_bytes = hex
        ::decode(signature_hex.strip_prefix("0x").unwrap_or(signature_hex))
        .map_err(|e| format!("Invalid signature hex: {}", e))?;

    if signature_bytes.len() != 65 {
        return Err(format!("Expected 65-byte signature, got {}", signature_bytes.len()));
    }

    let signature = Signature::try_from(&signature_bytes[..64]).map_err(|e|
        format!("Invalid signature: {}", e)
    )?;

    let v = signature_bytes[64];
    let recovery_id_val = if v >= 27 { v - 27 } else { v % 2 };
    let recid = RecoveryId::try_from(recovery_id_val).map_err(|e|
        format!("Invalid recovery ID: {}", e)
    )?;

    // Create Ethereum message hash with proper prefix
    let message_bytes = message.as_bytes();
    let prefix = format!("\x19Ethereum Signed Message:\n{}", message_bytes.len());
    let mut hasher = Keccak256::new();
    hasher.update(prefix.as_bytes());
    hasher.update(message_bytes);
    let message_hash = hasher.finalize();
    // let msg_hh = Keccak256::digest(message_hash);

    let recovered_key = VerifyingKey::recover_from_prehash(
        &message_hash,
        &signature,
        recid
    ).map_err(|e| format!("Failed to recover public key: {}", e))?;

    let encoded_point = recovered_key.to_encoded_point(false);
    let public_key_bytes = encoded_point.as_bytes();

    let hash = Keccak256::digest(&public_key_bytes[1..]);

    let mut address = [0u8; 20];
    address.copy_from_slice(&hash[12..]);

    Ok(address)
}
pub async fn verify_signature_handler(
    // axum::extract::State(db): axum::extract::State<Arc<sea_orm::DatabaseConnection>>,
    Json(payload): Json<VerifyPayload>
) -> Result<Json<Value>, (StatusCode, String)> {
    // convert to Vec
    // let message = get_nonce(&payload.nonce).await;
    // let message = payload.message.clone();
    let message = get_nonce(&payload.nonce).await;
    let message = message.ok_or_else(|| {
        (StatusCode::BAD_REQUEST, "Failed to verify nonce".to_string())
    })?;
    // let message = message.ok_or_else(|| {
    //     (StatusCode::BAD_REQUEST, "Failed to verify nonce".to_string())
    // })?;
    eprintln!("Get nonce {}", message);
    // let message_bytes: [u8] = hex::decode(&message).expect("Invalid mesg");
    // let signature_bytes: [u8; 65] = hex
    //     ::decode(&payload.signature_bytes)
    //     .expect("Invalid hex")
    //     .try_into()
    //     .expect("expected 65 bytes");
    // let expected_addr: [u8; 20] = hex
    //     ::decode(&payload.expected_addr)
    //     .expect("Invalid hex")
    //     .try_into()
    //     .expect("expected 20 bytes");

    let now = chrono::Utc::now().timestamp();
    let vec_payload = VerifyParams {
        message: message.clone(),
        signature_bytes: payload.signature_bytes.clone(),
        expected_addr: payload.expected_addr.clone(),
        timestamp: now,
        username: payload.username,
    };
    //  let recovered_addr = recover_ethereum_address(&payload.signature_bytes, &message).map_err(|e| {
    //      (StatusCode::BAD_REQUEST, e)
    //  })?;
    //  let eth_address = format!("0x{}", hex::encode(recovered_addr));
    //  println!("{}", eth_address);

    //  eprintln!("Recovered address{:?}", eth_address);

    let env = ExecutorEnv::builder().write(&vec_payload).unwrap().build().unwrap();
    let prover = default_prover();
    let prove_info = prover.prove(env, VERIFY_ELF).unwrap();
    eprint!("Prove info {:?}", prove_info.stats);
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
    // eprint!("{:?}", verify_commit);
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
    // let addr = std::str::from_utf8(&commit.address).unwrap();
    let mut key: Option<String> = None;
    eprintln!("Verified {:?}", commit);
    if commit.verified {
        key = Some(issue_token(&commit.address, &commit.username));
    } else {
        return Ok(
            (
                Json(
                    json!({
          "message": "User not verified",
          "status": "failed"
        })
                ),
            ).into_response()
        );
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
use tokio::{ task_local };

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
