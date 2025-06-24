// use redis;
use redis::{ Commands };

pub async fn store_nonce(
    //  client: redis::Client,
    // address: &str,
    nonce: &str
) -> Result<(String, String), Box<dyn std::error::Error>> {
    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    // let redis_client = env::var();
    // let client = redis::Client
    //     ::open("redis://default:gvrNgCycAhIfWGFNKbGXsnWBGDsZFhgv@shortline.proxy.rlwy.net:10884")
    //     .unwrap();
    let mut con = client.get_connection().unwrap();
    //  con.set(format!("nonce:{}", address), nonce, 300)?; // expire in 5 minutes
    let now = chrono::Utc::now().timestamp();
    let message = format!("Login at {}", &now);
    let ms = format!("{}:{}", nonce, now);
    con.set(&ms, &message)?;
    Ok((ms.clone(), message.clone()))
}

pub async fn get_nonce(nonce: &str) -> Option<String> {
    // let client = redis::Client
    //     ::open("redis://default:gvrNgCycAhIfWGFNKbGXsnWBGDsZFhgv@shortline.proxy.rlwy.net:10884")
    //     .unwrap();
    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let mut con = client.get_connection().unwrap();
    con.get(nonce).ok()
}
