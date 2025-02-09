import { DAOCreated as DAOCreatedEvent } from "../generated/DAOFactory/DAOFactory"
import { DAOCreated } from "../generated/schema"

export function handleDAOCreated(event: DAOCreatedEvent): void {
  let entity = new DAOCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.daoAddress = event.params.daoAddress
  entity.creator = event.params.creator
  entity.timestamp = event.params.timestamp
  entity.otherContentHash = event.params.otherContentHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
