'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuctionCard from '@/components/auction-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, Users, Eye, Heart, Share2, Phone, Mail, CheckCircle } from 'lucide-react'
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
    const [bidAmount, setBidAmount] = useState<number | string>(listing.currentBid)
    const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Calculate 12% stake
    const stake = (typeof bidAmount === 'string' ? parseFloat(bidAmount.replace(/[^\d.]/g, '')) : bidAmount) * 0.12

    // Sync bidAmount with currentBid when modal opens
    useEffect(() => {
      if (isBidModalOpen) {
        setBidAmount(listing.currentBid)
      }
    }, [isBidModalOpen, listing.currentBid])

    const handlePlaceBid = async () => {
      setIsSubmitting(true)
      setError(null)
      // TODO: Place bid API call here
      setTimeout(() => {
        setIsSubmitting(false)
        setIsBidModalOpen(false)
        // Redirect to bidding room
        window.location.href = `/auctions/${listing.id}/bidding-room`
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

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-all" onClick={() => setIsBidModalOpen(true)}>
                Place Bid
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-all" asChild>
                <Link href={`/auctions/${listing.id}/bidding-room`}>
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
                      min={typeof listing.currentBid === 'string' ? parseFloat(listing.currentBid.replace(/[^\d.]/g, '')) + 0.01 : (listing.currentBid as number) + 0.01}
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div className="mb-4 text-sm text-gray-700">
                    <span className="font-semibold">Stake Required:</span> {formatCurrency(stake, currency)} (12% of bid)
                  </div>
                  {error && <div className="text-red-500 mb-2">{error}</div>}
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
                                src={listing.images[selectedImage]}
                                alt={`${listing.year} ${listing.make} ${listing.model}`}
                                fill
                                className="object-cover"
                                priority
                            />
                            {listing.reserve && (
                                <div className="absolute top-4 left-4">
                                    <Badge className={`${listing.reserve === 'Reserve Almost Met'
                                            ? 'bg-orange-500 hover:bg-orange-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white`}>
                                        {listing.reserve}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-6 gap-2">
                            {listing.images.map((image, index) => (
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
                                <CardTitle className="text-brand">Current Bid</CardTitle>
                                <Badge variant="outline" className="border-brand text-brand">
                                    {listing.bidCount} bids
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-bold text-brand">{formatCurrency(listing.currentBid, currency)}</div>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4 text-brand" />
                                    <span className="text-foreground font-medium">{listing.timeLeft}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{listing.views}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Starting Bid:</span>
                                    <span className="ml-2 text-foreground">{formatCurrency(listing.startingBid, currency)}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Estimated Value:</span>
                                    <span className="ml-2 text-foreground">{formatCurrency(listing.estimatedValue, currency)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Seller Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>Seller Information</span>
                                {listing.seller.verified && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="font-semibold text-foreground">{listing.seller.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {listing.seller.location}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {listing.seller.phone}
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {listing.seller.email}
                                </Button>
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
                            <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{listing.watchers} watching</span>
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
                    {/* History & Provenance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>History & Provenance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Vehicle History</h4>
                                <p className="text-muted-foreground">{listing.history}</p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Provenance</h4>
                                <div className="flex flex-wrap gap-2">
                                    {listing.provenance.split(' • ').map((item) => (
                                        <Badge key={item} variant="secondary">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {listing.features.map((feature) => (
                                    <div key={feature} className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
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
                                {/* Engine */}
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">Engine & Performance</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Engine:</span>
                                            <span className="text-foreground">{listing.specifications.engine}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Power:</span>
                                            <span className="text-foreground">{listing.specifications.power}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Torque:</span>
                                            <span className="text-foreground">{listing.specifications.torque}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">0-60 mph:</span>
                                            <span className="text-foreground">{listing.specifications.acceleration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Top Speed:</span>
                                            <span className="text-foreground">{listing.specifications.topSpeed}</span>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                {/* Drivetrain */}
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">Drivetrain</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Transmission:</span>
                                            <span className="text-foreground">{listing.specifications.transmission}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Drivetrain:</span>
                                            <span className="text-foreground">{listing.specifications.drivetrain}</span>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                {/* Exterior & Interior */}
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">Design</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Exterior:</span>
                                            <span className="text-foreground">{listing.specifications.exterior}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Interior:</span>
                                            <span className="text-foreground">{listing.specifications.interior}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Wheels:</span>
                                            <span className="text-foreground">{listing.specifications.wheels}</span>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                {/* Technical */}
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">Technical</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Weight:</span>
                                            <span className="text-foreground">{listing.specifications.weight}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Fuel:</span>
                                            <span className="text-foreground">{listing.specifications.fuel}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Brakes:</span>
                                            <span className="text-foreground">{listing.specifications.brakes}</span>
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