import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  ContractLockedEvent,
  ContractUnlocked,
  ProofSubmitted,
  ProofSynced,
  SyncPermissionGranted,
  SyncPermissionRevoked
} from "../generated/ProofSync/ProofSync"

export function createContractLockedEventEvent(
  reason: string
): ContractLockedEvent {
  let contractLockedEventEvent = changetype<ContractLockedEvent>(newMockEvent())

  contractLockedEventEvent.parameters = new Array()

  contractLockedEventEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return contractLockedEventEvent
}

export function createContractUnlockedEvent(): ContractUnlocked {
  let contractUnlockedEvent = changetype<ContractUnlocked>(newMockEvent())

  contractUnlockedEvent.parameters = new Array()

  return contractUnlockedEvent
}

export function createProofSubmittedEvent(
  submitter: Address,
  ipfsHash: string,
  method: Bytes
): ProofSubmitted {
  let proofSubmittedEvent = changetype<ProofSubmitted>(newMockEvent())

  proofSubmittedEvent.parameters = new Array()

  proofSubmittedEvent.parameters.push(
    new ethereum.EventParam("submitter", ethereum.Value.fromAddress(submitter))
  )
  proofSubmittedEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )
  proofSubmittedEvent.parameters.push(
    new ethereum.EventParam("method", ethereum.Value.fromFixedBytes(method))
  )

  return proofSubmittedEvent
}

export function createProofSyncedEvent(
  ipfsHash: string,
  chains: Array<BigInt>,
  messageIds: Array<Bytes>
): ProofSynced {
  let proofSyncedEvent = changetype<ProofSynced>(newMockEvent())

  proofSyncedEvent.parameters = new Array()

  proofSyncedEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )
  proofSyncedEvent.parameters.push(
    new ethereum.EventParam(
      "chains",
      ethereum.Value.fromUnsignedBigIntArray(chains)
    )
  )
  proofSyncedEvent.parameters.push(
    new ethereum.EventParam(
      "messageIds",
      ethereum.Value.fromFixedBytesArray(messageIds)
    )
  )

  return proofSyncedEvent
}

export function createSyncPermissionGrantedEvent(
  syncer: Address
): SyncPermissionGranted {
  let syncPermissionGrantedEvent =
    changetype<SyncPermissionGranted>(newMockEvent())

  syncPermissionGrantedEvent.parameters = new Array()

  syncPermissionGrantedEvent.parameters.push(
    new ethereum.EventParam("syncer", ethereum.Value.fromAddress(syncer))
  )

  return syncPermissionGrantedEvent
}

export function createSyncPermissionRevokedEvent(
  syncer: Address
): SyncPermissionRevoked {
  let syncPermissionRevokedEvent =
    changetype<SyncPermissionRevoked>(newMockEvent())

  syncPermissionRevokedEvent.parameters = new Array()

  syncPermissionRevokedEvent.parameters.push(
    new ethereum.EventParam("syncer", ethereum.Value.fromAddress(syncer))
  )

  return syncPermissionRevokedEvent
}
