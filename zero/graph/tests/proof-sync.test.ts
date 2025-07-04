import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { ContractLockedEvent } from "../generated/schema"
import { ContractLockedEvent as ContractLockedEventEvent } from "../generated/ProofSync/ProofSync"
import { handleContractLockedEvent } from "../src/proof-sync"
import { createContractLockedEventEvent } from "./proof-sync-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let reason = "Example string value"
    let newContractLockedEventEvent = createContractLockedEventEvent(reason)
    handleContractLockedEvent(newContractLockedEventEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ContractLockedEvent created and stored", () => {
    assert.entityCount("ContractLockedEvent", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ContractLockedEvent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reason",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
