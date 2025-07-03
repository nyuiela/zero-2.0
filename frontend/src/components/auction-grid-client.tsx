'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAuctionedCars } from '@/lib/api/auction'
import AuctionCard from '@/components/auction-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CarAuctioned } from '@/lib/data'

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
    queryFn: fetchAuctionedCars,
  })

  // const filteredAuctions = selectedCountry === 'ALL'
  //   ? auctions
  //   : auctions.filter((auction: Auction) => auction.country === selectedCountry)
  const filteredAuctions = auctions;

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <p className="text-4xl text-amber-400 font-bold animate-pulse text-center">
        ZERO
      </p>
    </div>
  )
  if (isError) return <div>Failed to load auctions.</div>

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Live Auctions: <span className="text-brand">({filteredAuctions.length})</span>
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-gray-300 border-[1px] rounded-xs pl-2">
            <span className="text-sm lg:text-base text-[#202626]">Country</span>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-20 text-[#202626] font-semibold rounded-none border-none shadow-none bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className=" border-gray-50 border-[1px] rounded-xs bg-white selection:bg-white">
                <SelectItem value="ALL" className="text-[#202626] hover:text-white data-[state=checked]:bg-gray-300 data-[state=checked]:text-black data-[state=checked]:rounded-none data-[state=checked]:hover:bg-white">ALL</SelectItem>
                <SelectItem value="USA" className="text-[#202626] hover:text-white data-[state=checked]:bg-gray-300 data-[state=checked]:text-black data-[state=checked]:rounded-none data-[state=unchecked]::hover:bg-white">USA</SelectItem>
                <SelectItem value="UAE" className="text-[#202626] hover:text-white">UAE</SelectItem>
                <SelectItem value="Germany" className="text-[#202626] hover:text-white">Germany</SelectItem>
                <SelectItem value="Netherlands" className="text-[#202626] hover:text-white">Netherlands</SelectItem>
                <SelectItem value="Canada" className="text-[#202626] hover:text-white">Canada</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[#202626] font-normal text-md p-2 bg-gray-100">
              {filteredAuctions.length}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAuctions.map((auction: CarAuctioned) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </section>
  )
} 