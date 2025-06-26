'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, User, X, Wallet, Network, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LoginModal } from './login-modal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains'

const isDealer = false // TODO: Replace with real user role logic

// Available chains for network switching
const availableChains = [mainnet, polygon, optimism, arbitrum, base, sepolia]

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Check if user is fully authenticated (wallet connected + auth completed)
  const isAuthenticated = isConnected && user

  // Check if wallet is connected (for immediate UI feedback)
  const isWalletConnected = isConnected

  // Get current chain name
  const currentChain = availableChains.find(chain => chain.id === chainId)

  const isSeller = user?.sellerRole || user?.roleRequestStatus === 'approved'

  const handleDisconnect = () => {
    disconnect()
    logout()
    router.push('/')
  }

  const handleNetworkSwitch = (targetChainId: number) => {
    if (switchChain) {
      switchChain({ chainId: targetChainId })
    }
  }

  return (
    <>
      <header className="w-full">
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
                <Link href="/auctions" className="text-white hover:text-amber-400 font-medium transition-colors">
                  Auctions
                </Link>
                {isWalletConnected && (
                  <>
                    <Link href="/verify" className="text-white hover:text-amber-400 font-medium transition-colors">
                      Verify
                    </Link>
                    <Link href="/preview" className="text-white hover:text-amber-400 font-medium transition-colors">
                      Preview
                    </Link>
                    <Link href="/results" className="text-white hover:text-amber-400 font-medium transition-colors">
                      Results
                    </Link>
                  </>
                )}
                {isSeller && (
                  <Link href="/sell-your-car" className="text-white hover:text-amber-400 font-medium transition-colors">
                    Sell Your Car
                  </Link>
                )}
                <Link href="/faq" className="text-white hover:text-amber-400 font-medium transition-colors">
                  FAQ
                </Link>
                <Link href="/about-us" className="text-white hover:text-amber-400 font-medium transition-colors">
                  About
                </Link>
              </div>

              {/* Search and Profile/Login */}
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

                {/* Auth Section */}
                {!isWalletConnected ? (
                  // Login Button (when not authenticated)
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-amber-500 text-base"
                  >
                    <User className="h-5 w-5" />
                    Login
                  </Button>
                ) : (
                  // Two Dropdown Buttons (when wallet is connected)
                  <div className="flex items-center space-x-3">
                    {/* Network Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="default" className="text-black border-gray-600 hover:border-amber-400 hover:text-amber-400 py-3 px-4">
                          <Network className="h-4 w-4 mr-2" />
                          {currentChain?.name || 'Unknown Network'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                        {availableChains.map((networkChain) => (
                          <DropdownMenuItem
                            key={networkChain.id}
                            onClick={() => handleNetworkSwitch(networkChain.id)}
                            className={`text-black hover:bg-gray-700 ${chainId === networkChain.id ? 'bg-amber-900/20 text-amber-400' : 'text-black'}`}
                          >
                            <Network className="h-4 w-4 mr-2" />
                            {networkChain.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Address Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="default" className="text-black border-gray-600 hover:border-amber-400 hover:text-amber-400 py-3 px-4">
                          <Wallet className="h-4 w-4 mr-2" />
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          <Link href="/profile" className="flex items-center w-full">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          My Bids
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          Saved Auctions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-600" />
                        <DropdownMenuItem
                          onClick={handleDisconnect}
                          className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

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
                        <Link href="/auctions" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          Auctions
                        </Link>
                        <Link href="/verify" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          Verify
                        </Link>
                        {isWalletConnected && (
                          <>
                            <Link href="/preview" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                              Preview
                            </Link>
                            <Link href="/results" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                              Results
                            </Link>
                          </>
                        )}
                        {isSeller && (
                          <Link href="/sell-your-car" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                            Sell Your Car
                          </Link>
                        )}
                        <Link href="/faq" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          FAQ
                        </Link>
                        <Link href="/about-us" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          About Us
                        </Link>
                        <Link href="/team" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          Team
                        </Link>
                        <Link href="/press" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          Press
                        </Link>
                        <Link href="/careers" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          Careers
                        </Link>
                        <Link href="/contact-us" className="text-white hover:text-amber-400 font-medium py-2 transition-colors">
                          Contact Us
                        </Link>
                      </div>

                      {/* Mobile Auth Section */}
                      {!isWalletConnected ? (
                        <Button
                          onClick={() => setIsLoginModalOpen(true)}
                          className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 mt-4"
                        >
                          <User className="h-4 w-4" />
                          Login
                        </Button>
                      ) : (
                        <div className="flex flex-col space-y-2 mt-4">
                          <div className="text-sm text-gray-400 mb-2">Current Network:</div>
                          <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:border-amber-400 hover:text-amber-400">
                            <Network className="h-4 w-4 mr-2" />
                            {currentChain?.name || 'Unknown Network'}
                          </Button>
                          <div className="text-sm text-gray-400 mb-2 mt-4">Available Networks:</div>
                          {availableChains.map((networkChain) => (
                            <Button
                              key={networkChain.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleNetworkSwitch(networkChain.id)}
                              className={`text-gray-300 border-gray-600 hover:border-amber-400 hover:text-amber-400 ${chainId === networkChain.id ? 'bg-amber-900/20 text-amber-400 border-amber-400' : ''}`}
                            >
                              <Network className="h-4 w-4 mr-2" />
                              {networkChain.name}
                            </Button>
                          ))}
                          <div className="text-sm text-gray-400 mb-2 mt-4">Wallet:</div>
                          <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:border-amber-400 hover:text-amber-400">
                            <Wallet className="h-4 w-4 mr-2" />
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDisconnect}
                            className="text-red-400 border-red-600 hover:bg-red-900/20 hover:text-red-300"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

export default Header