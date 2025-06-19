#![no_main]
// #![no_std]
use risc0_zkvm::guest::env;
// use car_auction_core::{ AuctionState };
risc0_zkvm::guest::entry!(main);
use k256::{ ecdsa::{ Signature, VerifyingKey, RecoveryId }, elliptic_curve::sec1::ToEncodedPoint };
use ecdsa::SigningKey;
// use k256::ecdsa::SigningKey;
use ecdsa::signature::Signer as ASigningKey;
use sha3::{ Digest, Keccak256 };
// use generic_array::GenericArray;
use k256::elliptic_curve::generic_array::GenericArray;
use car_auction_core::{ VerifyParams, VerifyCommit };

fn keccak256(data: &[u8]) -> [u8; 32] {
    let mut hasher = Keccak256::new();
    hasher.update(data);
    let result = hasher.finalize();
    let mut output = [0u8; 32];
    output.copy_from_slice(&result);
    output
}

// fn ethereum_prefixed_message(message: &[u8]) -> [u8; 32] {
//     let prefix = format!("\x19Ethereum Signed Message:\n{}", message.len());
//     keccak256([prefix.as_bytes(), message].concat().as_slice())
// }

fn recover_ethereum_address(message: &[u8], signature_bytes: [u8; 65]) -> Option<[u8; 20]> {
    // let msg_hash = ethereum_prefixed_message(message);

    // let sig = Signature::from_bytes(&signature_bytes[..64]).ok()?;
    let sig = Signature::from_bytes(GenericArray::from_slice(&signature_bytes[..64])).ok()?;

    let recovery_id = RecoveryId::try_from(signature_bytes[64] % 2).ok()?;

    let pubkey = VerifyingKey::recover_from_digest::<Keccak256>(
        Keccak256::new_with_prefix(message),
        &sig,
        recovery_id
    ).ok()?;

    // Convert to Ethereum address
    let binding = pubkey.to_encoded_point(false);
    let pubkey_bytes = binding.as_bytes();
    let hash = keccak256(&pubkey_bytes[1..]); // Skip prefix 0x04
    let mut addr = [0u8; 20];
    addr.copy_from_slice(&hash[12..]);
    Some(addr)
}
// fn verify() {
//     let msg = b"example message";

//     let signature = Signature::try_from(
//         hex!(
//             "46c05b6368a44b8810d79859441d819b8e7cdc8bfd371e35c53196f4bcacdb51
//      35c7facce2a97b95eacba8a586d87b7958aaf8368ab29cee481f76e871dbd9cb"
//         ).as_slice()
//     )?;try_from

//     let recid = RecoveryId::(1u8)?;

//     let recovered_key = VerifyingKey::recover_from_digest(
//         Keccak256::new_with_prefix(msg),
//         &signature,
//         recid
//     )?;

//     let expected_key = VerifyingKey::from_sec1_bytes(
//         &hex!("0200866db99873b09fc2fb1e3ba549b156e96d1a567e3284f5f0e859a83320cb8b")
//     )?;
// }

// assert_eq!(recovered_key, expected_key);
fn vec_to_array(vec: Vec<u8>) -> Option<[u8; 65]> {
    if vec.len() == 65 {
        let boxed_slice: Box<[u8]> = vec.into_boxed_slice();
        let boxed_array: Box<[u8; 65]> = boxed_slice.try_into().ok()?;
        Some(*boxed_array)
    } else {
        None
    }
}
fn vec_to_array_addr(vec: Vec<u8>) -> Option<[u8; 20]> {
    if vec.len() == 20 {
        let boxed_slice: Box<[u8]> = vec.into_boxed_slice();
        let boxed_array: Box<[u8; 20]> = boxed_slice.try_into().ok()?;
        Some(*boxed_array)
    } else {
        None
    }
}

fn main() {
    let input: VerifyParams = env::read();
    let message = input.message.as_bytes();
    let signature_bytes = vec_to_array(input.signature_bytes).expect(
        "Failed to convert vec to array"
    );
    let expected_addr = vec_to_array_addr(input.expected_addr).expect(
        "Failed to convert vec to array"
    );

    // let message = &[u8, 20];
    // let signature = &[0, u8];
    // let add = &[20, u8];
    // verify_signature(message, signature, add);
    let recovered_addr = recover_ethereum_address(message, signature_bytes).unwrap_or([0u8; 20]);
    // match recovered_addr {
    //     Some(val) => {
    //         env::commit(&true);
    //     }
    //     None => env::commit(&false),
    // }
    // assert_eq!(expected_addr, recovered_addr);
    let res = expected_addr == recovered_addr;
    let commit = VerifyCommit {
        timestamp: input.timestamp,
        verified: res,
        address: recovered_addr.to_vec(),
        username: input.username,
    };
    env::commit(&commit);
}
