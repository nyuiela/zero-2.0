### Zero Smart contract Notes and planning
***author** Lydia

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
----------
after the winner has been slected we change the state accross all the chains
updated the proofs etc
anything that has to do with giving new owner owner righ
meaning i need to start the transferrights  in the register contract