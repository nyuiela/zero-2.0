import {
  BrandActivated as BrandActivatedEvent,
  BrandRegistryRequested as BrandRegistryRequestedEvent,
  BrandStaked as BrandStakedEvent,
  ChangedCCIP as ChangedCCIPEvent,
  ChangedChainFunction as ChangedChainFunctionEvent,
  ChangedInitFunction as ChangedInitFunctionEvent,
  ChangedProfile as ChangedProfileEvent,
  ChangedReputation as ChangedReputationEvent,
  ChangedState as ChangedStateEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/CarRegistry/CarRegistry"
import {
  BrandActivated,
  BrandRegistryRequested,
  BrandStaked,
  ChangedCCIP,
  ChangedChainFunction,
  ChangedInitFunction,
  ChangedProfile,
  ChangedReputation,
  ChangedState,
  OwnershipTransferred
} from "../generated/schema"

export function handleBrandActivated(event: BrandActivatedEvent): void {
  let entity = new BrandActivated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.brand = event.params.brand
  entity.state = event.params.state

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBrandRegistryRequested(
  event: BrandRegistryRequestedEvent
): void {
  let entity = new BrandRegistryRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.brand = event.params.brand
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBrandStaked(event: BrandStakedEvent): void {
  let entity = new BrandStaked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.brand = event.params.brand
  entity.staker = event.params.staker

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedCCIP(event: ChangedCCIPEvent): void {
  let entity = new ChangedCCIP(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newp = event.params.newp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedChainFunction(
  event: ChangedChainFunctionEvent
): void {
  let entity = new ChangedChainFunction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newp = event.params.newp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedInitFunction(
  event: ChangedInitFunctionEvent
): void {
  let entity = new ChangedInitFunction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newp = event.params.newp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedProfile(event: ChangedProfileEvent): void {
  let entity = new ChangedProfile(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newp = event.params.newp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedReputation(event: ChangedReputationEvent): void {
  let entity = new ChangedReputation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newp = event.params.newp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedState(event: ChangedStateEvent): void {
  let entity = new ChangedState(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newp = event.params.newp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
