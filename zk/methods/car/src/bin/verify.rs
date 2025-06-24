#![no_main]
#![no_std]

use risc0_zkvm::guest::env;
use k256::{ ecdsa::{ RecoveryId, Signature, VerifyingKey }, elliptic_curve::sec1::ToEncodedPoint };
use sha3::{ Digest, Keccak256 };
use car_auction_core::{ VerifyCommit, VerifyParams };
use arrayvec::ArrayString;

// #[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
// pub struct VerifyParams {
//     pub message: str,
//     pub signature_bytes: str,
//     pub expected_addr: str,
//     pub timestamp: i64,
//     pub username: str,
// }
// #[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
// pub struct VerifyCommit {
//     pub verified: bool,
//     pub address: String,
//     pub timestamp: i64,
//     pub username: String,
// }

fn write_usize_to_buf(n: usize, buf: &mut [u8]) -> Option<&str> {
    let mut i = buf.len();
    let mut n = n;
    if n == 0 {
        if i == 0 {
            return None;
        }
        i -= 1;
        buf[i] = b'0';
    } else {
        while n > 0 {
            if i == 0 {
                return None;
            }
            i -= 1;
            buf[i] = b'0' + ((n % 10) as u8);
            n /= 10;
        }
    }
    core::str::from_utf8(&buf[i..]).ok()
}

fn recover_ethereum_address(sig_hex: &str, msg: &str) -> Result<[u8; 20], &'static str> {
    let sig_bytes = hex
        ::decode(sig_hex.strip_prefix("0x").unwrap_or(sig_hex))
        .map_err(|_| "Invalid signature hex")?;
    if sig_bytes.len() != 65 {
        return Err("Signature is not 65 bytes");
    }
    let sig = Signature::try_from(&sig_bytes[..64]).map_err(|_| "Bad signature format")?;
    let v = sig_bytes[64];
    let recid = RecoveryId::try_from(if v >= 27 { v - 27 } else { v % 2 }).map_err(
        |_| "Invalid recovery id"
    )?;

    let msg_bytes = msg.as_bytes();

    // Build prefix: "\x19Ethereum Signed Message:\n<length>"
    let mut prefix = ArrayString::<64>::new();
    prefix.push_str("\x19Ethereum Signed Message:\n");
    {
        let mut numbuf = [0u8; 20];
        let len_str = write_usize_to_buf(msg_bytes.len(), &mut numbuf).ok_or(
            "Num buffer too small"
        )?;
        prefix.push_str(len_str);
    }

    // Hashing: keccak(prefix || message)
    let mut hasher = Keccak256::new();
    hasher.update(prefix.as_bytes());
    hasher.update(msg_bytes);
    let hash = hasher.finalize();

    let key = VerifyingKey::recover_from_prehash(&hash, &sig, recid).map_err(
        |_| "Failed key recovery"
    )?;
    let enc = key.to_encoded_point(false);
    let pub_bytes = enc.as_bytes();
    let addr_hash = Keccak256::digest(&pub_bytes[1..]);
    let mut addr = [0u8; 20];
    addr.copy_from_slice(&addr_hash[12..]);

    Ok(addr)
}

risc0_zkvm::guest::entry!(main);
fn main() {
    let input: VerifyParams = env::read();

    let recovered = recover_ethereum_address(&input.signature_bytes, &input.message).unwrap_or(
        [0u8; 20]
    );

    // Convert recovered to hex-with-0x prefix using stack buffer
    let mut hexbuf = [0u8; 40];
    hex::encode_to_slice(&recovered, &mut hexbuf).expect("buffer size is correct");
    let mut eth_addr = ArrayString::<42>::new();
    eth_addr.push_str("0x");
    eth_addr.push_str(core::str::from_utf8(&hexbuf).unwrap());

    let expected = {
        // lowercase input
        let mut tmp = ArrayString::<42>::new();
        for b in input.expected_addr.as_bytes() {
            tmp.push((*b as char).to_ascii_lowercase() as u8 as char);
        }
        tmp
    };

    let verified = expected.as_str() == eth_addr.as_str();

    let commit = VerifyCommit {
        timestamp: input.timestamp,
        verified,
        address: expected.as_str().try_into().unwrap(),
        username: input.username,
    };
    env::commit(&commit);
}
