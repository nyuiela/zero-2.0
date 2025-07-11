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
import CarCard from './car-card'

const CarGrid = () => {
  const [selectedCountry, setSelectedCountry] = useState('ALL')
  const { data: cars = [], isLoading, isError } = useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  })

  // Filter auctions based on selected country
  const filteredCars = selectedCountry === 'ALL'
    ? cars
    : cars.filter(cars => cars.location === selectedCountry)

  // const totalAuctions = auctions.length
  const displayedAuctions = filteredCars.length

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Filter */}
        <div className="mb-5 flex bg-red-00 items-center justify-between">
          <h1 className="text-3xl lg:text-2xl font-bold text-[#202626]">Cars</h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-300 border-[1px] rounded-xs pl-2">
              <span className="text-sm lg:text-base text-[#202626]">Country</span>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-20 text-[#202626] font-semibold rounded-none border-none shadow-none bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" border-gray-50 border-[1px] rounded-xs bg-white selection:bg-white">
                  <SelectItem
                    value="ALL"
                    className="text-[#202626] hover:text-white data-[state=checked]:bg-gray-300 data-[state=checked]:text-black data-[state=checked]:rounded-none data-[state=checked]:hover:bg-white"
                  >
                    ALL
                  </SelectItem>
                  <SelectItem value="USA" className="text-[#202626] hover:text-white data-[state=checked]:bg-gray-300 data-[state=checked]:text-black data-[state=checked]:rounded-none data-[state=unchecked]::hover:bg-white">USA</SelectItem>
                  <SelectItem value="UAE" className="text-[#202626] hover:text-white">UAE</SelectItem>
                  <SelectItem value="Germany" className="text-[#202626] hover:text-white">Germany</SelectItem>
                  <SelectItem value="Netherlands" className="text-[#202626] hover:text-white">Netherlands</SelectItem>
                  <SelectItem value="Canada" className="text-[#202626] hover:text-white">Canada</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-[#202626] font-normal text-md p-2 bg-gray-100">
                {displayedAuctions}
              </span>
            </div>
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
          {filteredCars.map((auction) => (
            <CarCard key={auction.id} auction={auction} />
          ))}
        </div>


      </div>
    </section >
  )
}

export default CarGrid;
