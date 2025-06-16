import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Auction {
  id: number
  year: string
  make: string
  model: string
  location: string
  image: string
  currentBid: string
  timeLeft: string
  bidCount: number
  reserve?: string
  country: string
}

interface AuctionCardProps {
  auction: Auction
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
  const generateSlug = () => {
    return `${auction.year.toLowerCase()}-${auction.make.toLowerCase().replace(/\s+/g, '-')}-${auction.model.toLowerCase().replace(/\s+/g, '-')}`
  }

  return (
    <div className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-800 hover:border-gray-700">
      <Link href={`/listing/${auction.id}`} className="block">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Reserve Status Badge */}
          {auction.reserve && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                auction.reserve === 'Reserve Almost Met'
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
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">
                  Current Bid
                </div>
                <div className="text-amber-400 font-bold text-xl">
                  {auction.currentBid}
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
        </div>
      </Link>

      {/* Bid Button - Outside of Link to prevent nesting */}
      <div className="px-5 pb-5">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg"
            asChild
          >
            <Link href={`/listing/${auction.id}/${generateSlug()}`}>
              Place Bid
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard