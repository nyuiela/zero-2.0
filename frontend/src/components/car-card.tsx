import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Gavel } from 'lucide-react'

interface Auction {
  id: number
  year: string
  make: string
  model: string
  location: string
  image_url: string[]
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

function getAuctionImage(auction: Auction | { image: string }): string {
  if ('image_url' in auction && Array.isArray(auction.image_url) && auction.image_url.length > 0) {
    return auction.image_url[0];
  }
  if ('image' in auction && typeof auction.image === 'string') {
    return auction.image;
  }
  return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
}
function formatCurrency(amount: number | string, currency: 'ETH' | 'USDC' = 'ETH') {

  if (typeof amount === 'string') amount = parseFloat(amount.replace(/[^\d.]/g, ''))
  return currency === 'ETH'
    ? `${amount.toLocaleString('en-US')} eth`
    : `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
}

const CarCard = ({ auction }: AuctionCardProps) => {
  // Default to ETH for now
  const currency = auction.currency || 'ETH'
  return (
    <Link href={`/listing/${auction.id}`} className="block group bg-transparent overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
      {/* Car Image */}
      <div className="relative overflow-hidden h-[30rem]">
        <Image
          src={getAuctionImage(auction)}
          alt={`${auction.year} ${auction.make} ${auction.model}`}
          fill
          className=" transition-transform duration-500 group-hover:scale-105 absolute w-full h-[30rem]"
        // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
        {/* Card Content */}
        <div className="p-5 bg-transparent z-10 absolute bottom-0 w-full">
          {/* Vehicle Title */}
          <div className="mb-3">
            <div className="text-amber-400 text-sm font-semibold mb-1 tracking-wide">
              {auction.year}
            </div>
            <h3 className="text-white text-xl font-bold leading-tight group-hover:text-amber-300 transition-colors duration-300 mb-1">
              {auction.make}
            </h3>
            <p className="text-gray-200 text-lg leading-tight">
              {auction.model}
            </p>
          </div>
          {/* Location */}
          <div className="flex items-center text-gray-300 text-sm mb-4">
            <MapPin className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
            <span className="truncate">{auction.location}</span>
          </div>

        </div>
      </div>

    </Link>
  )
}

export default CarCard