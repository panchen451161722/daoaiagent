import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { DAOCreated } from "../generated/DAOFactory/DAOFactory"

export function createDAOCreatedEvent(
  daoAddress: Address,
  creator: Address,
  timestamp: BigInt,
  otherContentHash: Bytes
): DAOCreated {
  let daoCreatedEvent = changetype<DAOCreated>(newMockEvent())

  daoCreatedEvent.parameters = new Array()

  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "daoAddress",
      ethereum.Value.fromAddress(daoAddress)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "otherContentHash",
      ethereum.Value.fromFixedBytes(otherContentHash)
    )
  )

  return daoCreatedEvent
}
