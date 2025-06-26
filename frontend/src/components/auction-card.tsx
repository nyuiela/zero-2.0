import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Gavel } from 'lucide-react'

interface Auction {
  id: number
  year: string
  make: string
  model: string
  location: string
  image: string
  currentBid: string | number
  timeLeft: string
  bidCount: number
  reserve?: string
  country: string
  currency?: 'ETH' | 'USDC'
}

interface AuctionCardProps {
  auction: Auction
}

function formatCurrency(amount: number | string, currency: 'ETH' | 'USDC' = 'ETH') {
  if (typeof amount === 'string') amount = parseFloat(amount.replace(/[^\d.]/g, ''))
  return currency === 'ETH'
    ? `${amount} ETH`
    : `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
  // Default to ETH for now
  const currency = auction.currency || 'ETH'
  return (
    <Link href={`/listing/${auction.id}`} className="block group bg-gradient-to-br from-[#3f8aaf] to-[#252c34] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-amber-400">
      {/* Car Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={auction.image}
          alt={`${auction.year} ${auction.make} ${auction.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-70" />
        {/* Reserve Status Badge */}
        {auction.reserve && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${auction.reserve === 'Reserve Almost Met'
              ? 'bg-orange-500/90 text-white'
              : 'bg-green-500/90 text-white'
              }`}>
              {auction.reserve}
            </span>
          </div>
        )}
        {/* Bid Count Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center bg-black/80 text-white px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Gavel className="w-3 h-3 mr-1" />
            {auction.bidCount}
          </span>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-5">
        {/* Vehicle Title */}
        <div className="mb-3">
          <div className="text-amber-400 text-sm font-semibold mb-1 tracking-wide">
            {auction.year}
          </div>
          <h3 className="text-white text-xl font-bold leading-tight group-hover:text-amber-300 transition-colors duration-300 mb-1">
            {auction.make}
          </h3>
          <p className="text-gray-300 text-lg leading-tight">
            {auction.model}
          </p>
        </div>
        {/* Location */}
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-2 text-amber-400 flex-shrink-0" />
          <span className="truncate">{auction.location}</span>
        </div>
        {/* Bidding Info */}
        <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">
              Current Bid
            </div>
            <div className="text-amber-400 font-bold text-xl flex items-center gap-2">
              {formatCurrency(auction.currentBid, currency)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium flex items-center justify-end">
              <Clock className="w-3 h-3 mr-1" />
              Time Left
            </div>
            <div className="text-white font-semibold text-lg">
              {auction.timeLeft}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AuctionCard