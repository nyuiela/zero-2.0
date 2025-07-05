"use client"
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useState } from "react";

export interface BrandActivated extends TA {
  id: string,
  state: string,
  brand: string
}

export interface BrandNFTMinteds extends TA {
  id: string,
  tokenId: number,
  brandName: string,
  brandOwner: string,
}
export interface BrandActivated extends TA {
  id: string,
  brand: string,
  state: string
}
export interface BrandRegistryRequested extends TA {
  id: string,
  brand: string,
  requestId: string
}
export interface BidPlaced extends TA {
  id: string,
  auctionId: string,
  bidder: string,
  amount: string,
  staked: string
}
export interface AuctionCreated {
  id: string,
  auctionId: string,
  brandName: string,
  startTime: string,
  endTime: string,
  initialBid: string,
  bidThreshold: number
}
export interface AuctionEnded extends TA {
  id: string,
  auctionId: string,
  winner: string,
  winningBid: string
}
export interface AuctionInfoUpdated extends TA {
  id: string,
  auctionId: number,
  newStartTime: string,
  newEndTime: string,
  newInitialBid: string,
  newBidThreshold: number,
  newBidToken: string,
  newNftTokenId: number
}

export interface Nftminted extends TA {
  id: string,
  tokenId: number,
  to: string,
  brandName: string,
  tokenURI: string
}
export interface ZeroNFTOwnershipTransferred extends TA {
  id: string,
  previousOwner: string,
  newOwner: string
}
export interface TokenLocked extends TA {
  id: string,
  tokenId: number,
  locked: boolean
}
export interface ProofSubmitted extends TA {
  id: number,
  submitter: string,
  ipfsHash: string,
  method: string
}
export interface ProofSynced extends TA {
  id: string,
  ipfsHash: string,
  chains: string,
  messageIds: string,
}
export interface AddedLeaf extends TA {
  id: string,
  lastProof: string,
  newLeaf: string
}


export interface changedSyncer extends TA {
  id: string,
  syncer: string,
}
export interface TA {
  blockNumber: number,
  blockTimestamp: number,
  transactionHash: string
}
export interface leafRemoved {
  id: number,
  leaf: string,
  blockNumber: number,
  blockTimestamp: number,
  transactionHash: string
}
export interface LeafAdded extends TA {
  id: string,
  leaf: string
}
export interface ContractInterface {
  addedLeaves: AddedLeaf[],
  auctionCreateds: AuctionCreated[],
  auctionEndeds: AuctionEnded[],
  auctionInfoUpdateds: AuctionInfoUpdated[],
  bidPlaceds: BidPlaced[],
  brandActivateds: BrandActivated[],
  brandNFTMinteds: BrandNFTMinteds[],
  brandRegistryRequested: BrandRegistryRequested[],
  changedSyncers: changedSyncer[],
  leafAddeds: LeafAdded[],
  nftminteds: Nftminted[],
  proofSubmitteds: ProofSubmitted[],
  proofSynced: ProofSynced[],
  tokenLockeds: TokenLocked[],
  zeroNFTOwnershipTransferreds: ZeroNFTOwnershipTransferred[]
}
// Mock network data
// export const mockNetworks = [
//   { id: 1, name: "Ethereum" },
//   { id: 10, name: "Optimism" },
//   { id: 42161, name: "Arbitrum One" },
//   { id: 8453, name: "Base" },
//   { id: 137, name: "Polygon" },
// ];
export const query = gql`{
  brandActivateds(first: 5) {
    id
    brand
    state
    blockNumber
    blockTimestamp
    transactionHash
  }
  brandRegistryRequesteds(first: 5) {
    id
    brand
    requestId
    blockNumber
    blockTimestamp
    transactionHash
  }
  bidPlaceds(first: 10) {
  id
  auctionId
  bidder
  amount
  staked
  blockNumber
  blockTimestamp
  transactionHash
}
  auctionCreateds(first: 10) {
    id
    auctionId
    brandName
    startTime
    endTime
    initialBid
    bidThreshold
    blockNumber
    blockTimestamp
    transactionHash
  }
  auctionEndeds(first:10) {
    id
    auctionId
    winner
    winningBid
    blockNumber
    blockTimestamp
    transactionHash
  }
  auctionInfoUpdateds(first: 10) {
    id
    auctionId
    newStartTime
    newEndTime
    newInitialBid
    newBidThreshold
    newBidToken
    newNftTokenId
    blockNumber
    blockTimestamp
    transactionHash
  }
  brandNFTMinteds(first: 10) {
    id
    brandName
    tokenId
    brandOwner
    blockNumber
    blockTimestamp
    transactionHash
  }
  nftminteds(first: 10) {
    id
    tokenId
    to
    brandName
    tokenURI
    blockNumber
    blockTimestamp
    transactionHash
  }
  zeroNFTOwnershipTransferreds(first: 10) {
    id
    previousOwner
    newOwner
    blockNumber
    blockTimestamp
    transactionHash
  }
  tokenLockeds(first: 30) {
    id
    tokenId
    locked
    blockNumber
    blockTimestamp
    transactionHash
  }
  proofSubmitteds(first: 30) {
    id
    submitter
    ipfsHash
    method
    blockNumber
    blockTimestamp
    transactionHash
  }
  proofSynceds(first: 10) {
    id
    ipfsHash
    chains
    messageIds
    blockNumber
    blockTimestamp
    transactionHash
  }
  addedLeaves(first: 10) {
    id
    lastProof
    newLeaf
    blockNumber
    blockTimestamp
    transactionHash
  }
  changedSyncers(first: 10) {
    id
    syncer
    blockNumber
    blockTimestamp
    transactionHash
  }
  leafAddeds(first: 10) {
    id
    leaf
    blockNumber
    blockTimestamp
    transactionHash
  }
  leafRemoveds(first: 10) {
    id
    leaf
    blockNumber
    blockTimestamp
    transactionHash
  }

}`
export function useGraph() {
  const url = 'https://api.studio.thegraph.com/query/87766/zero/version/latest'
  const headers = { Authorization: 'Bearer 6abc6de0d06cbf79f985314ef9647365' }

  const { data: r_data } = useQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query, {}, headers)
    }
  })
  const [data, setData] = useState<ContractInterface>(r_data as ContractInterface);
  return { data, setData };
} 