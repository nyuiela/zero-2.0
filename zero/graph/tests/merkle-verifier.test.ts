import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { AddedLeaf } from "../generated/schema"
import { AddedLeaf as AddedLeafEvent } from "../generated/MerkleVerifier/MerkleVerifier"
import { handleAddedLeaf } from "../src/merkle-verifier"
import { createAddedLeafEvent } from "./merkle-verifier-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let lastProof = "Example string value"
    let newLeaf = "Example string value"
    let newAddedLeafEvent = createAddedLeafEvent(lastProof, newLeaf)
    handleAddedLeaf(newAddedLeafEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AddedLeaf created and stored", () => {
    assert.entityCount("AddedLeaf", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddedLeaf",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "lastProof",
      "Example string value"
    )
    assert.fieldEquals(
      "AddedLeaf",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newLeaf",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
