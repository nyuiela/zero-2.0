"use client"
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect, useRef } from 'react'

const Hero = () => {
  const featuredAuctions = [
    {
      id: 340,
      year: '2010',
      make: 'Dodge',
      model: 'Viper SRT-10 Roadster',
      image: 'https://ext.same-assets.com/360451443/3746763894.jpeg',
      link: '/listing/1'
    },
    {
      id: 330,
      year: '2022',
      make: 'Ford',
      model: 'GT Holman Moody Heritage Edition',
      image: 'https://ext.same-assets.com/360451443/1059592237.jpeg',
      link: '/listing/2'
    }
  ]

  const [current, setCurrent] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % featuredAuctions.length)
    }, 5000)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [current, featuredAuctions.length])

  const goTo = (idx: number) => {
    setCurrent(idx)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const auction = featuredAuctions[current]

  return (
    <section className="relative min-h-[60vh] flex py-8 lg:py-16 bg-black">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src={auction.image}
          alt={`${auction.year} ${auction.make} ${auction.model}`}
          fill
          priority
          className="object-cover w-full h-full transition-opacity duration-1000 opacity-100"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>
      {/* hero auction car info at the bottom */}
      <div className="absolute bottom-5 left-0 w-full z-10 flex justify-center">
        <div className="max-w-xl mx-auto px-2 h-fit w-full border-t border-white pt-4 bg-[#E4DFDA]/30 p-2 backdrop-blur-md py-5 scale-80">
          <div className="flex flex-col justify-center h-full text-center items-center">
            <div className="text-brand text-white text-sm lg:text-xl font-semibold mb-2 drop-shadow-lg">
              {auction.year}
            </div>
            <h2 className="text-white text-xl lg:text-3xl font-extrabold mb-2 lg:mb-3 drop-shadow-xl">
              {auction.make}
            </h2>
            <p className="text-white text-xl lg:text-2xl mb-6 lg:mb-8 leading-tight font-medium drop-shadow-lg">
              {auction.model}
            </p>
            <Link href={auction.link}>
              <Button
                className="bg-white/90 hover:bg-white/80 text-black hover:text-[#593e35] font-mono px-12 py-4 text-md shadow-lg transition-all duration-200 transform hover:scale-105 rounded-none"
              >
                Bid Now
              </Button>
            </Link>
            {/* Navigation dots */}
            <div className="flex justify-center gap-3 mt-8">
              {featuredAuctions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${idx === current ? 'bg-white' : 'bg-transparent'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero