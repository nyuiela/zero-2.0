'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchCars } from '@/lib/api/car'
import { fetchAuctions } from '@/lib/api/auction'
import { CarListing, listings as mockListings } from '@/lib/data'
import { Auction, auctions as mockAuctions } from '@/lib/auction'
import ListingClient from './listing-client'

interface ListingClientRtkProps {
  id: string
}

export default function ListingClientRtk({ id }: ListingClientRtkProps) {
  const { data: cars = mockListings, isLoading: carsLoading, isError: carsError } = useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  })
  const { data: allAuctions = mockAuctions } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchAuctions,
  })
  console.log("Cars ", cars);

  const listing: CarListing | undefined = cars.find((c: CarListing) => c.id.toString() === id)

  // Find related auctions (same location, not the same id)
  const relatedAuctions: Auction[] = allAuctions.filter(
    (a: Auction) => a.id.toString() !== id && listing && a.location === listing.location
  ).slice(0, 4)

  // Show loading if car data is loading
  if (carsLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-4xl text-amber-400 font-bold animate-pulse text-center">
          ZERO
        </p>
      </div>
    )
  }

  // Show error if car not found
  if (carsError || !listing) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Car Not Found</h2>
          <p className="text-gray-400">The car you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <ListingClient listing={listing} relatedAuctions={relatedAuctions} />
} 