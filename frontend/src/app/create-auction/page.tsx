"use client"

import { useState } from "react"
import { AuctionRegistrationForm } from "@/components/auction-registration-form"
import { useAccount } from "wagmi"
import { useAuthStore } from "@/lib/authStore"

type AuctionData = {
  brandName: string
  startTime: string
  endTime: string
  initialBid: string
  bidThreshold: string
  bidToken: string
  nftTokenId: string
}

export default function CreateAuctionPage() {
  const { isConnected } = useAccount()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [submittedData, setSubmittedData] = useState<AuctionData | null>(null)

  // Demo data - in real app, these would come from your smart contract/API
  const availableBrands = ["Toyota", "BMW", "Mercedes", "Audi", "Tesla", "Ferrari"]

  const userNFTs = [
    {
      tokenId: "1",
      brandName: "Toyota",
      isLocked: false
    },
    {
      tokenId: "2",
      brandName: "BMW",
      isLocked: false
    },
    {
      tokenId: "3",
      brandName: "Mercedes",
      isLocked: true // This one is locked, won't show in available NFTs
    }
  ]

  const handleSubmit = async (data: AuctionData) => {
    setIsLoading(true)

    try {
      // Simulate API call to smart contract
      console.log("Creating auction:", data)

      // Here you would typically:
      // 1. Connect to wallet (MetaMask, etc.)
      // 2. Call the smart contract function
      // 3. Wait for transaction confirmation

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSubmittedData(data)

      // Example of how the data would be structured for the smart contract:
      const contractData = {
        brandName: data.brandName,
        startTime: BigInt(data.startTime),
        endTime: BigInt(data.endTime),
        initialBid: BigInt(Math.floor(parseFloat(data.initialBid) * 1e18)), // Convert to wei
        bidThreshold: BigInt(Math.floor(parseFloat(data.bidThreshold) * 1e18)), // Convert to wei
        bidToken: data.bidToken,
        nftTokenId: BigInt(data.nftTokenId),
      }

      console.log("Contract data structure:", contractData)

    } catch (error) {
      console.error("Error creating auction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user is authenticated
  if (!isConnected || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Login Required</h2>
          <p className="text-gray-400">Please connect your wallet and login to create auctions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Auction
          </h1>
          <p className="text-gray-600">
            Register your NFT for auction with custom bidding parameters
          </p>
        </div>

        <AuctionRegistrationForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          availableBrands={availableBrands}
          userNFTs={userNFTs}
        />

        {submittedData && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Auction Created Successfully!
              </h3>
              <div className="bg-white rounded p-4">
                <h4 className="font-medium text-gray-900 mb-2">Auction Details:</h4>
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 