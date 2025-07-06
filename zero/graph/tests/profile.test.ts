import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { ChangedRegistry } from "../generated/schema"
import { ChangedRegistry as ChangedRegistryEvent } from "../generated/Profile/Profile"
import { handleChangedRegistry } from "../src/profile"
import { createChangedRegistryEvent } from "./profile-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newRegistry = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newChangedRegistryEvent = createChangedRegistryEvent(newRegistry)
    handleChangedRegistry(newChangedRegistryEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ChangedRegistry created and stored", () => {
    assert.entityCount("ChangedRegistry", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ChangedRegistry",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newRegistry",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
