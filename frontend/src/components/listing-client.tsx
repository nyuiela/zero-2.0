'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuctionCard from '@/components/auction-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { CarListing } from '@/lib/data'
import { Auction } from '@/lib/auction'

interface ListingClientProps {
  listing: CarListing
  relatedAuctions: Auction[]
}

function formatCurrency(amount: number | string, currency: 'ETH' | 'USDC' = 'ETH') {
  if (typeof amount === 'string') amount = parseFloat(amount.replace(/[^\d.]/g, ''))
  return currency === 'ETH'
    ? `${amount} ETH`
    : `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
}

export default function ListingClient({ listing, relatedAuctions }: ListingClientProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState<number | string>('')
  const [minBid, setMinBid] = useState<number>(listing.current_price)
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bidError, setBidError] = useState<string | null>(null)

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

  const handlePlaceBid = async () => {
    const numValue = typeof bidAmount === 'string' ? parseFloat(bidAmount) : bidAmount
    if (isNaN(numValue) || numValue < minBid) {
      setBidError(`Bid must be at least ${formatCurrency(minBid, currency)}`)
      return
    }
    setIsSubmitting(true)
    // TODO: Place bid API call here
    setTimeout(() => {
      setIsSubmitting(false)
      setIsBidModalOpen(false)
      // Redirect to bidding room
      window.location.href = `/auctions/${listing.id}`
    }, 1200)
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/auctions" className="hover:text-brand">Auctions</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{listing.year} {listing.make} {listing.model}</span>
      </nav>

      {/* Current Bid Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-amber-700 mb-1">Current Highest Bid</div>
          <div className="text-3xl font-bold text-amber-800">{formatCurrency(listing.current_price, currency)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-all" onClick={() => setIsBidModalOpen(true)}>
          Place Bid
        </Button>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-all" asChild>
          <Link href={`/auctions/${listing.id}`}>
            Join Bidding Room
          </Link>
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Currency:</span>
          <Button variant={currency === 'ETH' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('ETH')}>ETH</Button>
          <Button variant={currency === 'USDC' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('USDC')}>USDC</Button>
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
            <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-lg py-3 rounded-lg shadow-lg hover:scale-105 transition-all" onClick={handlePlaceBid} disabled={isSubmitting}>
              {isSubmitting ? 'Placing Bid...' : 'Place Bid & Enter Bidding Room'}
            </Button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-card">
              <Image
                src={listing.image_url[selectedImage]}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2">
              {listing.image_url.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-brand' : 'border-border hover:border-muted-foreground'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bidding Panel */}
        <div className="space-y-6">
          <Card className="border-brand/20 bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-brand">Current Price</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-brand">{formatCurrency(listing.current_price, currency)}</div>
              <Separator />
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Starting Price:</span>
                  <span className="ml-2 text-foreground">{formatCurrency(listing.starting_price, currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Seller Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-semibold text-foreground">{listing.seller}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {listing.location}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
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
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </CardContent>
          </Card>
          {/* Vehicle Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {listing.vehicale_overview}
              </p>
            </CardContent>
          </Card>
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Exterior</h4>
                  <ul className="list-disc ml-5 text-muted-foreground">
                    {listing.features.exterior.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Interior</h4>
                  <ul className="list-disc ml-5 text-muted-foreground">
                    {listing.features.interior.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Mechanical</h4>
                  <ul className="list-disc ml-5 text-muted-foreground">
                    {listing.features.mechanical.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Specifications */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Specs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engine Size:</span>
                      <span className="text-foreground">{listing.engine_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transmission:</span>
                      <span className="text-foreground">{listing.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Type:</span>
                      <span className="text-foreground">{listing.fuel_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exterior Color:</span>
                      <span className="text-foreground">{listing.exterior_color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interior Color:</span>
                      <span className="text-foreground">{listing.interior_color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mileage:</span>
                      <span className="text-foreground">{listing.mileage} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VIN:</span>
                      <span className="text-foreground">{listing.vin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Related Auctions */}
      <div className="mt-16 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-8">Related Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </>
  )
}