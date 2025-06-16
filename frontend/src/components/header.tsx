'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="bg-[#706646] px-4 py-2 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-2">
          <div className="flex items-center">
            <Link
              href="/sell-your-vehicle"
              className="bg-white text-[#706646] px-4 py-1.5 rounded font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Sell Your Supercar
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white text-xs lg:text-sm">
            <Link href="tel:+13234078523" className="hover:text-gray-200">
              US +1 323-407-8523
            </Link>
            <Link href="tel:+971585860396" className="hover:text-gray-200">
              UAE +971 5 858 60396
            </Link>
            <Link href="tel:+442045258014" className="hover:text-gray-200">
              UK +44 20 4525 8014
            </Link>
            <Link href="mailto:sales@sbxcars.com" className="hover:text-gray-200">
              sales@sbxcars.com
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#202626] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                {/* SBX Cars Logo - using SVG from original site */}
                <svg
                  width="120"
                  height="40"
                  viewBox="0 0 120 40"
                  className="text-[#706646] fill-current"
                >
                  <text x="0" y="25" className="text-xl font-bold">SBX CARS</text>
                </svg>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/auctions" className="text-white hover-brand font-medium">
                Auctions
              </Link>
              <Link href="/preview" className="text-white hover-brand font-medium">
                Preview
              </Link>
              <Link href="/results" className="text-white hover-brand font-medium">
                Results
              </Link>
              <Link href="/sell-your-vehicle" className="text-white hover-brand font-medium">
                Sell
              </Link>
              <Link href="/stories" className="text-white hover-brand font-medium">
                Stories
              </Link>
              <Link href="/faq" className="text-white hover-brand font-medium">
                FAQ
              </Link>
              <Link href="/about-us" className="text-white hover-brand font-medium">
                About
              </Link>
            </div>

            {/* Search and Profile */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                {isSearchOpen ? (
                  <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search auctions..."
                      className="border-0 bg-transparent text-white placeholder-gray-400 focus:ring-0 w-64"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-gray-400 hover:text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#202626] border-gray-700 w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Mobile Search */}
                    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search auctions..."
                        className="border-0 bg-transparent text-white placeholder-gray-400 focus:ring-0"
                      />
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex flex-col space-y-3 pt-4">
                      <Link href="/auctions" className="text-white hover-brand font-medium py-2">
                        Auctions
                      </Link>
                      <Link href="/preview" className="text-white hover-brand font-medium py-2">
                        Preview
                      </Link>
                      <Link href="/results" className="text-white hover-brand font-medium py-2">
                        Results
                      </Link>
                      <Link href="/sell-your-vehicle" className="text-white hover-brand font-medium py-2">
                        Sell Your Vehicle
                      </Link>
                      <Link href="/stories" className="text-white hover-brand font-medium py-2">
                        Stories
                      </Link>
                      <Link href="/faq" className="text-white hover-brand font-medium py-2">
                        FAQ
                      </Link>
                      <Link href="/about-us" className="text-white hover-brand font-medium py-2">
                        About Us
                      </Link>
                      <Link href="/team" className="text-white hover-brand font-medium py-2">
                        Team
                      </Link>
                      <Link href="/press" className="text-white hover-brand font-medium py-2">
                        Press
                      </Link>
                      <Link href="/careers" className="text-white hover-brand font-medium py-2">
                        Careers
                      </Link>
                      <Link href="/contact-us" className="text-white hover-brand font-medium py-2">
                        Contact Us
                      </Link>
                    </div>

                    {/* Powered by Section in Mobile */}
                    <div className="border-t border-gray-700 pt-4 mt-8">
                      <p className="text-gray-400 text-sm mb-2">Powered by</p>
                      <Link
                        href="https://supercarblondie.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand font-bold text-lg"
                      >
                        Supercar Blondie
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header