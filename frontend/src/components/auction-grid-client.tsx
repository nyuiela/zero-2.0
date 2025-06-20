'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAuctions } from '@/lib/api/auction'
import { Auction } from '@/lib/utils'
import AuctionCard from '@/components/auction-card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const countryOptions = [
    { value: 'ALL', label: 'ALL' },
    { value: 'Germany', label: 'Germany' },
    { value: 'UAE', label: 'UAE' },
    { value: 'USA', label: 'USA' },
]

export default function AuctionGridClient() {
    const [selectedCountry, setSelectedCountry] = useState('ALL')
    const { data: auctions = [], isLoading, isError } = useQuery({
        queryKey: ['auctions'],
        queryFn: fetchAuctions,
    })

    const filteredAuctions = selectedCountry === 'ALL'
        ? auctions
        : auctions.filter((auction: Auction) => auction.country === selectedCountry)

    if (isLoading) return <div>Loading auctions...</div>
    if (isError) return <div>Failed to load auctions.</div>

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                    Live Auctions: <span className="text-brand">({filteredAuctions.length})</span>
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">Country:</span>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {countryOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-brand">{auctions.length}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAuctions.map((auction: Auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                ))}
            </div>
        </section>
    )
} 