### Zero Smart contract Notes and planning

**\*author** Lydia

## Permission

- function selector wise persion calls
- modifiers/ function as modiers; csn calls
- onwer roles and constants/ addresses

## Oracle

- oracle house
- oracle factory -- made this a clonable from the registration
- Dev remember to update the registraction logic to go with the zk implemations !!!!

## master manage

- implements logic for listers
- hold oracle cloning and persion

## how they coonet

- all zk verified listers will be cloned a manger address that links with the permssion address and oracle implemntation to fetch price feed of their asset from the oraclemaster

## Next Step

- Auctiion -- the car owner are going to auction, owner can be buyers who have full ownership
  buy ---- new owner --- aution

- transfer ownership for car logic ---- ownship contract -- ownership rights
- Transfer contract...... instead of hiting transfer i will make a whole contract for that
  // use ETH and usdc?? right? okay cool
- car_registry -- goes with the registercar in orcale --- match it and change to fit zk -- qualifications needed

-- CCIP ------

## more

-- state change ?? -- meaning??
-- buy(list) / sell
-- steps

check proofs/ merkle_verifier  
after the events happen, sync /update ?? the state --- verify the changes accros all chains
interworks with the ccip

/// transfer....

## Next steps

- transfer lib ---- transfer logic for usdc transfer and eth transfer to make it cooler
- merkle verifier ---> proof lib ----> adds prrof to tree
- car registry --- two kinds of registry, one for fist time car registar and transfer of ownership registry ..... both cases use the merkel verfier and update across the chains.

  ## today 25th

  deadline mode just use direct trans
  fer methods
  added fee implementation for protocol
  about to start brand/sell wise fee

## Auction

- creation auction ------ >> epoch
- start Auction
- Bid
- winner
  can bid with either usdc or eth

highest bidder replaces the lowest

## Zero NFT

done with implementation

## Auction started

-- shoukd we lock bids in contract and refun when they dont win?
-- or which other method can i use to save on gas
-- epoch based auction

---- bidPlacement
newbid should be bigger than old big
//initial auction 50 50 60
// initial bidder should be less than or equal to the first bid

// fair chance thresshold
-- stake

---

after the winner has been slected we change the state accross all the chains
updated the proofs etc
anything that has to do with giving new owner owner righ
meaning i need to start the transferrights in the register contract

make deploy ARGS="--network base"
to deploy on base

### deploment address base

=== DEPLOYMENT SUMMARY ===
Network: Base
Deployer: 0x4C08D39F511B9d20B3cA9F62959E6c1a3DD50910
PermissionManager: 0xccfC47DaC852fa570f2D92D198fD45177B12280b
BrandPermissionManager: 0x5e714A4D08644D508b7615eFc2801d10912Ad2d2
CarOracle: 0xef903621A2B9b6201703bf45062f0eF561C89CE4
OracleMaster: 0x6fFbBbe8f41fCCC5702f0a857177eb8d516a7703
Profile: 0xFC6BA1cFc95C65c443E231C027f9f363d7334d7b
StateManager: 0x75947Ab2972d74c11e168395a8b2136c49d54c79
InitFunction: 0xaCF30850FbF7411160e671391cd9Af1194275C3E
MerkleVerifier: 0x35fb0621d31168A2b7F95AB38666C2C16e00796d
ProofSync: 0xFAd8F4772f9434AdCFb5514b1bF86ae76f1e0640
CrossToken (CCIP): 0x8b8b0Ba6740ae3b1bbd061905f09ae9940B3B72D
Messenger: 0x690ca1dddfE7cA96e824e7E376F1Bc3D33FFA773
SyncFunction: 0x7FA8B0fA41cBab0d85A6FB4827BBeD5A1FD2FD16
Fee: 0x8679e95de1cd6d62f9172A7391dd7cfCbe2691FC
Reputation: 0x2e9C81434CeeCe688E2f62a527D5AAD1e41ED82C
CarRegistry: 0x3691D3a793B851f953C7c410E6d45d718F7394b6
ZeroNFT: 0x63EeFA5e2Cb952D700C96B9A3406A871A87E3037
Auction: 0xb2AdB85A7b4A16C8a933013980D7d570BaeAd6c1
StateCheckFunction: 0x3F92729E23eDe296BeFd31C2548C962965Ebc3B3
messenger: 0x690ca1dddfE7cA96e824e7E376F1Bc3D33FFA773

transfer funds links to
-- cross token
-- messanger

## deployment address cross chain eth

## deployment address cross chain sonic

## deployment address cross chain hedera

## deployment address cross chain avalanche
