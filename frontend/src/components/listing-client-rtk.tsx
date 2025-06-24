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

    const listing: CarListing | undefined = cars.find((c: CarListing) => c.id.toString() === id)

    // Find related auctions (same country, not the same id)
    const relatedAuctions: Auction[] = allAuctions.filter(
        (a: Auction) => a.id.toString() !== id && listing && a.country === listing.country
    ).slice(0, 4)

    if (carsLoading) return <div>Loading car details...</div>
    if (carsError || !listing) return <div>Car not found.</div>

    return <ListingClient listing={listing} relatedAuctions={relatedAuctions} />
} 