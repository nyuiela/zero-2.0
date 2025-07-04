import {
  AuctionCreated as AuctionCreatedEvent,
  AuctionEnded as AuctionEndedEvent,
  AuctionInfoUpdated as AuctionInfoUpdatedEvent,
  BidPlaced as BidPlacedEvent,
  CollateralForfeited as CollateralForfeitedEvent,
  CollateralReturned as CollateralReturnedEvent,
  StakesReturned as StakesReturnedEvent,
  ThresholdReached as ThresholdReachedEvent,
} from "../generated/Auction/Auction"
import {
  AuctionCreated,
  AuctionEnded,
  AuctionInfoUpdated,
  BidPlaced,
  CollateralForfeited,
  CollateralReturned,
  StakesReturned,
  ThresholdReached,
} from "../generated/schema"

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
  let entity = new AuctionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId
  entity.brandName = event.params.brandName
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime
  entity.initialBid = event.params.initialBid
  entity.bidThreshold = event.params.bidThreshold

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionEnded(event: AuctionEndedEvent): void {
  let entity = new AuctionEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId
  entity.winner = event.params.winner
  entity.winningBid = event.params.winningBid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionInfoUpdated(event: AuctionInfoUpdatedEvent): void {
  let entity = new AuctionInfoUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId
  entity.newStartTime = event.params.newStartTime
  entity.newEndTime = event.params.newEndTime
  entity.newInitialBid = event.params.newInitialBid
  entity.newBidThreshold = event.params.newBidThreshold
  entity.newBidToken = event.params.newBidToken
  entity.newNftTokenId = event.params.newNftTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBidPlaced(event: BidPlacedEvent): void {
  let entity = new BidPlaced(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId
  entity.bidder = event.params.bidder
  entity.amount = event.params.amount
  entity.staked = event.params.staked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollateralForfeited(
  event: CollateralForfeitedEvent,
): void {
  let entity = new CollateralForfeited(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId
  entity.forfeitedBidder = event.params.forfeitedBidder
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollateralReturned(event: CollateralReturnedEvent): void {
  let entity = new CollateralReturned(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId
  entity.bidder = event.params.bidder
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStakesReturned(event: StakesReturnedEvent): void {
  let entity = new StakesReturned(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleThresholdReached(event: ThresholdReachedEvent): void {
  let entity = new ThresholdReached(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
