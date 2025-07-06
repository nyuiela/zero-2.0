import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AuctionCreated,
  AuctionEnded,
  AuctionInfoUpdated,
  BidPlaced,
  CollateralForfeited,
  CollateralReturned,
  StakesReturned,
  ThresholdReached
} from "../generated/Auction/Auction"

export function createAuctionCreatedEvent(
  auctionId: BigInt,
  brandName: string,
  startTime: BigInt,
  endTime: BigInt,
  initialBid: BigInt,
  bidThreshold: BigInt
): AuctionCreated {
  let auctionCreatedEvent = changetype<AuctionCreated>(newMockEvent())

  auctionCreatedEvent.parameters = new Array()

  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam("brandName", ethereum.Value.fromString(brandName))
  )
  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )
  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "initialBid",
      ethereum.Value.fromUnsignedBigInt(initialBid)
    )
  )
  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "bidThreshold",
      ethereum.Value.fromUnsignedBigInt(bidThreshold)
    )
  )

  return auctionCreatedEvent
}

export function createAuctionEndedEvent(
  auctionId: BigInt,
  winner: Address,
  winningBid: BigInt
): AuctionEnded {
  let auctionEndedEvent = changetype<AuctionEnded>(newMockEvent())

  auctionEndedEvent.parameters = new Array()

  auctionEndedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionEndedEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  auctionEndedEvent.parameters.push(
    new ethereum.EventParam(
      "winningBid",
      ethereum.Value.fromUnsignedBigInt(winningBid)
    )
  )

  return auctionEndedEvent
}

export function createAuctionInfoUpdatedEvent(
  auctionId: BigInt,
  newStartTime: BigInt,
  newEndTime: BigInt,
  newInitialBid: BigInt,
  newBidThreshold: BigInt,
  newBidToken: Address,
  newNftTokenId: BigInt
): AuctionInfoUpdated {
  let auctionInfoUpdatedEvent = changetype<AuctionInfoUpdated>(newMockEvent())

  auctionInfoUpdatedEvent.parameters = new Array()

  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newStartTime",
      ethereum.Value.fromUnsignedBigInt(newStartTime)
    )
  )
  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newEndTime",
      ethereum.Value.fromUnsignedBigInt(newEndTime)
    )
  )
  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newInitialBid",
      ethereum.Value.fromUnsignedBigInt(newInitialBid)
    )
  )
  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newBidThreshold",
      ethereum.Value.fromUnsignedBigInt(newBidThreshold)
    )
  )
  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newBidToken",
      ethereum.Value.fromAddress(newBidToken)
    )
  )
  auctionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newNftTokenId",
      ethereum.Value.fromUnsignedBigInt(newNftTokenId)
    )
  )

  return auctionInfoUpdatedEvent
}

export function createBidPlacedEvent(
  auctionId: BigInt,
  bidder: Address,
  amount: BigInt,
  staked: boolean
): BidPlaced {
  let bidPlacedEvent = changetype<BidPlaced>(newMockEvent())

  bidPlacedEvent.parameters = new Array()

  bidPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam("staked", ethereum.Value.fromBoolean(staked))
  )

  return bidPlacedEvent
}

export function createCollateralForfeitedEvent(
  auctionId: BigInt,
  forfeitedBidder: Address,
  amount: BigInt
): CollateralForfeited {
  let collateralForfeitedEvent = changetype<CollateralForfeited>(newMockEvent())

  collateralForfeitedEvent.parameters = new Array()

  collateralForfeitedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  collateralForfeitedEvent.parameters.push(
    new ethereum.EventParam(
      "forfeitedBidder",
      ethereum.Value.fromAddress(forfeitedBidder)
    )
  )
  collateralForfeitedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return collateralForfeitedEvent
}

export function createCollateralReturnedEvent(
  auctionId: BigInt,
  bidder: Address,
  amount: BigInt
): CollateralReturned {
  let collateralReturnedEvent = changetype<CollateralReturned>(newMockEvent())

  collateralReturnedEvent.parameters = new Array()

  collateralReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  collateralReturnedEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  collateralReturnedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return collateralReturnedEvent
}

export function createStakesReturnedEvent(auctionId: BigInt): StakesReturned {
  let stakesReturnedEvent = changetype<StakesReturned>(newMockEvent())

  stakesReturnedEvent.parameters = new Array()

  stakesReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return stakesReturnedEvent
}

export function createThresholdReachedEvent(
  auctionId: BigInt
): ThresholdReached {
  let thresholdReachedEvent = changetype<ThresholdReached>(newMockEvent())

  thresholdReachedEvent.parameters = new Array()

  thresholdReachedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return thresholdReachedEvent
}
