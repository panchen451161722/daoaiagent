import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { DAOCreated } from "../generated/schema"
import { DAOCreated as DAOCreatedEvent } from "../generated/DAOFactory/DAOFactory"
import { handleDAOCreated } from "../src/dao-factory"
import { createDAOCreatedEvent } from "./dao-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let daoAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let timestamp = BigInt.fromI32(234)
    let otherContentHash = Bytes.fromI32(1234567890)
    let newDAOCreatedEvent = createDAOCreatedEvent(
      daoAddress,
      creator,
      timestamp,
      otherContentHash
    )
    handleDAOCreated(newDAOCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DAOCreated created and stored", () => {
    assert.entityCount("DAOCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DAOCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "daoAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DAOCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DAOCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )
    assert.fieldEquals(
      "DAOCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "otherContentHash",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
