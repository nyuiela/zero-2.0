import {
  ContractLockedEvent as ContractLockedEventEvent,
  ContractUnlocked as ContractUnlockedEvent,
  ProofSubmitted as ProofSubmittedEvent,
  ProofSynced as ProofSyncedEvent,
  SyncPermissionGranted as SyncPermissionGrantedEvent,
  SyncPermissionRevoked as SyncPermissionRevokedEvent,
} from "../generated/ProofSync/ProofSync"
import {
  ContractLockedEvent,
  ContractUnlocked,
  ProofSubmitted,
  ProofSynced,
  SyncPermissionGranted,
  SyncPermissionRevoked,
} from "../generated/schema"

export function handleContractLockedEvent(
  event: ContractLockedEventEvent,
): void {
  let entity = new ContractLockedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractUnlocked(event: ContractUnlockedEvent): void {
  let entity = new ContractUnlocked(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProofSubmitted(event: ProofSubmittedEvent): void {
  let entity = new ProofSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.submitter = event.params.submitter
  entity.ipfsHash = event.params.ipfsHash
  entity.method = event.params.method

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProofSynced(event: ProofSyncedEvent): void {
  let entity = new ProofSynced(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.ipfsHash = event.params.ipfsHash
  entity.chains = event.params.chains
  entity.messageIds = event.params.messageIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSyncPermissionGranted(
  event: SyncPermissionGrantedEvent,
): void {
  let entity = new SyncPermissionGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.syncer = event.params.syncer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSyncPermissionRevoked(
  event: SyncPermissionRevokedEvent,
): void {
  let entity = new SyncPermissionRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.syncer = event.params.syncer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
