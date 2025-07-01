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
import { toast } from "sonner"
import { Clock, Users, Eye, TrendingUp, Award, Timer, DollarSign, User, MapPin, CheckCircle } from "lucide-react"
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
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickBids, setQuickBids] = useState<number[]>([])
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const [timer, setTimer] = useState(60)
  const [lastBidTimestamp, setLastBidTimestamp] = useState<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Await params to get the auction ID
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setAuctionId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Fetch car data using the same source as listing page
  const { data: auctions, isLoading: aucLoading, isError: aucError } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => fetchAuctionedCars(),
  })
  const { data: cars = mockListings, isLoading: carsLoading, isError: carsError } = useQuery({
    queryKey: ['cars', auctionId],
    queryFn: () => fetchCarById(auctionId),
  })

  // Fix: If cars is an array (from API), use the first element
  let carListing: Partial<CarAuctioned> | null = null;
  if (Array.isArray(cars) && cars.length > 0) {
    carListing = cars[0] as Partial<CarAuctioned>;
  } else if (cars && typeof cars === 'object' && !Array.isArray(cars)) {
    carListing = cars as Partial<CarAuctioned>;
  }

  // Show loading if car data is loading or auctionId not set yet
  if (carsLoading || !auctionId) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div> */}
        <p className="text-4xl text-amber-400 font-bold animate-pulse text-center">
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
  const startingPrice = carListing?.starting_price || 0;
  const description = carListing?.description || '';
  const year = carListing?.year || '';
  const make = carListing?.make || '';
  const model = carListing?.model || '';
  const location = carListing?.location || '';

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
  const timerColor = timer > 20 ? 'text-green-600' : timer > 10 ? 'text-yellow-500 animate-pulse' : 'text-red-600 animate-bounce'
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
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{year} {make} {model}</h1>
              <p className="text-amber-900">Auction #{auctionId}</p>
            </div>
            <Badge className="bg-white text-amber-600 border-amber-400 text-lg px-4 py-2">LIVE AUCTION</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={images[0]}
                  alt={`${year} ${make} ${model}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            {/* Auction Description */}
            <Card>
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

            {/* All Bidders Section */}
            <Card>
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
            <Card className="border-amber-400 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-400 to-yellow-300">
                <CardTitle className="text-black text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Current Bid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bids.length > 0 ? (
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-700 mb-2">{formatCurrency(bids[0].amount, currency)}</div>
                    <div className="text-sm text-gray-600">by {bids[0].address.slice(0, 6)}...{bids[0].address.slice(-4)}</div>
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-400">{formatCurrency(startingPrice, currency)}</div>
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
                    <div className="h-2 bg-amber-400 transition-all" style={{ width: progressWidth }} />
                  </div>
                  {timer === 0 && (
                    <div className="text-red-600 font-bold mt-2 animate-bounce">Bidding round ended!</div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{carListing?.auction?.bid_count || 0}</div>
                    <div className="text-sm text-gray-600">Total Bids</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Watching</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bidding Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Place Your Bid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Currency Toggle */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-600">Currency:</span>
                  <Button variant={currency === 'ETH' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('ETH')}>ETH</Button>
                  <Button variant={currency === 'USDC' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('USDC')}>USDC</Button>
                </div>

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
                      className="w-full"
                      required
                    />
                  </div>

                {/* Stake Info */}
                {bidAmount && parseFloat(bidAmount) > 0 && (
                  <div className="text-sm text-gray-700 p-3 bg-blue-50 border border-blue-200">
                    <span className="font-semibold">Stake Required:</span> {formatCurrency(parseFloat(bidAmount) * 0.05, currency)} (5% of bid)
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || timer === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold py-3"
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
                        className="border-amber-400 text-amber-600 font-bold hover:bg-amber-400 hover:text-white"
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