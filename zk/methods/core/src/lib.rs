// #![cfg_attr(not(test), no_std)]

use serde::{ Deserialize, Serialize };
// use sha2::{ Digest, Sha256 };
// use tinyvec::*;
use risc0_zkp::core::digest::Digest;
use tiny_keccak::{ Hasher, Keccak };
use chrono::{ DateTime, Local, Utc };

#[derive(Serialize, Deserialize)]
pub struct OverallParams {
    pub car_leaves: Vec<String>,
    pub auc_leaves: Vec<String>,
    pub bid_leaves: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct CarAuctionState {
    pub car_state: Digest,
    pub auction_state: Digest,
    pub bid_state: Digest,
    pub overall: Digest,
}

// auction commit :: CRUD
// bid commit :: CRUD
// car commit :: CRUD
pub enum CarAuctionAction {}
impl CarAuctionState {
    pub fn init() {
        // start of the database
        // stores necessay details to communicate with smart contract.
        // stores initial state on the blockchain
        // initial state serves as the start of the merkle tree on the blockchain (car, auction, bid, overall)
        // cannot reset state or reinit state.
    }

    pub fn process() {
        // process results in change of state
        // update state and sync with remote state.
    }

    fn sync() {
        //sync state with smart contract
        //verify localState with remoteState (contract)
    }
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub enum AuctionAction {
    INIT,
    CREATE,
    UPDATE,
    DELETE,
}
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub enum Actor {
    ADMIN,
    SYSTEM,
}

// actor rules - clearly stating what those actors does and their permissions.
// allow for transparency on who issued commands without revealing the actors identity.

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct AuctionState {
    pub old_state: Vec<Digest>,
    pub new_state: Vec<Digest>,
    pub overall: Digest,
    pub leaves: usize,
    pub action: AuctionAction,
    pub actor: Actor,
}
// verify actor before completing a process.
impl AuctionState {
    pub fn init(db: Vec<String>) -> Self {
        let mut auction_state: Vec<Digest> = vec![];
        let mut hasher = Keccak::v256();
        let mut hasherb = Keccak::v256();
        for x in &db {
            hasher.update(&x.as_bytes());
            hasherb.update(&x.as_bytes());
            let mut output = [0; 32];
            hasher.clone().finalize(&mut output);
            let digest = Digest::from_bytes(output);
            // let xr = sha256(x);
            auction_state.push(digest);
        }
        let mut output = [0; 32];
        hasherb.finalize(&mut output);
        let digest = Digest::from_bytes(output);

        AuctionState {
            old_state: auction_state.clone(),
            new_state: auction_state,
            overall: digest,
            leaves: db.len(),
            action: AuctionAction::INIT,
            actor: Actor::SYSTEM,
        }
    }

    pub fn update(&mut self, new_state: Vec<Digest>, overall: Digest) {
        self.old_state = self.new_state.clone();
        self.new_state = new_state;
        self.overall = overall;
    }
    pub fn process(action: AuctionAction) {
        match action {
            init => {
                // call the function here and make sure it workes.
                // each function call returns the new state which will be used here to update the state.
            }
        }
    }

