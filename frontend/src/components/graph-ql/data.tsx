// /components/Data.tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

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
const url = 'https://api.studio.thegraph.com/query/87766/zero/version/latest'
const headers = { Authorization: 'Bearer 6abc6de0d06cbf79f985314ef9647365' }

export default function Data() {
  // the data is already pre-fetched on the server and immediately available here,
  // without an additional network call
  const { data } = useQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query, {}, headers)
    }
  })
  return <div>{JSON.stringify(data ?? {})}</div>
}