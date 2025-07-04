import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  ChangedRegistry,
  ProfileCreated,
  UpdatedState
} from "../generated/Profile/Profile"

export function createChangedRegistryEvent(
  newRegistry: Address
): ChangedRegistry {
  let changedRegistryEvent = changetype<ChangedRegistry>(newMockEvent())

  changedRegistryEvent.parameters = new Array()

  changedRegistryEvent.parameters.push(
    new ethereum.EventParam(
      "newRegistry",
      ethereum.Value.fromAddress(newRegistry)
    )
  )

  return changedRegistryEvent
}

export function createProfileCreatedEvent(
  _brand: string,
  initiator: Address
): ProfileCreated {
  let profileCreatedEvent = changetype<ProfileCreated>(newMockEvent())

  profileCreatedEvent.parameters = new Array()

  profileCreatedEvent.parameters.push(
    new ethereum.EventParam("_brand", ethereum.Value.fromString(_brand))
  )
  profileCreatedEvent.parameters.push(
    new ethereum.EventParam("initiator", ethereum.Value.fromAddress(initiator))
  )

  return profileCreatedEvent
}

export function createUpdatedStateEvent(
  _brand: string,
  state: string
): UpdatedState {
  let updatedStateEvent = changetype<UpdatedState>(newMockEvent())

  updatedStateEvent.parameters = new Array()

  updatedStateEvent.parameters.push(
    new ethereum.EventParam("_brand", ethereum.Value.fromString(_brand))
  )
  updatedStateEvent.parameters.push(
    new ethereum.EventParam("state", ethereum.Value.fromString(state))
  )

  return updatedStateEvent
}
