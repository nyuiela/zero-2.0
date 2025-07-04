import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AuctionCreated } from "../generated/schema"
import { AuctionCreated as AuctionCreatedEvent } from "../generated/Auction/Auction"
import { handleAuctionCreated } from "../src/auction"
import { createAuctionCreatedEvent } from "./auction-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let auctionId = BigInt.fromI32(234)
    let brandName = "Example string value"
    let startTime = BigInt.fromI32(234)
    let endTime = BigInt.fromI32(234)
    let initialBid = BigInt.fromI32(234)
    let bidThreshold = BigInt.fromI32(234)
    let newAuctionCreatedEvent = createAuctionCreatedEvent(
      auctionId,
      brandName,
      startTime,
      endTime,
      initialBid,
      bidThreshold
    )
    handleAuctionCreated(newAuctionCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AuctionCreated created and stored", () => {
    assert.entityCount("AuctionCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AuctionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "auctionId",
      "234"
    )
    assert.fieldEquals(
      "AuctionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "brandName",
      "Example string value"
    )
    assert.fieldEquals(
      "AuctionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "startTime",
      "234"
    )
    assert.fieldEquals(
      "AuctionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "endTime",
      "234"
    )
    assert.fieldEquals(
      "AuctionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "initialBid",
      "234"
    )
    assert.fieldEquals(
      "AuctionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bidThreshold",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
