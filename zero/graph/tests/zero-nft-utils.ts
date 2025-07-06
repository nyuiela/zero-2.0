import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BaseURIUpdated,
  BatchMetadataUpdate,
  BatchTransfer,
  BrandNFTMinted,
  MetadataUpdate,
  NFTMinted,
  NFTVerified,
  OwnershipTransferred,
  TokenLocked,
  Transfer,
  TransferCooldownUpdated,
  TransferFeeCollected,
  TransferFeeUpdated
} from "../generated/ZeroNFT/ZeroNFT"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBaseURIUpdatedEvent(newBaseURI: string): BaseURIUpdated {
  let baseUriUpdatedEvent = changetype<BaseURIUpdated>(newMockEvent())

  baseUriUpdatedEvent.parameters = new Array()

  baseUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("newBaseURI", ethereum.Value.fromString(newBaseURI))
  )

  return baseUriUpdatedEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createBatchTransferEvent(
  from: Address,
  to: Address,
  tokenIds: Array<BigInt>
): BatchTransfer {
  let batchTransferEvent = changetype<BatchTransfer>(newMockEvent())

  batchTransferEvent.parameters = new Array()

  batchTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  batchTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  batchTransferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )

  return batchTransferEvent
}

export function createBrandNFTMintedEvent(
  brandName: string,
  tokenId: BigInt,
  brandOwner: Address
): BrandNFTMinted {
  let brandNftMintedEvent = changetype<BrandNFTMinted>(newMockEvent())

  brandNftMintedEvent.parameters = new Array()

  brandNftMintedEvent.parameters.push(
    new ethereum.EventParam("brandName", ethereum.Value.fromString(brandName))
  )
  brandNftMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  brandNftMintedEvent.parameters.push(
    new ethereum.EventParam(
      "brandOwner",
      ethereum.Value.fromAddress(brandOwner)
    )
  )

  return brandNftMintedEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createNFTMintedEvent(
  to: Address,
  tokenId: BigInt,
  brandName: string,
  tokenURI: string
): NFTMinted {
  let nftMintedEvent = changetype<NFTMinted>(newMockEvent())

  nftMintedEvent.parameters = new Array()

  nftMintedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  nftMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftMintedEvent.parameters.push(
    new ethereum.EventParam("brandName", ethereum.Value.fromString(brandName))
  )
  nftMintedEvent.parameters.push(
    new ethereum.EventParam("tokenURI", ethereum.Value.fromString(tokenURI))
  )

  return nftMintedEvent
}

export function createNFTVerifiedEvent(
  tokenId: BigInt,
  verified: boolean
): NFTVerified {
  let nftVerifiedEvent = changetype<NFTVerified>(newMockEvent())

  nftVerifiedEvent.parameters = new Array()

  nftVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftVerifiedEvent.parameters.push(
    new ethereum.EventParam("verified", ethereum.Value.fromBoolean(verified))
  )

  return nftVerifiedEvent
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

export function createTokenLockedEvent(
  tokenId: BigInt,
  locked: boolean
): TokenLocked {
  let tokenLockedEvent = changetype<TokenLocked>(newMockEvent())

  tokenLockedEvent.parameters = new Array()

  tokenLockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenLockedEvent.parameters.push(
    new ethereum.EventParam("locked", ethereum.Value.fromBoolean(locked))
  )

  return tokenLockedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createTransferCooldownUpdatedEvent(
  newCooldown: BigInt
): TransferCooldownUpdated {
  let transferCooldownUpdatedEvent =
    changetype<TransferCooldownUpdated>(newMockEvent())

  transferCooldownUpdatedEvent.parameters = new Array()

  transferCooldownUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCooldown",
      ethereum.Value.fromUnsignedBigInt(newCooldown)
    )
  )

  return transferCooldownUpdatedEvent
}

export function createTransferFeeCollectedEvent(
  tokenId: BigInt,
  feeAmount: BigInt
): TransferFeeCollected {
  let transferFeeCollectedEvent =
    changetype<TransferFeeCollected>(newMockEvent())

  transferFeeCollectedEvent.parameters = new Array()

  transferFeeCollectedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  transferFeeCollectedEvent.parameters.push(
    new ethereum.EventParam(
      "feeAmount",
      ethereum.Value.fromUnsignedBigInt(feeAmount)
    )
  )

  return transferFeeCollectedEvent
}

export function createTransferFeeUpdatedEvent(
  newFee: BigInt
): TransferFeeUpdated {
  let transferFeeUpdatedEvent = changetype<TransferFeeUpdated>(newMockEvent())

  transferFeeUpdatedEvent.parameters = new Array()

  transferFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return transferFeeUpdatedEvent
}
