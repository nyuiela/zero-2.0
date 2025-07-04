import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AddedLeaf,
  ChangedSyncer,
  SetRoot,
  leafAdded,
  leafRemoved
} from "../generated/MerkleVerifier/MerkleVerifier"

export function createAddedLeafEvent(
  lastProof: string,
  newLeaf: string
): AddedLeaf {
  let addedLeafEvent = changetype<AddedLeaf>(newMockEvent())

  addedLeafEvent.parameters = new Array()

  addedLeafEvent.parameters.push(
    new ethereum.EventParam("lastProof", ethereum.Value.fromString(lastProof))
  )
  addedLeafEvent.parameters.push(
    new ethereum.EventParam("newLeaf", ethereum.Value.fromString(newLeaf))
  )

  return addedLeafEvent
}

export function createChangedSyncerEvent(syncer: Address): ChangedSyncer {
  let changedSyncerEvent = changetype<ChangedSyncer>(newMockEvent())

  changedSyncerEvent.parameters = new Array()

  changedSyncerEvent.parameters.push(
    new ethereum.EventParam("syncer", ethereum.Value.fromAddress(syncer))
  )

  return changedSyncerEvent
}

export function createSetRootEvent(_brand: string, owner: Address): SetRoot {
  let setRootEvent = changetype<SetRoot>(newMockEvent())

  setRootEvent.parameters = new Array()

  setRootEvent.parameters.push(
    new ethereum.EventParam("_brand", ethereum.Value.fromString(_brand))
  )
  setRootEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return setRootEvent
}

export function createleafAddedEvent(leaf: Bytes): leafAdded {
  let leafAddedEvent = changetype<leafAdded>(newMockEvent())

  leafAddedEvent.parameters = new Array()

  leafAddedEvent.parameters.push(
    new ethereum.EventParam("leaf", ethereum.Value.fromFixedBytes(leaf))
  )

  return leafAddedEvent
}

export function createleafRemovedEvent(leaf: Bytes): leafRemoved {
  let leafRemovedEvent = changetype<leafRemoved>(newMockEvent())

  leafRemovedEvent.parameters = new Array()

  leafRemovedEvent.parameters.push(
    new ethereum.EventParam("leaf", ethereum.Value.fromFixedBytes(leaf))
  )

  return leafRemovedEvent
}
