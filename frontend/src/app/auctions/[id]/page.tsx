"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAccount } from "wagmi"
import { useQuery } from '@tanstack/react-query'
import { fetchCarById, fetchCars } from '@/lib/api/car'
import { getJwtToken } from '@/lib/utils'
import { CarAuctioned, CarListing, listings as mockListings } from '@/lib/data'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { Clock, Users, Eye, TrendingUp, Award, Timer, DollarSign, User, MapPin, CheckCircle, MessageSquare, AlertTriangle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import Image from "next/image"
import { fetchAuctionById, fetchAuctionedCars } from "@/lib/api/auction"

interface Bid {
  auctionId: string
  address: string
  amount: number
  timestamp: number
  rank: number
}

function formatCurrency(amount: number | string, currency: 'ETH' | 'USDC' = 'ETH') {
  if (typeof amount === 'string') {
    // Extract numeric value from strings like "€701,500" or "US$81,000"
    const numericValue = parseFloat(amount.replace(/[^\d.]/g, ''))
    return currency === 'ETH'
      ? `${numericValue} ETH`
      : `${numericValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
  }
  return currency === 'ETH'
    ? `${amount} ETH`
    : `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
}

export default function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { address, isConnected } = useAccount()
  const [auctionId, setAuctionId] = useState<string>('')
  const [bids, setBids] = useState<Bid[]>([
    {
      auctionId: auctionId,
      address: "0x1234...5678",
      amount: 45000,
      timestamp: Date.now() - 3600000, // 1 hour ago
      rank: 1
    },
    {
      auctionId: auctionId,
      address: "0x8765...4321", 
      amount: 44000,
      timestamp: Date.now() - 7200000, // 2 hours ago
      rank: 2
    },
    {
      auctionId: auctionId,
      address: "0xabcd...efgh",
      amount: 43000,
      timestamp: Date.now() - 10800000, // 3 hours ago
      rank: 3
    }
  ])
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickBids, setQuickBids] = useState<number[]>([])
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const [timer, setTimer] = useState(60)
  const [lastBidTimestamp, setLastBidTimestamp] = useState<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Swap functionality state
  const [showSwapForm, setShowSwapForm] = useState(false)
  const [swapAmount, setSwapAmount] = useState('')
  const [borrowPercentage, setBorrowPercentage] = useState([0])
  const [isSwapSubmitting, setIsSwapSubmitting] = useState(false)
  const [userBalance, setUserBalance] = useState({ ETH: 0, USDC: 0 }) // Mock balance - in real app, fetch from wallet

  // Mock function to check if user has enough balance
  const hasEnoughBalance = (amount: number, currency: 'ETH' | 'USDC') => {
    return userBalance[currency] >= amount
  }

  // Calculate required amount (bid + stake)
  const getRequiredAmount = (bidAmount: string) => {
    const bid = parseFloat(bidAmount) || 0
    const stake = bid * 0.05
    return bid + stake
  }

  // Check if user needs to swap
  const needsSwap = (bidAmount: string, currency: 'ETH' | 'USDC') => {
    const required = getRequiredAmount(bidAmount)
    return !hasEnoughBalance(required, currency)
  }

  // Handle swap form submission
  const handleSwapSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!swapAmount || parseFloat(swapAmount) <= 0) {
      toast.error('Please enter a valid amount to swap')
      return
    }

    setIsSwapSubmitting(true)
    try {
      // Mock swap logic - in real app, this would call the swap contract
      const amount = parseFloat(swapAmount)
      const percentage = borrowPercentage[0]
      
      if (percentage > 0) {
        // Borrowing swap with percentage increase
        const borrowedAmount = amount * (1 + percentage / 100)
        toast.success(`Swap successful! You received ${formatCurrency(borrowedAmount, currency)} (${percentage}% borrowed)`)
        toast.info(`You will need to pay back ${formatCurrency(amount * (percentage / 100), currency)} later`)
      } else {
        // Direct swap
        toast.success(`Swap successful! You received ${formatCurrency(amount, currency)}`)
      }
      
      setShowSwapForm(false)
      setSwapAmount('')
      setBorrowPercentage([0])
    } catch (error) {
      toast.error('Swap failed. Please try again.')
    } finally {
      setIsSwapSubmitting(false)
    }
  }

  // Handle direct swap (using existing swap utility)
  const handleDirectSwap = () => {
    // This would open the existing swap widget/modal
    toast.info('Opening swap interface...')
    // In real implementation, this would trigger the existing swap component
  }

  // Await params to get the auction ID
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setAuctionId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Fetch auction data
  const { data: auctionData, isLoading: aucLoading, isError: aucError } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => fetchAuctionById(auctionId),
  })
  
  // Fetch car data using the same source as listing page
  const { data: cars = mockListings, isLoading: carsLoading, isError: carsError } = useQuery({
    queryKey: ['cars', auctionId],
    queryFn: () => fetchCarById(auctionId),
  })

  // Handle API response structure safely
  let carListing: Partial<CarAuctioned> | null = null;
  let auctionInfo: any = null;
  
  // Handle cars data - could be array or single object
  if (Array.isArray(cars) && cars.length > 0) {
    carListing = cars[0] as Partial<CarAuctioned>;
  } else if (cars && typeof cars === 'object' && !Array.isArray(cars)) {
    carListing = cars as Partial<CarAuctioned>;
  }
  
  // Handle auction data - could have comments, reports, etc.
  if (auctionData && typeof auctionData === 'object') {
    auctionInfo = auctionData;
  }

  // Show loading if car data is loading or auctionId not set yet
  if (carsLoading || !auctionId) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00296b] mx-auto mb-4"></div> */}
        <p className="text-4xl text-[#00296b] font-bold animate-pulse text-center">
          ZERO
        </p>
      </div>
    )
  }

  // Show error if car not found
  if (carsError || !carListing) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Auction Not Found</h2>
          <p className="text-gray-400">The auction youre looking for doesnt exist.</p>
        </div>
      </div>
    )
  }

  // Safe access for image_url and other fields
  const images = Array.isArray(carListing?.image_url) && carListing.image_url.length > 0
    ? carListing.image_url
    : ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"];
  const seller = typeof carListing?.seller === 'string' ? { name: carListing.seller, verified: false } : (carListing?.seller || { name: 'Unknown', verified: false });
  const features = carListing?.features || { exterior: [], interior: [], mechanical: [] };
  const startingPrice = carListing?.starting_price || auctionInfo?.starting_price || 0;
  const description = carListing?.description || '';
  const year = carListing?.year || '';
  const make = carListing?.make || '';
  const model = carListing?.model || '';
  const location = carListing?.location || '';
  
  // Mock data for testing when API returns empty
  const mockComments = [
    {
      id: 1,
      user: "0x1234...5678",
      text: "Great condition! I'm interested in this auction.",
      timestamp: "2024-12-15T10:30:00Z",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 2,
      user: "0x8765...4321", 
      text: "Has anyone seen this car in person? The photos look good.",
      timestamp: "2024-12-15T09:15:00Z",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 3,
      user: "0xabcd...efgh",
      text: "The mileage seems reasonable for the year. Good value!",
      timestamp: "2024-12-15T08:45:00Z",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    }
  ]
  
  const mockReports = [
    {
      id: 1,
      type: "Minor Issue",
      description: "Small scratch on passenger door",
      timestamp: "2024-12-15T11:00:00Z"
    }
  ]
  
  // Handle auction-specific data from API response
  const comments = auctionInfo?.comments?.length > 0 ? auctionInfo.comments : mockComments;
  const reports = auctionInfo?.reports?.length > 0 ? auctionInfo.reports : mockReports;
  const auctionStatus = auctionInfo?.status || 'active';
  const currentBid = auctionInfo?.current_bid || startingPrice;
  const bidCount = auctionInfo?.bid_count || 0;

  const handleBid = async (amount: number) => {
    if (!isConnected || !address) {
      toast.error('Connect your wallet to bid!')
      return
    }
    // Enforce stake
    const stake = amount * 0.05
    toast.info(`You must stake ${formatCurrency(stake, currency)} to place this bid.`)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJwtToken() || ''}`
        },
        body: JSON.stringify({ auctionId, address, amount })
      })
      const data = await res.json()
      if (data.status === 'success') {
        toast.success('Bid placed!')
        setBidAmount('')
        setTimer(60) // Reset timer
      } else {
        throw new Error(data.message || 'Failed to place bid')
      }
    } catch (e) {
      toast.error('Failed to place bid (fallback or backend error)')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(bidAmount)
    if (!isNaN(amount) && amount > 0) {
      handleBid(amount)
    } else {
      toast.error('Bid must be higher than current!')
    }
  }

  // Timer urgency color
  const timerColor = timer > 20 ? 'text-green-600' : timer > 10 ? 'text-[#00296b] animate-pulse' : 'text-red-600 animate-bounce'
  // Progress bar width
  const progressWidth = `${(timer / 60) * 100}%`

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none animate-fade-in">
          <div className="w-full h-full flex flex-wrap items-center justify-center">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, position: 'absolute', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-[#00296b] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{year} {make} {model}</h1>
              <p className="text-blue-200">Auction #{auctionId}</p>
            </div>
            <Badge className="bg-white text-[#00296b] border-[#00296b] text-lg px-4 py-2">LIVE AUCTION</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Image */}
            {/* <Card className="overflow-hidden"> */}
            <div className="aspect-video relative">
              <Image
                src={images[0]}
                alt={`${year} ${make} ${model}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* </Card> */}

            {/* Auction Description */}
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Auction Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Engine: {carListing?.engine_size || 'N/A'}</div>
                      <div>Transmission: {carListing?.transmission || 'N/A'}</div>
                      <div>Fuel Type: {carListing?.fuel_type || 'N/A'}</div>
                      <div>Mileage: {carListing?.mileage || 'N/A'} km</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Location & Seller</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {seller.name}
                        {seller.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            {comments.length > 0 && (
              <Card className="border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comments.map((comment: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">{comment.user || 'Anonymous'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp || Date.now()).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text || comment.content || comment.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports Section */}
            {reports.length > 0 && (
              <Card className="border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Reports ({reports.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.map((report: any, index: number) => (
                      <div key={index} className="bg-red-50 border border-red-200 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-sm text-red-700">{report.type || 'Issue Reported'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(report.timestamp || Date.now()).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-red-700">{report.description || report.text || report.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Bidders Section */}
            <Card className="border-gray-200 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Bidders ({bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bids.length > 0 ? (
                  <div className="space-y-3">
                    {bids.map((bid, index) => (
                      <div key={bid.address + bid.amount} className={`flex items-center justify-between p-3 ${index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-green-500' : 'bg-gray-500'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{bid.address.slice(0, 6)}...{bid.address.slice(-4)}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(bid.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>
                            {formatCurrency(bid.amount, currency)}
                          </div>
                          <div className="text-sm text-gray-500">Rank #{bid.rank}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No bids yet</p>
                    <p className="text-sm">Be the first to place a bid!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bidding Panel - Right Side */}
          <div className="space-y-6">
            {/* Current Bid Status */}
            <Card className="border-amber-400 p-0 border-none shadow-none">
              <CardHeader className="">
                <CardTitle className="text-black text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Current Bid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {currentBid > startingPrice ? (
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(currentBid, currency)}</div>
                    <div className="text-sm text-gray-600">Current Highest Bid</div>
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800">{formatCurrency(startingPrice, currency)}</div>
                    <div className="text-sm text-gray-500">Starting Price</div>
                  </div>
                )}

                {/* Timer */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-4 w-4" />
                    <span className={`font-bold ${timerColor}`}>Time Left: {timer}s</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 overflow-hidden">
                    <div className="h-2 bg-green-500 transition-all" style={{ width: progressWidth }} />
                  </div>
                  {timer === 0 && (
                    <div className="text-red-600 font-bold mt-2 animate-bounce">Bidding round ended!</div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{bidCount}</div>
                    <div className="text-sm text-gray-600">Total Bids</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{comments.length}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bidding Form */}
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Place Your Bid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Currency Toggle - Only show if user has enough balance */}
                {!needsSwap(bidAmount, currency) ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">Currency:</span>
                    <Button variant={currency === 'ETH' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('ETH')}>ETH</Button>
                    <Button variant={currency === 'USDC' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('USDC')}>USDC</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-sm font-medium text-amber-800">Don't have {currency}?</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowSwapForm(!showSwapForm)}
                      className="border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white"
                    >
                      Swap with Euler
                      {showSwapForm ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                  </div>
                )}

                {/* Swap Form - Dropdown */}
                {showSwapForm && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Swap Options</h4>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDirectSwap}
                          className="text-sm"
                        >
                          Direct Swap
                        </Button>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSwapSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount to Swap
                        </label>
                        <Input
                          type="number"
                          value={swapAmount}
                          onChange={e => setSwapAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Borrow Percentage: {borrowPercentage[0]}%
                        </label>
                        <Slider
                          value={borrowPercentage}
                          onValueChange={setBorrowPercentage}
                          max={50}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This increment is being lent to you and will have to be paid back
                        </p>
                      </div>

                      {borrowPercentage[0] > 0 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm text-blue-800">
                            <div className="font-medium">Borrowing Summary:</div>
                            <div>Base amount: {formatCurrency(swapAmount || '0', currency)}</div>
                            <div>Borrowed: {formatCurrency((parseFloat(swapAmount || '0') * borrowPercentage[0] / 100).toString(), currency)}</div>
                            <div className="font-medium">Total received: {formatCurrency((parseFloat(swapAmount || '0') * (1 + borrowPercentage[0] / 100)).toString(), currency)}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isSwapSubmitting}
                          className="flex-1 bg-[#00296b] text-white font-bold"
                        >
                          {isSwapSubmitting ? 'Processing...' : 'Execute Swap'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSwapForm(false)}
                          className="px-4"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Bid Form */}
                <form onSubmit={handleBidSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount ({currency})</label>
                    <Input
                      type="number"
                      min={bids[0]?.amount ? bids[0].amount + 1 : startingPrice}
                      step="1"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder={bids[0]?.amount ? `Bid more than ${formatCurrency(bids[0].amount, currency)}` : 'Enter your bid'}
                      className="w-full rounded-xs"
                      required
                    />
                  </div>

                  {/* Stake Info */}
                  {bidAmount && parseFloat(bidAmount) > 0 && (
                    <div className="text-sm text-gray-700 p-3 bg-blue-50 border border-blue-200">
                      <span className="font-semibold">Stake Required:</span> {formatCurrency(parseFloat(bidAmount) * 0.05, currency)} (5% of bid)
                    </div>
                  )}

                  {/* Insufficient Balance Warning */}
                  {bidAmount && parseFloat(bidAmount) > 0 && needsSwap(bidAmount, currency) && (
                    <div className="text-sm text-red-700 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <span className="font-semibold">Insufficient Balance:</span> You need {formatCurrency(getRequiredAmount(bidAmount), currency)} but have {formatCurrency(userBalance[currency], currency)}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || timer === 0 || (!!bidAmount && parseFloat(bidAmount.toString()) > 0 && needsSwap(bidAmount, currency))}
                    className="w-full bg-[#00296b] text-white font-bold py-3 hover:bg-[#001b47] transition-colors"
                  >
                    {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
                  </Button>
                </form>

                {/* Quick Bid Buttons */}
                {quickBids.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Quick Bids:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickBids.map((amt) => (
                        <Button
                          key={amt}
                          variant="outline"
                          className="border-[#00296b] text-[#00296b] font-bold hover:bg-[#00296b] hover:text-white transition-colors"
                          onClick={() => handleBid(amt)}
                        >
                          {formatCurrency(amt, currency)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 