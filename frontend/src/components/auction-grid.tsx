'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AuctionCard from './auction-card'
import { auctions, upcomingAuctions } from '@/lib/auction'
import Image from 'next/image'

const AuctionGrid = () => {
  const [selectedCountry, setSelectedCountry] = useState('ALL')

  // Filter auctions based on selected country
  const filteredAuctions = selectedCountry === 'ALL'
    ? auctions
    : auctions.filter(auction => auction.country === selectedCountry)

  const totalAuctions = auctions.length
  const displayedAuctions = filteredAuctions.length

  return (
    <section className="bg-[#202626] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Filter */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">Auctions</h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-sm lg:text-base">Country:</span>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-32 bg-transparent border-gray-600 text-brand font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="ALL" className="text-white hover:text-brand">ALL</SelectItem>
                  <SelectItem value="USA" className="text-white hover:text-brand">USA</SelectItem>
                  <SelectItem value="UAE" className="text-white hover:text-brand">UAE</SelectItem>
                  <SelectItem value="Germany" className="text-white hover:text-brand">Germany</SelectItem>
                  <SelectItem value="Netherlands" className="text-white hover:text-brand">Netherlands</SelectItem>
                  <SelectItem value="Canada" className="text-white hover:text-brand">Canada</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-brand font-bold text-lg lg:text-xl">
                {displayedAuctions}
              </span>
            </div>
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {/* Upcoming Auctions */}
        <div className="mt-12 lg:mt-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">Upcoming Auctions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingAuctions.map((auction) => (
              <div key={auction.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer group">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={auction.image}
                    alt={`${auction.year} ${auction.make} ${auction.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="p-6">
                  <div className="text-brand text-sm font-semibold mb-2">{auction.year}</div>
                  <h3 className="text-white text-xl font-bold mb-1">{auction.make}</h3>
                  <p className="text-white text-lg mb-3">{auction.model}</p>
                  <p className="text-gray-400 text-sm mb-4">{auction.location}</p>
                  <div className="text-gray-300">
                    <span className="text-brand font-semibold">Auction Begins:</span> {auction.auctionStart}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuctionGrid
