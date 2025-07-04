import {
  AddedLeaf as AddedLeafEvent,
  ChangedSyncer as ChangedSyncerEvent,
  SetRoot as SetRootEvent,
  leafAdded as leafAddedEvent,
  leafRemoved as leafRemovedEvent,
} from "../generated/MerkleVerifier/MerkleVerifier"
import {
  AddedLeaf,
  ChangedSyncer,
  SetRoot,
  leafAdded,
  leafRemoved,
} from "../generated/schema"

export function handleAddedLeaf(event: AddedLeafEvent): void {
  let entity = new AddedLeaf(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.lastProof = event.params.lastProof
  entity.newLeaf = event.params.newLeaf

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedSyncer(event: ChangedSyncerEvent): void {
  let entity = new ChangedSyncer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.syncer = event.params.syncer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetRoot(event: SetRootEvent): void {
  let entity = new SetRoot(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._brand = event.params._brand
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleleafAdded(event: leafAddedEvent): void {
  let entity = new leafAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.leaf = event.params.leaf

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleleafRemoved(event: leafRemovedEvent): void {
  let entity = new leafRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.leaf = event.params.leaf

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
