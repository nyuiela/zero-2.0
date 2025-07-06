'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuctionCard from '@/components/auction-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, User } from 'lucide-react'
import { CarListing } from '@/lib/data'
import { Auction } from '@/lib/auction'
import { fetchBidByAuctionId, fetchBidById, placeBid } from '@/lib/api/bid'
import { useAuthStore } from '@/lib/authStore'
import { useQuery } from '@tanstack/react-query'
import CustomBtn from './custom-btn'
import { auction_abi, auction_addr } from '@/lib/abi/abi'
import { useAccount, useWriteContract } from 'wagmi'
import { ProofModalTransaction } from './proof-transaction'
import { ProofResponse } from '@/lib/utils'

interface ListingClientProps {
  listing: CarListing
  relatedAuctions: (Auction & { image_url?: string[]; image?: string })[]
}

function formatCurrency(amount: number | string, currency: 'ETH' | 'USDC' = 'ETH') {
  if (typeof amount === 'string') amount = parseFloat(amount.replace(/[^\d.]/g, ''))
  return currency === 'ETH'
    ? `${amount} ETH`
    : `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
}

export default function ListingClient({ listing, relatedAuctions }: ListingClientProps) {
  const { address } = useAccount()
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState<number | string>('')
  const [minBid, setMinBid] = useState<number>(listing.current_price)
  const [currency] = useState<'ETH' | 'USDC'>('ETH')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bidError, setBidError] = useState<string | null>(null)
  const { user } = useAuthStore()
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proof, setProof] = useState<ProofResponse | null>(null);
  const { writeContract } = useWriteContract();
  // React Query hooks
  const { data: bids, refetch: bidRefresh, isLoading: nonceLoading, isError: nonceError } = useQuery({
    queryKey: ['bid', listing.auction_id],
    queryFn: () => fetchBidByAuctionId(listing.auction_id),
    // enabled: open,
  })

  // Mock bids data for testing when API returns null
  const mockBids = [
    {
      id: 1,
      auction_id: listing.auction_id,
      amount: 45000,
      bidder_id: "0x1234...5678",
      created_at: "2024-12-15T10:30:00Z",
      updated_at: "2024-12-15T10:30:00Z"
    },
    {
      id: 2,
      auction_id: listing.auction_id,
      amount: 44000,
      bidder_id: "0x8765...4321",
      created_at: "2024-12-15T09:15:00Z",
      updated_at: "2024-12-15T09:15:00Z"
    },
    {
      id: 3,
      auction_id: listing.auction_id,
      amount: 43000,
      bidder_id: "0xabcd...efgh",
      created_at: "2024-12-15T08:45:00Z",
      updated_at: "2024-12-15T08:45:00Z"
    },
    {
      id: 4,
      auction_id: listing.auction_id,
      amount: 42000,
      bidder_id: "0x9876...5432",
      created_at: "2024-12-15T08:00:00Z",
      updated_at: "2024-12-15T08:00:00Z"
    }
  ]

  // Use mock data if API returns null
  const displayBids = bids || mockBids
  console.log("Bid ", displayBids)

  // Calculate 5% stake
  const stake = (typeof bidAmount === 'string' ? parseFloat(bidAmount.replace(/[^\d.]/g, '')) : bidAmount) * 0.05

  // Sync bidAmount with current_price when modal opens
  useEffect(() => {
    if (isBidModalOpen) {
      setBidAmount(listing.current_price.toString())
      setMinBid(listing.current_price)
      setBidError(null)
    }
  }, [isBidModalOpen, listing.current_price])

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBidAmount(value)
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < minBid) {
      const errorMsg = `Bid must be at least ${formatCurrency(minBid, currency)}`
      setBidError(errorMsg)
    } else {
      setBidError(null)
    }
  }
  const handleSubmitBid = async () => {
    try {
      writeContract({
        abi: auction_abi,
        address: auction_addr,
        functionName: "placeBid",
        args: [listing.auction_id, bidAmount],
        account: address
      })
    } catch (error) {
      console.error("Failed to submit bid ", error);
    }
  }
  const handlePlaceBid = async () => {
    const numValue = typeof bidAmount === 'string' ? parseFloat(bidAmount) : bidAmount
    if (isNaN(numValue) || numValue < minBid) {
      setBidError(`Bid must be at least ${formatCurrency(minBid, currency)}`)
      return
    }
    try {
      setIsSubmitting(true)
      const bid = {
        id: 0,
        auction_id: listing.auction_id,
        amount: Number(bidAmount),
        bidder_id: "ox",
        created_at: "2025-06-15T18:42:57.530698",
        updated_at: "2025-06-15T18:42:57.530698"
      }
      const jwt = user?.jwt;
      if (jwt == null) throw new Error("User not found");
      const bidResponse = await placeBid(bid, jwt);
      setProof(bidResponse)
      setIsProofModalOpen(true)
      console.log("Bid Response", bidResponse)
      // TODO: Place bid API call here

      setIsBidModalOpen(false)
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false);
      return console.error(error)
    }

  }

  return (
    <>
      <ProofModalTransaction isOpen={isProofModalOpen} onClose={() => setIsProofModalOpen(false)} proof={proof} handleSubmit={handleSubmitBid} name="Create Auction onchain & submit proof" />
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 px-4 md:px-8 xl:px-12">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/auctions" className="hover:text-brand">Auctions</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{listing.year} {listing.make} {listing.model}</span>
      </nav>

      {/* Current Bid Display */}
      <div className="mb-6 bg-gradient-to-r border border-amber-800 rounded-xs bg-[#00296b]/90 py-8 px-4 md:px-8 xl:px-12">
        <div className="text-center">
          <div className="text-sm text-white mb-1">Current Highest Bid</div>
          <div className="text-3xl font-bold text-white">{formatCurrency(listing.current_price, currency)}</div>
        </div>
      </div>

      {/* Bid Modal */}
      {isBidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl" onClick={() => setIsBidModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Place Your Bid</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">Bid Amount ({currency})</label>
              <input
                type="number"
                min={minBid}
                value={bidAmount}
                onChange={handleBidAmountChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            {bidError && (
              <div className="text-red-600 text-sm mt-2 font-semibold bg-red-50 p-3 rounded-lg border-2 border-red-200 flex items-center">
                <span className="mr-2">⚠️</span>
                {bidError}
              </div>
            )}
            <div className="mb-4 text-sm text-gray-700">
              <span className="font-semibold">Stake Required:</span> {formatCurrency(stake, currency)} (5% of bid)
            </div>
            <Button
              type="submit"
              onClick={handlePlaceBid}
              disabled={isSubmitting}
              className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6 cursor-pointer"
            >
              {isSubmitting ? "Creating Bid..." : "Place Bid offchain"}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 px-2 sm:px-2 md:px-4 xl:px-4">
        {/* Left Column - Images and Car Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image - maximize within column, no overflow */}
            <div className="relative aspect-[16/9] rounded-xs overflow-hidden bg-card w-full max-w-full">
              <Image
                src={listing.image_url[selectedImage]}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2 px-2 sm:px-2 md:px-4 xl:px-4">
              {listing.image_url.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-brand' : 'border-border hover:border-muted-foreground'}`}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details Section */}
          <div className="space-y-8">
            {/* Title and Location */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {listing.year} {listing.make} {listing.model}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-transparent rounded-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {listing.description}
              </p>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Vehicle Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {listing.vehicale_overview}
              </p>
            </div>

            {/* Report Section */}
            {listing.report && (
              <div className="">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Condition Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Condition</div>
                    <div className="text-lg font-semibold text-gray-900 capitalize">{listing.report.condition}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Inspection</div>
                    <div className="text-lg font-semibold text-green-600 capitalize">{listing.report.inspection}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Notes</div>
                    <div className="text-sm text-gray-900">{listing.report.notes}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="bg-transparent rounded-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Exterior</h4>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                    {listing.features.exterior.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Interior</h4>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                    {listing.features.interior.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-foreground mb-2">Mechanical</h4>
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                    {listing.features.mechanical.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-transparent rounded-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-0">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Engine Size:</span>
                  <span className="text-foreground font-medium">{listing.engine_size}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Transmission:</span>
                  <span className="text-foreground font-medium">{listing.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Fuel Type:</span>
                  <span className="text-foreground font-medium">{listing.fuel_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Exterior Color:</span>
                  <span className="text-foreground font-medium">{listing.exterior_color}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Interior Color:</span>
                  <span className="text-foreground font-medium">{listing.interior_color}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Mileage:</span>
                  <span className="text-foreground font-medium">{listing.mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">VIN:</span>
                  <span className="text-foreground font-medium font-mono text-sm">{listing.vin}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Lot Number:</span>
                  <span className="text-foreground font-medium">{listing.lot}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bidding Panel (Desktop) / Hidden on Mobile */}
        <div className="hidden lg:block space-y-6 lg:col-span-4">
          {/* Action Buttons */}
          <div className='flex flex-col space-y-4'>
            <div className="bg-gradient-to-br border-none w-full">
              <div className="text-3xl font-bold text-brand">{formatCurrency(listing.current_price, currency)}</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-md font-normal text-gray-700">Current Price</div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Starting Price:</span>
                    <span className="ml-2 text-foreground">{formatCurrency(listing.starting_price, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <Button className="text-white font-bold text-md py-5 px-8 shadow-lg transition-all rounded-none bg-[#00296b]/90 hover:bg-[#00296b] cursor-pointer text-sm hover:shadow w-full" onClick={() => setIsBidModalOpen(true)}>
                Place Bid
              </Button>
              <Button className="text-black py-5 px-8 rounded-none transition-all shadow-none text-md cursor-pointer text-sm underline bg-transparent" asChild>
                <Link href={`/auctions/${listing.id}`}>
                  Join Bidding Room
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br border-none">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-bold text-brand">Summary</div>
            </div>
            <div className="space-y-4">
              <div className="text-md text-brand">
                {listing.summary}
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-transparent shadow-none rounded-sm">
            <div className="text-lg font-bold mb-2 flex items-center space-x-2">
              <span>Brand Information</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-normal text-foreground">{listing.seller}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {listing.location}
                </div>
              </div>
            </div>
          </div>

          {/* Bids Section */}
          <div className="bg-gradient-to-br border-none p-6 px-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-brand">Bids</div>
            </div>
            {displayBids?.map((bid, key) => (
              <div key={key} className="bg-white rounded-[5px] mb-2 p-5">
                <div className="text-lg font-bold flex items-center space-x-2">
                  <span className='text-xl'>
                    {formatCurrency(bid.amount, currency)}
                  </span>
                </div>
                <div className="space-y-3 mt-2">
                  <div className='flex justify-between'>
                    <div className="font-semibold text-gray-600 text-sm">Bid #{bid.id}</div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <User className='w-4 h-3 mr-1 flex-shrink-0' />
                      <span className="truncate max-w-[80px]">{bid.bidder_id}</span>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div></div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <span className="truncate max-w-[100px]">{bid.updated_at}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Horizontal Scrollable Bid Cards Carousel */}
            {displayBids && displayBids.length > 0 && (
              <div className="mt-6">
                <div className="text-lg font-bold text-brand mb-3">Recent Bidders</div>
                <div className="relative">
                  <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                    {displayBids.map((bid, index) => (
                      <div
                        key={`carousel-${bid.id}`}
                        className="flex-shrink-0 w-48 bg-white p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        style={{ borderRadius: 'var(--radius)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                            {bid.bidder_id?.slice(0, 6)}...{bid.bidder_id?.slice(-4)}
                          </div>
                          <div className="text-xs text-gray-500 flex-shrink-0">#{index + 1}</div>
                        </div>
                        <div className="text-lg font-bold text-green-600 truncate">
                          {formatCurrency(bid.amount, currency)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {new Date(bid.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Auto-scroll indicator */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bidding Panel - Below Car Details */}
      <div className="lg:hidden space-y-6 mb-8 px-4">
        {/* Action Buttons */}
        <div className='flex flex-col space-y-4'>
          <div className="bg-gradient-to-br border-none w-full">
            <div className="text-3xl font-bold text-brand">{formatCurrency(listing.current_price, currency)}</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-md font-normal text-gray-700">Current Price</div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Starting Price:</span>
                  <span className="ml-2 text-foreground">{formatCurrency(listing.starting_price, currency)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <Button className="text-white font-bold text-md py-5 px-8 shadow-lg transition-all rounded-none bg-[#00296b]/90 hover:bg-[#00296b] cursor-pointer text-sm hover:shadow w-full" onClick={() => setIsBidModalOpen(true)}>
              Place Bid
            </Button>
            <Button className="text-black py-5 px-8 rounded-none transition-all shadow-none text-md cursor-pointer text-sm underline bg-transparent" asChild>
              <Link href={`/auctions/${listing.id}`}>
                Join Bidding Room
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br border-none">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-bold text-brand">Summary</div>
          </div>
          <div className="space-y-4">
            <div className="text-md text-brand">
              {listing.summary}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-transparent shadow-none rounded-sm">
          <div className="text-lg font-bold mb-2 flex items-center space-x-2">
            <span>Brand Information</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-foreground">{listing.seller}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {listing.location}
              </div>
            </div>
          </div>
        </div>

        {/* Bids Section */}
        <div className="bg-gradient-to-br border-none p-6 px-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-brand">Bids</div>
          </div>
          {displayBids?.map((bid, key) => (
            <div key={key} className="bg-white rounded-[5px] mb-2 p-5">
              <div className="text-lg font-bold flex items-center space-x-2">
                <span className='text-xl'>
                  {formatCurrency(bid.amount, currency)}
                </span>
              </div>
              <div className="space-y-3 mt-2">
                <div className='flex justify-between'>
                  <div className="font-semibold text-gray-600 text-sm">Bid #{bid.id}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <User className='w-4 h-3 mr-1 flex-shrink-0' />
                    <span className="truncate max-w-[80px]">{bid.bidder_id}</span>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div></div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <span className="truncate max-w-[100px]">{bid.updated_at}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Horizontal Scrollable Bid Cards Carousel */}
          {displayBids && displayBids.length > 0 && (
            <div className="mt-6">
              <div className="text-lg font-bold text-brand mb-3">Recent Bidders</div>
              <div className="relative">
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                  {displayBids.map((bid, index) => (
                    <div
                      key={`carousel-${bid.id}`}
                      className="flex-shrink-0 w-48 bg-white p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {bid.bidder_id?.slice(0, 6)}...{bid.bidder_id?.slice(-4)}
                        </div>
                        <div className="text-xs text-gray-500 flex-shrink-0">#{index + 1}</div>
                      </div>
                      <div className="text-lg font-bold text-green-600 truncate">
                        {formatCurrency(bid.amount, currency)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {new Date(bid.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Auto-scroll indicator */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Auctions */}
      <div className="mt-16 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-8">Related Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* {relatedAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))} */}
        </div>
      </div>
    </>
  )
}