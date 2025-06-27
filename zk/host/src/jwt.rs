use jsonwebtoken::{ encode, Header, EncodingKey };
use serde::{ Serialize, Deserialize };

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub addr: String, // Ethereum address
    pub exp: usize, // Expiry time (unix timestamp)
    pub username: String,
}

pub fn issue_token(address: &str, username: &str) -> String {
    let expiration = chrono::Utc
        ::now()
        .checked_add_signed(chrono::Duration::minutes(15))
        .unwrap()
        .timestamp() as usize;

    let claims = Claims {
        addr: address.to_string(),
        exp: expiration,
        username: username.to_string(),
    };

    let key = EncodingKey::from_secret("your-secret".as_ref());
    encode(&Header::default(), &claims, &key).unwrap()
}
