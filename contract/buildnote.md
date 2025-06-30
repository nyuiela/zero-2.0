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

Deploying PermissionManager...
PermissionManager deployed at: 0xE2d0fC5bc27496109cC2AB7887e5966dC1d5F610
Deploying BrandPermissionManager...
BrandPermissionManager deployed at: 0x2fcE9Ee2B4A6196b544fA467cA59102b208F2748
Deploying CarOracle...
CarOracle deployed at: 0x40c917240fF0F4F228f4922e0869F54560D1e095
Deploying OracleMaster...
OracleMaster deployed at: 0xE853149E0f4De9Ce641FC0611b8dbf1e3c3750f4
Deploying Profile...
Profile deployed at: 0x0A0e884c546e4CBB72eafb4C2C822CD4ac93B57C
Deploying StateManager...
StateManager deployed at: 0xAF30ca094fA5A4DbE4f505e3dC73f1122d8B419C
Deploying MerkleVerifier...
MerkleVerifier deployed at: 0x4e277dD4Ca1Fff4E414dB447dF66d0ED4DBA907f
Deploying ProofSync...
ProofSync deployed at: 0xE50091c67c0D08D63d149dafa8194c446751e1E2
Deploying Messenger...
Messanger deployed at: 0x8a0963D028e06076f1dAF1b53153bB4906ed6c21
Deploying CrossToken (CCIP)...
CrossToken deployed at: 0x0eAE2d99C7410DAB92499B0BEe415a7bce05E234
Deploying SyncFunction...
SyncFunction deployed at: 0x1def6A63BCa5904244F0e5b841E3fE40206b3273
Deploying Fee...
Fee deployed at: 0x774a742411AEE3F8D780876fB07cB7f5d95A7704
Deploying Reputation...
Reputation deployed at: 0x5963f8017392ee998173bFC32cCd5C0F3b53Da3d
Deploying CarRegistry...
CarRegistry deployed at: 0x14934Ed5cF8C816721fFB0CEEDE8c409bB9d010E
Deploying statecheckfunction....
0x62f8F7cCbe5a6BBB6ea159e0C6242e8df9b8Ce8b
Deploying InitFunction...
InitFunction deployed at: 0x8Fbbe003Eb050c430d3EE849e2F9716d6E6B9f81
Deploying ZeroNFT...
ZeroNFT deployed at: 0x48C306cf6719fE51166690567FfFFCBb948fA33B
Deploying Auction...
Auction deployed at: 0x9f68Ad47FC90b69c3f4418DfC5C7ACddbFf7D5Ab
Setting up post-deployment configurations...
InitFunction set in CarRegistry
Registry set in Profile
Auction set in ZeroNFT
InitFunction ownership transferred to CarRegistry
Granting permissions to: 0xf0830060f836B8d54bF02049E5905F619487989e
All permissions granted to: 0xf0830060f836B8d54bF02049E5905F619487989e
Transferring LINK tokens to CCIP and Messenger...

=== DEPLOYMENT SUMMARY ===
Network: Base
Deployer: 0x4C08D39F511B9d20B3cA9F62959E6c1a3DD50910
PermissionManager: 0xE2d0fC5bc27496109cC2AB7887e5966dC1d5F610
BrandPermissionManager: 0x2fcE9Ee2B4A6196b544fA467cA59102b208F2748
CarOracle: 0x40c917240fF0F4F228f4922e0869F54560D1e095
OracleMaster: 0xE853149E0f4De9Ce641FC0611b8dbf1e3c3750f4
Profile: 0x0A0e884c546e4CBB72eafb4C2C822CD4ac93B57C
StateManager: 0xAF30ca094fA5A4DbE4f505e3dC73f1122d8B419C
InitFunction: 0x8Fbbe003Eb050c430d3EE849e2F9716d6E6B9f81
MerkleVerifier: 0x4e277dD4Ca1Fff4E414dB447dF66d0ED4DBA907f
ProofSync: 0xE50091c67c0D08D63d149dafa8194c446751e1E2
CrossToken (CCIP): 0x0eAE2d99C7410DAB92499B0BEe415a7bce05E234
SyncFunction: 0x1def6A63BCa5904244F0e5b841E3fE40206b3273
Fee: 0x774a742411AEE3F8D780876fB07cB7f5d95A7704
Reputation: 0x5963f8017392ee998173bFC32cCd5C0F3b53Da3d
CarRegistry: 0x14934Ed5cF8C816721fFB0CEEDE8c409bB9d010E
ZeroNFT: 0x48C306cf6719fE51166690567FfFFCBb948fA33B
Auction: 0x9f68Ad47FC90b69c3f4418DfC5C7ACddbFf7D5Ab
StateCheckFunction 0x62f8F7cCbe5a6BBB6ea159e0C6242e8df9b8Ce8b
=== DEPLOYMENT COMPLETE ===

## deployment address cross chain eth

## deployment address cross chain sonic

## deployment address cross chain hedera

## deployment address cross chain avalanche