    pub fn sync() {}
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub enum BidAction {
    INIT,
    CREATE,
    UPDATE,
    DELETE,
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct BidState {
    pub old_state: Vec<Digest>,
    pub new_state: Vec<Digest>,
    pub overall: Digest,
    pub leaves: usize,
    pub action: BidAction,
    pub actor: Actor,
}

impl BidState {
    pub fn init(db: Vec<String>) -> Self {
        let mut auction_state: Vec<Digest> = vec![];
        let mut hasher = Keccak::v256();
        let mut hasherb = Keccak::v256();
        for x in &db {
            hasher.update(&x.as_bytes());
            hasherb.update(&x.as_bytes());
            let mut output = [0; 32];
            hasher.clone().finalize(&mut output);
            let digest = Digest::from_bytes(output);
            // let xr = sha256(x);
            auction_state.push(digest);
        }
        let mut output = [0; 32];
        hasherb.finalize(&mut output);
        let digest = Digest::from_bytes(output);

        BidState {
            old_state: auction_state.clone(),
            new_state: auction_state,
            overall: digest,
            leaves: db.len(),
            action: BidAction::INIT,
            actor: Actor::SYSTEM,
        }
    }

    pub fn update(&mut self, new_state: Vec<Digest>, overall: Digest) {
        self.old_state = self.new_state.clone();
        self.new_state = new_state;
        self.overall = overall;
    }
    pub fn process(action: AuctionAction) {
        match action {
            init => {
                // call the function here and make sure it workes.
                // each function call returns the new state which will be used here to update the state.
            }
        }
    }

    pub fn sync() {}
}

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct OverallState {
    pub car_state: CarState,
    pub auc_state: AuctionState,
    pub bid_state: BidState,
    pub old_state: Digest,
    pub new_state: Digest,
    pub updated_at: String,
}

impl OverallState {
    pub fn new() -> Self {
        let output = [0; 32];
        let digest = Digest::from_bytes(output);
        let vec_digest: Vec<Digest> = vec![];

        // let dt = Local::now();
        let auc_state = AuctionState {
            old_state: vec_digest.clone(),
            new_state: vec_digest.clone(),
            overall: digest,
            leaves: 0,
            action: AuctionAction::INIT,
            actor: Actor::SYSTEM,
        };
        let car_state = CarState {
            old_state: vec_digest.clone(),
            new_state: vec_digest.clone(),
            overall: digest,
            leaves: 0,
            action: CarAction::INIT,
            actor: Actor::SYSTEM,
        };
        let bid_state = BidState {
            old_state: vec_digest.clone(),
            new_state: vec_digest.clone(),
            overall: digest,
            leaves: 0,
            action: BidAction::INIT,
            actor: Actor::SYSTEM,
        };
        OverallState {
            car_state: car_state,
            auc_state: auc_state,
            bid_state: bid_state,
            old_state: digest,
            new_state: digest,
            updated_at: "date".to_string(),
        }
    }
    pub fn sync(
        &self,
        car: &CarState,
        auc: &AuctionState,
        bid: &BidState
    ) -> Result<Self, Box<dyn std::error::Error>> {
        let dt: DateTime<Local> = Local::now();
        // checks
        // new_state == old_state
        // let mut auction_state: Vec<Digest> = vec![];
        let mut hasher = Keccak::v256();

        hasher.update(auc.overall.as_bytes());
        hasher.update(bid.overall.as_bytes());
        hasher.update(car.overall.as_bytes());
        let mut output = [0; 32];
        hasher.finalize(&mut output);
        let digest = Digest::from_bytes(output);
        if car.old_state != self.car_state.new_state {
            return Err("Car state sync failed".into());
            // Err::<T, E>("some error message");
        }
        if auc.old_state != self.auc_state.new_state {
            return Err("Auction state sync failed".into());
        }
        if bid.old_state != self.bid_state.new_state {
            return Err("Bid state sync failed".into());
        }
        Ok(OverallState {
            car_state: car.to_owned(),
            auc_state: auc.to_owned(),
            bid_state: bid.to_owned(),
            old_state: self.new_state,
            new_state: digest,
            updated_at: dt.to_string(),
        })
    }
}

// car state

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub enum CarAction {
    INIT,
    CREATE,
    UPDATE,
    DELETE,
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct CarState {
    pub old_state: Vec<Digest>,
    pub new_state: Vec<Digest>,
    pub overall: Digest,
    pub leaves: usize,
    pub action: CarAction,
    pub actor: Actor,
}
// verify actor before completing a process.
impl CarState {
    pub fn init(db: Vec<String>) -> Self {
        let mut auction_state: Vec<Digest> = vec![];
        let mut hasher = Keccak::v256();
        let mut hasherb = Keccak::v256();
        for x in &db {
            hasher.update(&x.as_bytes());
            hasherb.update(&x.as_bytes());
            let mut output = [0; 32];
            hasher.clone().finalize(&mut output);
            let digest = Digest::from_bytes(output);
            // let xr = sha256(x);
            auction_state.push(digest);
        }
        let mut output = [0; 32];
        hasherb.finalize(&mut output);
        let digest = Digest::from_bytes(output);

        CarState {
            old_state: auction_state.clone(),
            new_state: auction_state,
            overall: digest,
            leaves: db.len(),
            action: CarAction::INIT,
            actor: Actor::SYSTEM,
        }
    }

    pub fn update(&mut self, new_state: Vec<Digest>, overall: Digest) {
        self.old_state = self.new_state.clone();
        self.new_state = new_state;
        self.overall = overall;
    }
    pub fn process(action: AuctionAction) {
        match action {
            init => {
                // call the function here and make sure it workes.
                // each function call returns the new state which will be used here to update the state.
            }
        }
    }

    pub fn sync() {}
}
