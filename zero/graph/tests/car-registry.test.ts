import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address } from "@graphprotocol/graph-ts"
import { BrandActivated } from "../generated/schema"
import { BrandActivated as BrandActivatedEvent } from "../generated/CarRegistry/CarRegistry"
import { handleBrandActivated } from "../src/car-registry"
import { createBrandActivatedEvent } from "./car-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let brand = "Example string value"
    let state = "Example string value"
    let newBrandActivatedEvent = createBrandActivatedEvent(brand, state)
    handleBrandActivated(newBrandActivatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("BrandActivated created and stored", () => {
    assert.entityCount("BrandActivated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BrandActivated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "brand",
      "Example string value"
    )
    assert.fieldEquals(
      "BrandActivated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "state",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
