#![no_main]
// #![no_std]
use risc0_zkvm::guest::env;
use car_auction_core::{ AuctionState, OverallState, CarState, BidState, OverallParams };

risc0_zkvm::guest::entry!(main);
fn main() {
    // TODO: Implement your guest code here

    // read the input
    let input: OverallParams = env::read();

    // create genesis zk block
    let overall: OverallState = OverallState::new();
    //do something
    let car_state: CarState = CarState::init(input.car_leaves);
    let auc_state: AuctionState = AuctionState::init(input.auc_leaves);
    let bid_state: BidState = BidState::init(input.bid_leaves);
    // let overall: OverallState = overall
    // .sync(&car_state, &auc_state, &bid_state)
    // .expect("Sync failed");

    env::commit(&overall);
}

// prove of db state (merkle tree)
// prove leave in merkle tree
// prove of car ownership
// prove of signature
// prove of bid (make sure the bid amount is met)
//
