'use client'

import { useState } from 'react'
import Footer from '@/components/footer'
import AuctionGridClient from '@/components/auction-grid-client'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

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

interface UpcomingAuction {
  id: number
  year: string
  make: string
  model: string
  location: string
  image: string
  auctionStart: string
}

export default function AuctionsPage() {
  const [selectedCountry, setSelectedCountry] = useState('ALL')

  const auctions: Auction[] = [
    {
      id: 330,
      year: '2022',
      make: 'Ford',
      model: 'GT Holman Moody Heritage Edition',
      location: 'Cologne, Germany',
      image: 'https://ext.same-assets.com/360451443/3096838199.jpeg',
      currentBid: '€701,500',
      timeLeft: '13:06:33',
      bidCount: 30,
      reserve: 'Reserve Almost Met',
      country: 'Germany'
    },
    {
      id: 334,
      year: '2011',
      make: 'Morgan',
      model: 'Aero 8 Supersports',
      location: 'Dubai, United Arab Emirates',
      image: 'https://ext.same-assets.com/360451443/3233359261.jpeg',
      currentBid: 'US$96,000',
      timeLeft: '14:36:33',
      bidCount: 22,
      reserve: 'Reserve Almost Met',
      country: 'UAE'
    },
    {
      id: 335,
      year: '2016',
      make: 'Ferrari',
      model: '488 Spider',
      location: 'Dubai, United Arab Emirates',
      image: 'https://ext.same-assets.com/360451443/428281940.jpeg',
      currentBid: '675,000 AED',
      timeLeft: '14:56:33',
      bidCount: 19,
      country: 'UAE'
    },
    {
      id: 339,
      year: '2004',
      make: 'Ferrari',
      model: '360 Modena',
      location: 'Riverside, CA, USA',
      image: 'https://ext.same-assets.com/360451443/3549048287.jpeg',
      currentBid: 'US$81,000',
      timeLeft: '15:36:33',
      bidCount: 31,
      reserve: 'Reserve Almost Met',
      country: 'USA'
    },
    {
      id: 289,
      year: '2024',
      make: 'Bentley',
      model: 'GT W12 Speed - 55km',
      location: 'Bautzen, Germany',
      image: 'https://ext.same-assets.com/360451443/3638646694.jpeg',
      currentBid: '€201,000',
      timeLeft: '36:36:33',
      bidCount: 27,
      country: 'Germany'
    },
    {
      id: 327,
      year: '1999',
      make: 'Nissan',
      model: 'Skyline R34 GT-R',
      location: 'Dubai, United Arab Emirates',
      image: 'https://ext.same-assets.com/360451443/701319310.jpeg',
      currentBid: '155,000 AED',
      timeLeft: '38:36:33',
      bidCount: 24,
      country: 'UAE'
    },
    {
      id: 343,
      year: '2020',
      make: 'Mercedes-Benz',
      model: 'AMG GT 63 S Brabus 800',
      location: 'Dubai, United Arab Emirates',
      image: 'https://ext.same-assets.com/360451443/3057433556.jpeg',
      currentBid: '285,000 AED',
      timeLeft: '2 days',
      bidCount: 24,
      country: 'UAE'
    },
    {
      id: 336,
      year: '2020',
      make: 'Nissan',
      model: 'GT-R 50th Anniversary',
      location: 'Dubai, United Arab Emirates',
      image: 'https://ext.same-assets.com/360451443/3390778518.jpeg',
      currentBid: '275,000 AED',
      timeLeft: '3 days',
      bidCount: 31,
      reserve: 'Reserve Lowered',
      country: 'UAE'
    },
    {
      id: 345,
      year: '2023',
      make: 'Mercedes-Benz',
      model: 'Metris Custom - 240 mi',
      location: 'Los Angeles, CA, USA',
      image: 'https://ext.same-assets.com/360451443/1132081871.jpeg',
      currentBid: 'US$65,000',
      timeLeft: '3 days',
      bidCount: 25,
      country: 'USA'
    },
    {
      id: 346,
      year: '1962',
      make: 'Porsche',
      model: '356 B',
      location: 'Bridgeport, CT, USA',
      image: 'https://ext.same-assets.com/360451443/3393672263.jpeg',
      currentBid: 'US$25,000',
      timeLeft: '3 days',
      bidCount: 32,
      country: 'USA'
    },
    {
      id: 331,
      year: '2020',
      make: 'Audi',
      model: 'R8 - 1,300 hp',
      location: 'Opa-locka, FL, USA',
      image: 'https://ext.same-assets.com/360451443/4094987785.jpeg',
      currentBid: 'US$25,000',
      timeLeft: '4 days',
      bidCount: 32,
      country: 'USA'
    },
    {
      id: 340,
      year: '2010',
      make: 'Dodge',
      model: 'Viper SRT-10 Roadster',
      location: 'Houston, TX, USA',
      image: 'https://ext.same-assets.com/360451443/872688151.jpeg',
      currentBid: 'US$19,000',
      timeLeft: '4 days',
      bidCount: 18,
      country: 'USA'
    }
  ]

  // Filter auctions based on selected country
  const filteredAuctions = selectedCountry === 'ALL'
    ? auctions
    : auctions.filter(auction => auction.country === selectedCountry)

  const totalAuctions = auctions.length
  const displayedAuctions = filteredAuctions.length

  // Upcoming auctions
  const upcomingAuctions: UpcomingAuction[] = [
    {
      id: 353,
      year: '2014',
      make: 'Aston-Martin',
      model: 'Vanquish',
      location: 'Scarsborough, Ontario, Canada',
      image: 'https://ext.same-assets.com/360451443/1101411790.jpeg',
      auctionStart: '17 July'
    },
    {
      id: 347,
      year: '1967',
      make: 'Chevrolet',
      model: 'Corvette Stingray Restomod',
      location: 'Scarsborough, Ontario, Canada',
      image: 'https://ext.same-assets.com/360451443/3915515407.jpeg',
      auctionStart: '18 July'
    }
  ]

  // Available now cars
  const availableNowCars: Auction[] = [
    {
      id: 273,
      year: '2023',
      make: 'Hennessey',
      model: 'Venom F5 Coupe - 1,817 hp & 300 mph',
      location: 'Lynnwood, WA, USA',
      image: 'https://ext.same-assets.com/360451443/2709436699.jpeg',
      currentBid: 'Available Now',
      timeLeft: '',
      bidCount: 0,
      country: 'USA'
    },
    {
      id: 111,
      year: '2021',
      make: 'Ferrari',
      model: 'Monza SP2',
      location: 'Dubai, United Arab Emirates',
      image: 'https://ext.same-assets.com/360451443/544253624.jpeg',
      currentBid: 'Available Now',
      timeLeft: '',
      bidCount: 0,
      country: 'UAE'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <AuctionGridClient />

        {/* Preview Auctions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Preview Auctions: <span className="text-gray-900">({upcomingAuctions.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingAuctions.map((auction) => (
              <div key={auction.id} className="auction-card group bg-gradient-to-br from-[#3f8aaf] to-[#252c34]">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={auction.image}
                    alt={`${auction.year} ${auction.make} ${auction.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={100}
                    height={100}
                  />
                  {/* Overlay gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-70 pointer-events-none" />
                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                    <div className="mb-3">
                      <div className="text-white text-sm font-semibold mb-1 tracking-wide">
                        {auction.year}
                      </div>
                      <h3 className="text-white text-xl font-bold leading-tight">
                        {auction.make}
                      </h3>
                      <p className="text-gray-100 text-lg leading-tight">
                        {auction.model}
                      </p>
                    </div>
                    <div className="text-sm text-gray-300 mb-4">
                      {auction.location}
                    </div>
                    <div className="text-white font-semibold">
                      Auction Begins: {auction.auctionStart}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Now Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Available Now: <span className="text-gray-900">({availableNowCars.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableNowCars.map((car) => (
              <div key={car.id} className="auction-card group bg-gradient-to-br from-[#3f8aaf] to-[#252c34]">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={car.image}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={100}
                    height={100}
                  />
                  {/* Overlay gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-70 pointer-events-none" />
                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                    <div className="mb-3">
                      <div className="text-white text-sm font-semibold mb-1 tracking-wide">
                        {car.year}
                      </div>
                      <h3 className="text-white text-xl font-bold leading-tight">
                        {car.make}
                      </h3>
                      <p className="text-gray-100 text-lg leading-tight">
                        {car.model}
                      </p>
                    </div>
                    <div className="text-sm text-gray-300 mb-4">
                      {car.location}
                    </div>
                    <div className="text-white font-semibold text-lg flex items-center gap-2">
                      Available Now
                      <ArrowRight className="transition-all duration-300 ease-in-out opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
