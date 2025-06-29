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

Network: Base
Deployer: 0x4C08D39F511B9d20B3cA9F62959E6c1a3DD50910
PermissionManager: 0xEc3E4084C1B6998eDf0f10a1F8400B385B466645
BrandPermissionManager: 0x4e4d6c6DF2AB3FEa8b5721A9ca4Ba87C09D976C1
CarOracle: 0xF997bfF470067f37004E0d6499AA7E3b0be48164
OracleMaster: 0x2727994B0Da19893a80B702defBFb03948779a01
Profile: 0xC2F8dDD9900DfE0AAc075960148C43C5Eb96f8DC
StateManager: 0xDD0A57433412F5aC6b73bB768965e4f4F9b82fa4
InitFunction: 0xe701876FcDCe0F620C5EF2553351a5f927e4A793
MerkleVerifier: 0xb1A748F08DA25678a923733373e0bbd4F692B7cE
ProofSync: 0xE96f9faE5389Ed2f3437dEa499A621AfBC8CA3d4
CrossToken (CCIP): 0x3e59A0088725F2187E1255e87C7B3A34B9436e5e
SyncFunction: 0xfacccB3306e421079b5Ba8f0F803B26032792CCC
Fee: 0xBAC01A35f3310c5797Ae9F0F44d9C6c8F96B77E5
Reputation: 0xF28DD1abdea4339A17E965A3062B8774CFC1A234
CarRegistry: 0x48e56B204B9D8dE76FA8D9930422a77E095322C0
ZeroNFT: 0x77ADb4c548f215CACBddB60E1D2BA345bdE763CF
Auction: 0x4A4ABCE29bA4173f571933Fd27C06cead87A4e4A
StateCheckFunction 0x3795676fa4d28d350296FffF28a4A0955D855d82

## deployment address cross chain eth

## deployment address cross chain sonic

## deployment address cross chain hedera

## deployment address cross chain avalanche
