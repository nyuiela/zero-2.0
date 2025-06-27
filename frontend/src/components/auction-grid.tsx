'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AuctionCard from './auction-card'
import { auctions, upcomingAuctions } from '@/lib/auction'
import Image from 'next/image'
import { Link, Gavel, MapPin, Clock } from 'lucide-react'
import { fetchAuctions } from '@/lib/api/auction'
import { fetchCars } from '@/lib/api/car'
import { useQuery } from '@tanstack/react-query'

const AuctionGrid = () => {
  const [selectedCountry, setSelectedCountry] = useState('ALL')
  const { data: cars = [], isLoading, isError } = useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  })

  // Filter auctions based on selected country
  const filteredAuctions = selectedCountry === 'ALL'
    ? auctions
    : auctions.filter(auction => auction.country === selectedCountry)

  const totalAuctions = auctions.length
  const displayedAuctions = filteredAuctions.length

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Filter */}
        <div className="mb-5 flex bg-red-00 items-center justify-between">
          <h1 className="text-3xl lg:text-2xl font-bold text-[#202626]">Auctions</h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-sm lg:text-base text-[#202626]">Country</span>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-32 bg-transparent text-[#202626] font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" border-gray-00">
                  <SelectItem value="ALL" className="text-[#202626] hover:text-white">ALL</SelectItem>
                  <SelectItem value="USA" className="text-[#202626] hover:text-white">USA</SelectItem>
                  <SelectItem value="UAE" className="text-[#202626] hover:text-white">UAE</SelectItem>
                  <SelectItem value="Germany" className="text-[#202626] hover:text-white">Germany</SelectItem>
                  <SelectItem value="Netherlands" className="text-[#202626] hover:text-white">Netherlands</SelectItem>
                  <SelectItem value="Canada" className="text-[#202626] hover:text-white">Canada</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-[#202626] font-bold text-md bg-blue-400 p-2">
                {displayedAuctions}
              </span>
            </div>
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {/* Upcoming Auctions */}
        <div className="mt-12 lg:mt-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#202626] mb-8">Upcoming Auctions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            {upcomingAuctions.map((auction, key) => (
              <div key={key}
                className="block group bg-transparent overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Car Image */}
                <div className="relative overflow-hidden h-[30rem]">

                  <Image
                    src={auction.image}
                    alt={`${auction.year} ${auction.make} ${auction.model}`}
                    fill
                    className=" transition-transform duration-500 group-hover:scale-105 absolute w-full h-[30rem]"
                  // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-70" />
                  {/* Bidding Info */}
                  <div className="border-none pt-4 flex items-center justify-center bg-[#E4DFDA] p-2 backdrop-blur-md">
                    <div className="text-right">
                      <div className="text-gray-800 text-xs mb-1 uppercase tracking-wide font-medium flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1" />
                        Countdown to Auctioin
                      </div>
                      <div className="text-black font-semibold text-lg text-center">
                        {auction.auctionStart}
                      </div>
                    </div>
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

              </div>
            ))}
          </div>
        </div>
      </div>
    </section >
  )
}

export default AuctionGrid
