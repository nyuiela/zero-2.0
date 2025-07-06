import {
  ChangedRegistry as ChangedRegistryEvent,
  ProfileCreated as ProfileCreatedEvent,
  UpdatedState as UpdatedStateEvent,
} from "../generated/Profile/Profile"
import {
  ChangedRegistry,
  ProfileCreated,
  UpdatedState,
} from "../generated/schema"

export function handleChangedRegistry(event: ChangedRegistryEvent): void {
  let entity = new ChangedRegistry(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newRegistry = event.params.newRegistry

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProfileCreated(event: ProfileCreatedEvent): void {
  let entity = new ProfileCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._brand = event.params._brand
  entity.initiator = event.params.initiator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatedState(event: UpdatedStateEvent): void {
  let entity = new UpdatedState(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._brand = event.params._brand
  entity.state = event.params.state

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
