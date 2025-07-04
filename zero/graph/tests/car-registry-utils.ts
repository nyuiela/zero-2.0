import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/CarRegistry/CarRegistry"

export function createBrandActivatedEvent(
  brand: string,
  state: string
): BrandActivated {
  let brandActivatedEvent = changetype<BrandActivated>(newMockEvent())

  brandActivatedEvent.parameters = new Array()

  brandActivatedEvent.parameters.push(
    new ethereum.EventParam("brand", ethereum.Value.fromString(brand))
  )
  brandActivatedEvent.parameters.push(
    new ethereum.EventParam("state", ethereum.Value.fromString(state))
  )

  return brandActivatedEvent
}

export function createBrandRegistryRequestedEvent(
  brand: string,
  requestId: Bytes
): BrandRegistryRequested {
  let brandRegistryRequestedEvent =
    changetype<BrandRegistryRequested>(newMockEvent())

  brandRegistryRequestedEvent.parameters = new Array()

  brandRegistryRequestedEvent.parameters.push(
    new ethereum.EventParam("brand", ethereum.Value.fromString(brand))
  )
  brandRegistryRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )

  return brandRegistryRequestedEvent
}

export function createBrandStakedEvent(
  brand: string,
  staker: Address
): BrandStaked {
  let brandStakedEvent = changetype<BrandStaked>(newMockEvent())

  brandStakedEvent.parameters = new Array()

  brandStakedEvent.parameters.push(
    new ethereum.EventParam("brand", ethereum.Value.fromString(brand))
  )
  brandStakedEvent.parameters.push(
    new ethereum.EventParam("staker", ethereum.Value.fromAddress(staker))
  )

  return brandStakedEvent
}

export function createChangedCCIPEvent(newp: Address): ChangedCCIP {
  let changedCcipEvent = changetype<ChangedCCIP>(newMockEvent())

  changedCcipEvent.parameters = new Array()

  changedCcipEvent.parameters.push(
    new ethereum.EventParam("newp", ethereum.Value.fromAddress(newp))
  )

  return changedCcipEvent
}

export function createChangedChainFunctionEvent(
  newp: Address
): ChangedChainFunction {
  let changedChainFunctionEvent =
    changetype<ChangedChainFunction>(newMockEvent())

  changedChainFunctionEvent.parameters = new Array()

  changedChainFunctionEvent.parameters.push(
    new ethereum.EventParam("newp", ethereum.Value.fromAddress(newp))
  )

  return changedChainFunctionEvent
}

export function createChangedInitFunctionEvent(
  newp: Address
): ChangedInitFunction {
  let changedInitFunctionEvent = changetype<ChangedInitFunction>(newMockEvent())

  changedInitFunctionEvent.parameters = new Array()

  changedInitFunctionEvent.parameters.push(
    new ethereum.EventParam("newp", ethereum.Value.fromAddress(newp))
  )

  return changedInitFunctionEvent
}

export function createChangedProfileEvent(newp: Address): ChangedProfile {
  let changedProfileEvent = changetype<ChangedProfile>(newMockEvent())

  changedProfileEvent.parameters = new Array()

  changedProfileEvent.parameters.push(
    new ethereum.EventParam("newp", ethereum.Value.fromAddress(newp))
  )

  return changedProfileEvent
}

export function createChangedReputationEvent(newp: Address): ChangedReputation {
  let changedReputationEvent = changetype<ChangedReputation>(newMockEvent())

  changedReputationEvent.parameters = new Array()

  changedReputationEvent.parameters.push(
    new ethereum.EventParam("newp", ethereum.Value.fromAddress(newp))
  )

  return changedReputationEvent
}

export function createChangedStateEvent(newp: Address): ChangedState {
  let changedStateEvent = changetype<ChangedState>(newMockEvent())

  changedStateEvent.parameters = new Array()

  changedStateEvent.parameters.push(
    new ethereum.EventParam("newp", ethereum.Value.fromAddress(newp))
  )

  return changedStateEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
