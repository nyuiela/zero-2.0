"use client"
import { useState } from "react"
import { AuctionRegistrationForm } from "@/components/auction-registration-form"
import { useAccount } from "wagmi"
import { useAuthStore } from "@/lib/authStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiRequest, toRustCompatibleTimestamp } from "@/lib/utils"
import { useBrandsData } from "@/hooks/useBrandsData"

type AuctionData = {
  brandName: string
  startTime: string
  endTime: string
  initialBid: string
  bidThreshold: string
  bidToken: string
  nftTokenId: string
}

// Local storage keys
const STORAGE_KEYS = {
  USER_AUCTIONS: 'user_auctions'
}

// Helper functions for localStorage
const getLocalStorageData = (key: string) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error parsing localStorage ${key}:`, error)
    return null
  }
}

const setLocalStorageData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error setting localStorage ${key}:`, error)
  }
}

export default function CreateAuctionPage() {
  const { isConnected } = useAccount()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [submittedData, setSubmittedData] = useState<AuctionData | null>(null)
  const { address } = useAccount()
  const router = useRouter()
  const { brands, hostedBrands, activatedBrands, requestedBrands, isLoading: brandsLoading, error, refetch, } = useBrandsData()
  // const [statusFilter, setStatusFilter] = useState<string>('all')
  // const [typeFilter, setTypeFilter] = useState<string>('all')

  // // Filter brands based on selected filters
  // const filteredBrands = brands.filter(brand => {
  //   const matchesStatus = statusFilter === 'all' || brand.status === statusFilter
  //   const matchesType = typeFilter === 'all' || brand.type === typeFilter
  //   return matchesStatus && matchesType
  // })

  // // Filter user's brands (brands where user is the permission holder)
  // const userBrands = brands.filter(brand =>
  //   brand.brandPermission?.toLowerCase() === address?.toLowerCase()
  // )

  // Demo data - in real app, these would come from your smart contract/API
  const availableBrands = ["kal", "BMW", "Mercedes", "Audi", "Tesla", "Ferrari"]
  // const availableBrands = brands

  const handleSubmit = async (data: AuctionData) => {
    setIsLoading(true)

    try {
      // Simulate API call to smart contract
      console.log("Creating auction:", data)

      // Create auction object with additional metadata
      const auctionData = {
        ...data,
        id: Date.now().toString(), // Generate unique ID
        owner: user?.address || 'unknown',
        createdAt: new Date().toISOString(),
        status: 'active',
        currentBid: data.initialBid,
        bids: [],
        title: `${data.brandName} Auction`,
        description: `Auction for ${data.brandName} NFT #${data.nftTokenId}`,
        // Contract data structure
        contractData: {
          brandName: data.brandName,
          startTime: BigInt(data.startTime),
          endTime: BigInt(data.endTime),
          initialBid: BigInt(Math.floor(parseFloat(data.initialBid) * 1e18)), // Convert to wei
          bidThreshold: BigInt(Math.floor(parseFloat(data.bidThreshold) * 1e18)), // Convert to wei
          bidToken: data.bidToken,
          nftTokenId: BigInt(data.nftTokenId),
        }
      }
      const auc = {
        id: 1,
        car_id: auctionData.nftTokenId,
        start_time: toRustCompatibleTimestamp(data.startTime),
        end_time: toRustCompatibleTimestamp(data.endTime),
        current_bid: data.initialBid,
        bid_count: 0,
        seller: "Texan",
        status: "Active",
        created_at: "2025-06-15T18:42:57.530698",
        updated_at: "2025-06-15T18:42:57.530698"
      }
      console.log("Auctions Proxy body ", auc)
      // export interface Auction {
      //   id: number
      //   year: string
      //   make: string
      //   model: string
      //   location: string
      //   image: string
      //   currentBid: string
      //   timeLeft: string
      //   bidCount: number
      //   reserve?: string
      //   country: string
      // }




      console.log("Contract data structure:", auctionData.contractData)

      // Try to save to API first
      let apiSuccess = false
      try {
        const response = await apiRequest('/api/auctions-proxy', {
          method: 'POST',
          body: JSON.stringify(auc)
        })

        if (response.ok) {
          apiSuccess = true
          console.log('Auction saved to API successfully')
        } else {
          console.warn('API save failed, falling back to localStorage')
          console.warn('Response status:', response.status, response.statusText)
        }
      } catch (apiError) {
        console.warn('API request failed, falling back to localStorage:', apiError)
      }

      // Always save to localStorage as backup
      const existingAuctions = getLocalStorageData(STORAGE_KEYS.USER_AUCTIONS) || []
      const updatedAuctions = [...existingAuctions, auctionData]
      setLocalStorageData(STORAGE_KEYS.USER_AUCTIONS, updatedAuctions)

      setSubmittedData(data)

      // Show success message
      toast.success("Auction created successfully!", {
        description: apiSuccess
          ? "Your auction has been created and saved to the server."
          : "Your auction has been created and saved locally.",
        duration: 5000,
      })

      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/profile?tab=auctions')
      }, 2000)

    } catch (error) {
      console.error("Error creating auction:", error)
      toast.error("Failed to create auction", {
        description: "There was an error creating your auction. Please try again.",
        duration: 5000,
      })
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
        // availableBrands={availableBrands}
        // userNFTs={data?.nftminteds || []}
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
              <p className="text-sm text-green-700 mt-4">
                Redirecting to your profile page to view your auctions...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 