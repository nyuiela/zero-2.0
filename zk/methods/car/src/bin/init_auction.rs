#![no_main]
// #![no_std]
use risc0_zkvm::guest::env;
use car_auction_core::{ AuctionState };
risc0_zkvm::guest::entry!(main);
fn main() {
    // TODO: Implement your guest code here

    // read the input
    let input: Vec<String> = env::read();
    let state = AuctionState::init(input);
    // state.update(
    //     [Digest("6efeb890e3e88eb0b21c92b4974b786b7e7dc825c9a7f43cc2a5966f0a91f0a4")],
    //     [Digest("4efeb890e3e88eb0b21c92b4974b786b7e7dc825c9a7f43cc2a5966f0a91f0a4")]
    // );

    // let output = sha256(input);
    // TODO: do something with the input

    // write public output to the journal
    env::commit(&state);
}

// prove of db state (merkle tree)
// prove leave in merkle tree
// prove of car ownership
// prove of signature
// prove of bid (make sure the bid amount is met)
//
