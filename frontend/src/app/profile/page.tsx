'use client'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Wallet,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Star,
  Car,
  Loader2,
  Gavel
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { zero_abi, zero_addr } from '@/lib/abi/abi'
import ProfileBanner from '@/components/profile-banner'
import { useGraph } from "@/hooks/useGraph"
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import ProgressTracker from '@/components/modal/progress-tracker'
import { parseEther } from 'viem'
import { registry_abi, registry_addr } from '@/lib/abi/abi'
import { useWaitForTransactionReceipt } from 'wagmi'
import { apiRequest } from '@/lib/utils'

// Cookie keys for persistence
const COOKIE_KEYS = {
  PROFILE_NFT: 'profile_nft',
  GRAPH_DATA: 'graph_data',
  LAST_FETCH: 'last_fetch',
  USER_AUCTIONS: 'user_auctions'
}

// Local storage keys
const STORAGE_KEYS = {
  USER_AUCTIONS: 'user_auctions'
}

// Helper functions for cookie management
const getCookieData = (key: string) => {
  try {
    const data = Cookies.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error parsing cookie ${key}:`, error)
    return null
  }
}

const setCookieData = (key: string, data: any, expires = 7) => {
  try {
    Cookies.set(key, JSON.stringify(data), { expires })
  } catch (error) {
    console.error(`Error setting cookie ${key}:`, error)
  }
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

// Enhanced error parsing function
const parseError = (error: any): string => {
  console.log('=== PARSING ERROR ===')
  console.log('Error object:', error)
  console.log('Error type:', typeof error)
  console.log('Error constructor:', error?.constructor?.name)
  console.log('Error message:', error?.message)
  console.log('Error name:', error?.name)
  console.log('Error cause:', error?.cause)
  console.log('Error details:', error?.details)
  console.log('Error reason:', error?.reason)
  console.log('Error code:', error?.code)
  console.log('Error data:', error?.data)
  console.log('====================')

  if (error?.message?.includes("execution reverted")) {
    // Try to extract revert reason
    const revertReason = error.message.match(/reason: (.+)/)?.[1] ||
      error.message.match(/reverted: (.+)/)?.[1] ||
      error.message.match(/reverted with reason: (.+)/)?.[1] ||
      error.message.match(/execution reverted: (.+)/)?.[1]

    if (revertReason) {
      return `Transaction failed: ${revertReason}`
    }

    // Check for common revert patterns
    if (error.message.includes("Brand already exists")) {
      return "Brand name already exists. Please choose a different name."
    }
    if (error.message.includes("Invalid admin address")) {
      return "Invalid brand admin address. Please check the address format."
    }
    if (error.message.includes("Insufficient stake")) {
      return "Insufficient stake amount. Please increase the stake value."
    }
    if (error.message.includes("Invalid subscription")) {
      return "Invalid subscription ID. Please verify the Chainlink VRF subscription."
    }

    return "Transaction failed: Contract execution reverted"
  }

  if (error?.message?.includes("insufficient funds")) {
    return "Insufficient ETH for gas fees. Please add more ETH to your wallet."
  }

  if (error?.message?.includes("user rejected")) {
    return "Transaction was cancelled by user"
  }

  if (error?.message?.includes("nonce too low")) {
    return "Transaction nonce error. Please try again."
  }

  if (error?.message?.includes("gas required exceeds allowance")) {
    return "Gas limit too low. Please try with higher gas limit."
  }

  // Handle wagmi specific errors
  if (error?.name === "ContractFunctionExecutionError") {
    return `Contract error: ${error.message}`
  }

  if (error?.name === "UserRejectedRequestError") {
    return "Transaction was rejected by user"
  }

  if (error?.name === "SwitchChainError") {
    return "Network switch error. Please switch to Base Sepolia network."
  }

  if (error?.name === "ConnectorNotFoundError") {
    return "Wallet not connected. Please connect your wallet first."
  }

  return `Transaction failed: ${error?.message || 'Unknown error'}`
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')

  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['profile', 'activity', 'nfts', 'auctions'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  // All users are now sellers by default
  const isSeller = true
  const router = useRouter()

  // Simplified state management - rely on AuthInitializer for auth state
  const [profileNft, setProfileNft] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<any>(null)
  const [isLoadingGraph, setIsLoadingGraph] = useState(false)
  const [isLoadingNFT, setIsLoadingNFT] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [userAuctions, setUserAuctions] = useState<any[]>([])

  // Auction creation verification states
  const [showAuctionVerification, setShowAuctionVerification] = useState(false)
  const [auctionVerificationStep, setAuctionVerificationStep] = useState(0)
  const [auctionVerificationError, setAuctionVerificationError] = useState<string | null>(null)
  const [userNFTs, setUserNFTs] = useState<CarNFT[]>([])
  const [isBrandSeller, setIsBrandSeller] = useState(false)
  const [auctionVerificationHash, setAuctionVerificationHash] = useState<string | null>(null)

  // Separate writeContract for auction verification
  const {
    data: auctionVerificationModalHash,
    isPending: isAuctionVerificationPending,
    writeContract: writeAuctionVerificationContract,
    error: auctionVerificationContractError,
    isError: isAuctionVerificationError
  } = useWriteContract()

  // Graph data from hook
  const { data: graphHookData } = useGraph()

  // Initialize data from cookies on mount
  useEffect(() => {
    const initializeData = () => {
      // Load profile NFT from cookies
      const cookieNFT = getCookieData(COOKIE_KEYS.PROFILE_NFT)
      if (cookieNFT) {
        setProfileNft(cookieNFT)
      }

      // Load graph data from cookies
      const cookieGraph = getCookieData(COOKIE_KEYS.GRAPH_DATA)
      if (cookieGraph) {
        setGraphData(cookieGraph)
      }

      // Load last fetch time
      const cookieLastFetch = getCookieData(COOKIE_KEYS.LAST_FETCH)
      if (cookieLastFetch) {
        setLastFetchTime(cookieLastFetch)
      }

      // Load user auctions from localStorage
      const localAuctions = getLocalStorageData(STORAGE_KEYS.USER_AUCTIONS)
      if (localAuctions) {
        setUserAuctions(localAuctions)
      }
    }

    initializeData()
  }, [])

  // Update graph data when hook data changes
  useEffect(() => {
    if (graphHookData) {
      setGraphData(graphHookData)
      setCookieData(COOKIE_KEYS.GRAPH_DATA, graphHookData)
      setLastFetchTime(Date.now())
      setCookieData(COOKIE_KEYS.LAST_FETCH, Date.now())
    }
  }, [graphHookData])

  // Fetch NFT data with caching
  const fetchNFTData = async () => {
    // Check if we have cached NFT data
    const cachedNFT = getCookieData(COOKIE_KEYS.PROFILE_NFT)
    if (cachedNFT) {
      setProfileNft(cachedNFT)
      return
    }

    // Fetch new NFT data if not cached
    setIsLoadingNFT(true)
    try {
      const response = await fetch('/api/request-nft')
      const data = await response.json()
      
      if (data.image) {
        setProfileNft(data.image)
        // Cache the NFT data
        setCookieData(COOKIE_KEYS.PROFILE_NFT, data.image)
      }
    } catch (error) {
      console.error('Error fetching NFT:', error)
      setProfileNft(null)
    } finally {
      setIsLoadingNFT(false)
    }
  }

  // Fetch user NFTs for auction verification
  const fetchUserNFTs = async () => {
    if (!address) return []
    
    try {
      // This would be replaced with actual smart contract calls
      const mockNFTs = [
        {
          tokenId: "1",
          brandName: "Ferrari",
          model: "488 GTB",
          year: 2019,
          color: "Rosso Corsa",
          engineSize: "3.9L V8 Twin-Turbo",
          transmission: "7-Speed Automatic",
          mileage: 8200,
          vin: "ZFF79ALA4J0234001",
          condition: "excellent",
          isVerified: true,
          isLocked: false,
          isInAuction: false,
          imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          mintTimestamp: Date.now() - 86400000,
          owner: address
        }
      ]
      
      setUserNFTs(mockNFTs)
      return mockNFTs
    } catch (error) {
      console.error('Error fetching user NFTs:', error)
      return []
    }
  }

  // Check if user is brand seller
  const checkBrandSellerStatus = async () => {
    if (!address) return false
    
    try {
      // This would be replaced with actual smart contract call
      // For now, return false as mock
      const isSeller = false
      setIsBrandSeller(isSeller)
      return isSeller
    } catch (error) {
      console.error('Error checking brand seller status:', error)
      return false
    }
  }

  // Check if user has already staked
  const checkUserStakeStatus = async () => {
    if (!address) return false
    
    try {
      // This would be replaced with actual smart contract call
      // For now, return false as mock (user hasn't staked)
      const hasStaked = false
      return hasStaked
    } catch (error) {
      console.error('Error checking stake status:', error)
      return false
    }
  }

  // Handle stake transaction for auction verification
  const handleAuctionStake = async () => {
    if (!address) return false
    
    try {
      // Check if user already staked
      const hasStaked = await checkUserStakeStatus()
      if (hasStaked) {
        console.log('User already staked, skipping stake transaction')
        return true
      }

      // User hasn't staked, proceed with stake transaction
      writeAuctionVerificationContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'stake',
        args: [user?.username || 'auction_user'],
        value: parseEther("0.0000005"),
        account: address
      })
      return true
    } catch (error) {
      console.error('Stake error:', error)
      setAuctionVerificationError(parseError(error))
      return false
    }
  }

  // Auction verification steps
  const auctionVerificationSteps = [
    {
      name: "NFT Verification",
      description: "Checking if you have car NFTs available for auction",
      action: async () => {
        const nfts = await fetchUserNFTs()
        return nfts.length > 0
      }
    },
    {
      name: "Brand Seller Check",
      description: "Verifying if you are designated as a brand seller",
      action: async () => {
        const isSeller = await checkBrandSellerStatus()
        return isSeller
      }
    },
    {
      name: "Stake Requirement",
      description: "Staking required amount to create auctions",
      action: async () => {
        return await handleAuctionStake()
      }
    }
  ]

  // Handle auction creation verification
  const handleCreateAuction = async () => {
    setShowAuctionVerification(true)
    setAuctionVerificationStep(0)
    setAuctionVerificationError(null)
    
    // Start verification process
    await verifyAuctionCreation()
  }

  const verifyAuctionCreation = async () => {
    try {
      // Step 1: Check NFTs
      const hasNFTs = await auctionVerificationSteps[0].action()
      if (hasNFTs) {
        setAuctionVerificationStep(2) // Skip to stake step
        return
      }

      // Step 2: Check brand seller status
      const isBrandSeller = await auctionVerificationSteps[1].action()
      if (isBrandSeller) {
        setAuctionVerificationStep(2) // Move to stake step
        return
      }

      // If neither step 1 nor 2 passed, show error
      setAuctionVerificationError("You need either car NFTs or brand seller designation to create auctions")
      setShowAuctionVerification(false)
    } catch (error) {
      setAuctionVerificationError("Verification failed. Please try again.")
      setShowAuctionVerification(false)
    }
  }

  // Handle stake completion
  const handleStakeComplete = () => {
    setShowAuctionVerification(false)
    router.push("/create-auction")
  }

  // Handle stake transaction completion
  const handleStakeTransactionComplete = () => {
    // This will be called when stake transaction is confirmed
    setShowAuctionVerification(false)
    router.push("/create-auction")
  }

  // Initial data fetching
  useEffect(() => {
    if (isConnected && address) {
      fetchNFTData()
      fetchUserNFTs()
      checkBrandSellerStatus()
    }
  }, [isConnected, address])

  // Handle auction verification errors
  useEffect(() => {
    if (isAuctionVerificationError && auctionVerificationContractError) {
      const errorMessage = parseError(auctionVerificationContractError)
      setAuctionVerificationError(errorMessage)
    }
  }, [isAuctionVerificationError, auctionVerificationContractError])

  // Handle auction stake transaction confirmation
  const { isLoading: isAuctionStakeConfirming, isSuccess: isAuctionStakeConfirmed } =
    useWaitForTransactionReceipt({
      confirmations: 3,
      hash: auctionVerificationModalHash,
    })

  useEffect(() => {
    if (isAuctionStakeConfirmed) {
      // Stake transaction confirmed, complete verification
      toast.success("Stake transaction confirmed!", {
        description: "You can now create auctions.",
        duration: 5000,
      })
      setShowAuctionVerification(false)
      router.push("/create-auction")
    }
  }, [isAuctionStakeConfirmed, router])

  // Debug logging
  useEffect(() => {
    console.log('Profile Page Debug:', {
      isConnected,
      address,
      user,
      hasUser: !!user,
      graphData,
      graphHookData,
      profileNft,
      userNFTs,
      isBrandSeller
    })
  }, [isConnected, address, user, graphData, graphHookData, profileNft, userNFTs, isBrandSeller])

  // Show loading if wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Login to view profile</h2>
          <p className="text-gray-400">Please login  to access your profile.</p>
        </div>
      </div>
    )
  }

  // Use auth store user data (restored by AuthInitializer from cookies)
  const displayAddress = user?.address || address
  const displayUsername = user?.username || 'Not set'
  const isVerified = user?.verified || false

  const handleSubmit = async (data: any) => {
    // Your smart contract integration here
    const contractData = {
      brandName: data.brandName,
      startTime: BigInt(data.startTime),
      endTime: BigInt(data.endTime),
      initialBid: BigInt(Math.floor(parseFloat(data.initialBid) * 1e18)),
      bidThreshold: BigInt(Math.floor(parseFloat(data.bidThreshold) * 1e18)),
      bidToken: data.bidToken,
      nftTokenId: BigInt(data.nftTokenId),
    }
  }

  return (
    <>
      {/* Auction Verification Modal */}
      <ProgressTracker 
        steps={["NFT Check", "Verified Brand Seller", "Stake"]} 
        open={showAuctionVerification} 
        onOpenChange={setShowAuctionVerification} 
        error={auctionVerificationError} 
        modalHash={auctionVerificationModalHash} 
        title="Auction Creation Verification" 
        description="Complete verification steps to create auctions."
        handleSubmit={[verifyAuctionCreation, verifyAuctionCreation, handleAuctionStake]} 
        step={auctionVerificationStep} 
        isLoading={isAuctionVerificationPending} 
        button={["Verify", "Check", "Stake"]} 
        message={[
          {
            header: 'Step 1: NFT Verification',
            body: 'Checking if you have car NFTs available for auction'
          },
          {
            header: 'Step 2: Brand Seller Check',
            body: 'Verifying if you are designated as a brand seller'
          },
          {
            header: 'Step 3: Stake Requirement',
            body: 'Staking required amount to create auctions'
          }
        ]} 
      />

    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="w-full flex justify-center mb-6">
          <ProfileBanner image={profileNft} height="h-32" />
            {isLoadingNFT && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            )}
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
              <p className="text-muted-foreground">Manage your account and create auctions</p>
              {/* Seller Actions Section */}
            <div className="mt-4">
                <Badge className="bg-green-100 text-green-800 mr-2">Seller</Badge>
                <Button
                  className='rounded-[5px] border-none shadow-none bg-blue-900 hover:bg-blue-800 text-white font-bold cursor-pointer'
                  onClick={handleCreateAuction}>
                  Create Auction
                </Button>
              </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto w-full sm:overflow-x-visible">
                <TabsList className="flex min-w-[320px] w-max gap-2 sm:grid sm:w-full sm:grid-cols-4 sm:min-w-0 bg-gray-200">
                <TabsTrigger value="profile" className="text-black whitespace-nowrap sm:whitespace-normal">Profile</TabsTrigger>
                <TabsTrigger value="activity" className="text-black whitespace-nowrap sm:whitespace-normal">Activity</TabsTrigger>
                <TabsTrigger value="nfts" className="text-black whitespace-nowrap sm:whitespace-normal">My NFTs</TabsTrigger>
                  <TabsTrigger value="auctions" className="text-black whitespace-nowrap sm:whitespace-normal">My Auctions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                      <p className="text-foreground font-mono bg-muted px-3 py-2 rounded mt-1 text-sm break-all">
                        {displayAddress}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1 break-words">
                        {displayUsername}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {isVerified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                          </>
                        ) : user ? (
                          <>
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-gray-500" />
                            <Badge className="bg-gray-100 text-gray-800">Not Logged In</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security & Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security & Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Authentication Method</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1 break-words">
                        Wallet Signature + Zero-Knowledge Proof
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1 break-words">
                        {new Date().toLocaleString()}
                      </p>
                    </div>

                      {/* Graph Data Status */}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Data Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          {isLoadingGraph || isLoadingNFT ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              <Badge className="bg-blue-100 text-blue-800">Loading Data...</Badge>
                            </>
                          ) : graphData || profileNft ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <Badge className="bg-green-100 text-green-800">Data Available</Badge>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              <Badge className="bg-yellow-100 text-yellow-800">No Data Found</Badge>
                            </>
                          )}
                        </div>
                        {!graphData && !profileNft && !isLoadingGraph && !isLoadingNFT && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Data will display as soon as it's available
                          </p>
                        )}
                      </div>

                    {!isVerified && user && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Verification in Progress</span>
                        </div>
                        <p className="text-sm text-yellow-700 break-words">
                          Your identity verification is being processed. This usually takes 2-5 minutes.
                        </p>
                      </div>
                    )}

                    {!user && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Complete Your Login</span>
                        </div>
                        <p className="text-sm text-blue-700 break-words">
                          You&apos;re connected with your wallet but haven&apos;t completed the login process.
                          Click the Login button in the header to complete your account setup.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity to display</p>
                      <p className="text-sm">Your bidding and auction activity will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NFT Collection Tab */}
            <TabsContent value="nfts" className="mt-6">
                <Card className='border-none shadow-none bg-white'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    My Car NFTs
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Your collection of car NFTs from the blockchain
                  </p>
                </CardHeader>
                  <CardContent className='bg-white'>
                  <CarNFTCollection address={address} />
                </CardContent>
              </Card>
            </TabsContent>

              {/* Auctions Tab */}
              <TabsContent value="auctions" className="mt-6">
                <Card className='border-none shadow-none bg-white'>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="h-5 w-5" />
                      My Auctions
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Auctions you have created
                    </p>
                  </CardHeader>
                  <CardContent className='bg-white'>
                    <UserAuctions address={address} userAuctions={userAuctions} setUserAuctions={setUserAuctions} />
                  </CardContent>
                </Card>
              </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
    </>
  )
}

// Car NFT Collection Component
function CarNFTCollection({ address }: { address: string | undefined }) {
  const [nfts, setNfts] = useState<CarNFT[]>([])
  const [loading, setLoading] = useState(true)
  const { address: owner } = useAccount()
  const [error, setError] = useState<string | null>(null)
  const cResponse = useReadContract({
    abi: zero_abi,
    address: zero_addr,
    functionName: "totalSupply",
    args: [],
    account: owner
  })
  console.log("C response ", cResponse)

  useEffect(() => {
    if (!address) {
      setLoading(false)
      return
    }

    fetchUserNFTs(address)
  }, [address])

  const fetchUserNFTs = async (userAddress: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch NFTs from smart contract
      const userNFTs = await getUserNFTs(userAddress)
      setNfts(userNFTs)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('Failed to load NFTs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-muted-foreground">Loading NFTs...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-2">Error loading NFTs</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button
          onClick={() => fetchUserNFTs(address!)}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-muted-foreground mb-2">No NFTs found</p>
        <p className="text-sm text-muted-foreground">
          You don&apos;t own any car NFTs yet. Start by registering a brand or participating in auctions.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <CarNFTCard key={nft.tokenId} nft={nft} />
      ))}
    </div>
  )
}

// Individual Car NFT Card Component
function CarNFTCard({ nft }: { nft: CarNFT }) {
  const [imageError, setImageError] = useState(false)
  const [isLocked, setIsLocked] = useState(nft.isLocked)

  const handleLockToggle = async () => {
    try {
      // Call smart contract to toggle lock status
      await toggleNFTLock(nft.tokenId)
      setIsLocked(!isLocked)
      toast.success(`NFT ${isLocked ? 'unlocked' : 'locked'} successfully`)
    } catch (error) {
      console.error('Error toggling lock:', error)
      toast.error('Failed to toggle lock status')
    }
  }

  return (
    <div className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none h-fit bg-gray-200/40 rounded-sm">
      {/* NFT Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100">
        {nft.imageUrl && !imageError ? (
          <img
            src={nft.imageUrl}
            alt={`${nft.brandName} ${nft.model}`}
            className="w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Car className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Lock Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={isLocked ? "destructive" : "secondary"}
            className="text-xs"
          >
            {isLocked ? "Locked" : "Available"}
          </Badge>
        </div>

        {/* Token ID Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="text-xs bg-white/90">
            #{nft.tokenId}
          </Badge>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Brand and Model */}
          {/* Additional Info */}
          <div className="text-xs text-muted-foreground border-none m-0 border-t flex p-0 justify-between">
            <p className="break-words">Minted: {new Date(nft.mintTimestamp).toLocaleDateString()}</p>
            <p className="break-all">Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-foreground break-words">
              {nft.brandName} {nft.model}
            </h3>
            <p className="text-sm text-muted-foreground break-words">
              {nft.year} • {nft.color}
            </p>
          </div>

          {/* Specifications */}
          {/* <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Engine:</span>
              <p className="font-medium">{nft.engineSize}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Transmission:</span>
              <p className="font-medium">{nft.transmission}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mileage:</span>
              <p className="font-medium">{nft.mileage.toLocaleString()} mi</p>
            </div>
            <div>
              <span className="text-muted-foreground">VIN:</span>
              <p className="font-mono text-xs font-medium truncate" title={nft.vin}>
                {nft.vin}
              </p>
            </div>
          </div> */}

          {/* Condition and Verification */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={nft.condition === 'excellent' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {nft.condition.charAt(0).toUpperCase() + nft.condition.slice(1)}
              </Badge>
              {nft.isVerified && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div> */}
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLockToggle}
              disabled={nft.isInAuction}
              className="flex-1 hover:bg-[#00296b]"
            >
              {isLocked ? "Unlock" : "Lock"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLocked || nft.isInAuction}
              className="flex-1 hover:bg-[#00296b]"
            >
              {nft.isInAuction ? "In Auction" : "Create Auction"}
            </Button>
          </div>



        </div>
      </div>
    </div >
  )
}

// Types for Car NFT
interface CarNFT {
  tokenId: string
  brandName: string
  model: string
  year: number
  color: string
  engineSize: string
  transmission: string
  mileage: number
  vin: string
  condition: string
  isVerified: boolean
  isLocked: boolean
  isInAuction: boolean
  imageUrl?: string
  mintTimestamp: number
  owner: string
}

// Mock function to fetch NFTs from smart contract
async function getUserNFTs(address: string): Promise<CarNFT[]> {
  // This would be replaced with actual smart contract calls
  // For now, returning mock data
  return [
    {
      tokenId: "1",
      brandName: "Ferrari",
      model: "488 GTB",
      year: 2019,
      color: "Rosso Corsa",
      engineSize: "3.9L V8 Twin-Turbo",
      transmission: "7-Speed Automatic",
      mileage: 8200,
      vin: "ZFF79ALA4J0234001",
      condition: "excellent",
      isVerified: true,
      isLocked: false,
      isInAuction: false,
      imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      mintTimestamp: Date.now() - 86400000, // 1 day ago
      owner: address
    },
    {
      tokenId: "2",
      brandName: "Tesla",
      model: "Model S Plaid",
      year: 2022,
      color: "Pearl White",
      engineSize: "Tri-Motor Electric",
      transmission: "Single-Speed",
      mileage: 15000,
      vin: "5YJS1E47LF1234567",
      condition: "excellent",
      isVerified: true,
      isLocked: true,
      isInAuction: true,
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      mintTimestamp: Date.now() - 172800000, // 2 days ago
      owner: address
    }
  ]
}

// Mock function to toggle NFT lock status
async function toggleNFTLock(tokenId: string): Promise<void> {
  // This would be replaced with actual smart contract call
  console.log(`Toggling lock for NFT ${tokenId}`)
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
}

// User Auctions Component
function UserAuctions({ address, userAuctions, setUserAuctions }: { 
  address: string | undefined, 
  userAuctions: any[], 
  setUserAuctions: (auctions: any[]) => void 
}) {
  const [loading, setLoading] = useState(false)

  const fetchUserAuctions = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      // Try API first
      const response = await apiRequest('/api/auctions-proxy', {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json()
        // Filter auctions by owner
        const userAuctions = data.filter((auction: any) => auction.owner === address)
        setUserAuctions(userAuctions)
        setLocalStorageData(STORAGE_KEYS.USER_AUCTIONS, userAuctions)
      } else {
        // Fallback to localStorage
        const localAuctions = getLocalStorageData(STORAGE_KEYS.USER_AUCTIONS) || []
        setUserAuctions(localAuctions)
      }
    } catch (error) {
      console.error('Error fetching auctions:', error)
      // Fallback to localStorage
      const localAuctions = getLocalStorageData(STORAGE_KEYS.USER_AUCTIONS) || []
      setUserAuctions(localAuctions)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserAuctions()
  }, [address])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-muted-foreground">Loading auctions...</span>
      </div>
    )
  }

  if (userAuctions.length === 0) {
    return (
      <div className="text-center py-8">
        <Gavel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-muted-foreground mb-2">No auctions found</p>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t created any auctions yet. Start by creating your first auction.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userAuctions.map((auction, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{auction.title || `Auction ${index + 1}`}</h3>
              <p className="text-sm text-muted-foreground">
                {auction.description || 'No description available'}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Brand: {auction.brandName}</p>
                <p>Initial Bid: {auction.initialBid} {auction.bidToken}</p>
                <p>Created: {new Date(auction.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
              {auction.status || 'Unknown'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
} 