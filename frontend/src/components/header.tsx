"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Search, User, Menu, X, Wallet, Network, Gavel, Heart } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/authStore';
// import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import { LoginModal } from './login-modal';
import { BrandRegistrationForm, BrandRegistrationFormData } from './brand-registration-form';
import { readContract, writeContract } from 'viem/actions';
import { registry_abi, registry_addr } from '@/lib/abi/abi';
import Image from 'next/image';
import ProfileBanner from '@/components/profile-banner';

const contactInfo = [
  { label: 'US', value: '+1 323-407-8523' },
  { label: 'UAE', value: '+971 5 858 60396' },
  { label: 'UK', value: '+44 20 4525 8014' },
];

export default function Header() {
  // const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { user, logout, setOpen } = useAuthStore()
  // const router = useRouter()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  console.log("user ", user);
  const { writeContract } = useWriteContract();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Add state for profile NFT image
  const [profileNft, setProfileNft] = useState<string | null>(null);

  // Check if user is fully authenticated (wallet connected + auth completed)
  const isAuthenticated = isConnected && user

  // Check if wallet is connected (for immediate UI feedback)
  // const isWalletConnected = isConnected

  // Get current chain name
  // const currentChain = availableChains.find(chain => chain.id === chainId)

  // const isSeller = user?.sellerRole || user?.roleRequestStatus === 'approved'

  const handleDisconnect = () => {
    disconnect()
    logout()
    // router.push('/')
  }

  const handleNetworkSwitch = (targetChainId: number) => {
    if (switchChain) {
      switchChain({ chainId: targetChainId })
    }
  }

  const handleSubmit = (data: BrandRegistrationFormData) => {
    setLoading(true);
    // function registerBrand(
    //   string memory _brand,
    //   // address oracleAddre,
    //   ICarOracle.OracleConfig memory config,
    //   address brandAdminAddr,
    //   uint64 subscriptionId,
    //   string memory _stateUrl,
    //   string[] memory args
    try {
      writeContract({
        abi: registry_abi,
        address: registry_addr,
        functionName: 'registerBrand',
        args: [
          data.brand,
          {
            "updateInterval": data.updateInterval,
            "deviationThreshold": data.deviationThreshold,
            "heartbeat": data.heartbeat,
            "minAnswer": data.minAnswer,
            "maxAnswer": data.maxAnswer
          },
          data.brandAdminAddr,
          data.subscriptionId,
          data.stateUrl,
          data.args
        ],
      })
      setLoading(false)
    } catch (error) {
      console.error("Failed to submit brand form ", error);
      setLoading(false)
    }
  }

  // Fetch NFT image after login
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/request-nft')
        .then(res => res.json())
        .then(data => setProfileNft(data.image))
        .catch(() => setProfileNft(null));
    } else {
      setProfileNft(null);
    }
  }, [isAuthenticated]);

  return (
    <header className="w-full relative z-50">
      {/* Top Bar */}
      <div className="w-full bg-[#d6be8a] text-[#202626] text-sm flex items-center justify-center px-4 py-2 cursor-pointer relative max-md:hidden" onClick={() => setIsBrandModalOpen(true)}>
        <span className='font-normal text-xs'>Register as a brand</span>
        <button className="text-xl font-light absolute right-5">&times;</button>
      </div>
      {/* register brand form */}

      {isBrandModalOpen && <div
        className='fixed inset-0 bg-gray-50 z-50 overflow-hidden'>
        <div className='w-full bg-red-00 p-2 flex justify-end bg-[#d6be8a] '>
          <button className="text-2xl font-light cursor-pointer" onClick={() => setIsBrandModalOpen(false)}>&times;</button>
          {/* <button className='flex cursor-pointer' onClick={() => setIsBrandModalOpen(false)}>close</button> */}
        </div>
        <div className='h-full overflow-y-auto px-4 py-6'>
          <BrandRegistrationForm />
        </div>
      </div>}
      {/* <BrandRegistrationForm
        onSubmit={handleSubmit}
        isLoading={false}
      /> */}

      {/* Contact Info Bar */}
      <div className="w-full bg-gray-50 text-[#202626] text-xs flex items-center justify-center px-4 py-1 border-b border-gray-200 max-md:text-[10px] max-md:hidden">
        {contactInfo.map((item, idx) => (
          <span key={item.label} className="mx-1">
            {item.label} {item.value}
            {idx < contactInfo.length - 1 && <span className="mx-2">|</span>}
          </span>
        ))}
        <span className="mx-1">|</span>
        <span>sales@zero.com.ssd.ss</span>
      </div>
      {/* Main Navigation */}
      <nav className="w-full bg-white border-b border-gray-200 pt-5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-6 relative">
          {/* Hamburger Menu - Mobile Only */}
          <button
            className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7400b8]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-[#202626]" /> : <Menu className="h-6 w-6 text-[#202626]" />}
          </button>

          {/* Logo - Always Centered */}
          <div className="flex-1 flex justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:static sm:translate-x-0 sm:translate-y-0">
            <Link href="/" className="flex flex-col items-center">
              <span className="text-3xl tracking-widest font-extralight font-serif text-[#00296b]">ZE | RO</span>
              <span className="text-xs tracking-widest text-gray-500 mt-1 font-extralight font-serif">Decentralized Cars</span>
            </Link>
          </div>

          {/* Search and Sign In - Always Right Aligned */}
          <div className="flex items-center space-x-4 ml-auto absolute right-10">
            <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer max-md:hidden">
              <Search className="h-5 w-5 text-[#202626]" />
            </button>
            {/* Auth Section */}
            {!isAuthenticated ? (
              <div
                onClick={() => setOpen(true)}
                className="bg-transparent hover:bg-white text-[#202626] hover:text-[#7400b8] font-medium cursor-pointer"
              >
                Login
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-black">
                <div className='max-sm:hidden text-sm'>{chainId}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="default" className="text-black border-gray-600 hover:border-amber-00 hover:text-amber-00 py-3 px-4 border-0 shadow-none">
                      <User />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-60 bg-white border-gray-700 text-black border-none shadow-2xl p-2 z-[100] rounded-sm"
                    sideOffset={8}
                  >
                    {/* NFT Banner or fallback */}
                    <div className='w-full flex justify-center mb-2'>
                      <ProfileBanner image={profileNft} height="h-20" />
                    </div>
                    <DropdownMenuItem className="py-2 px-2 rounded-[8px] hover:bg-gray-300 transition-colors cursor-pointer">
                      <Link href="/profile" className="flex items-center w-full">
                        <User className="h-3.5 w-4 mr-3" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 px-2 rounded-[8px] hover:bg-gray-300 transition-colors cursor-pointer">
                      <Link href="/profile/my-bids" className="flex items-center w-full">
                        <Gavel className="h-3.5 w-4 mr-3" />
                        My Bids
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 px-2 rounded-[8px] hover:bg-gray-300 transition-colors cursor-pointer">
                      <div className="flex items-center w-full">
                        <Heart className="h-3.5 w-4 mr-3" />
                        Saved Auctions
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-300 my-2" />
                    <DropdownMenuItem
                      onClick={handleDisconnect}
                      className="py-2 px-1 rounded-[8px] text-black hover:bg-red-400 hover:text-white/90 transition-colors flex items-center pl-3 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-4 mr-3" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 animate-fade-in">
              <div className="flex flex-col py-4 px-6 space-y-2">
                <Link href="/auctions" className="py-2 text-[#202626] hover:text-[#7400b8] font-medium" onClick={() => setMobileMenuOpen(false)}>Auctions</Link>
                <Link href="/sell" className="py-2 text-[#202626] hover:text-[#7400b8] font-medium" onClick={() => setMobileMenuOpen(false)}>Sell</Link>
                <Link href="/verify" className="py-2 text-[#202626] hover:text-[#7400b8] font-medium" onClick={() => setMobileMenuOpen(false)}>Verify</Link>
                <Link href="/brands" className="py-2 text-[#202626] hover:text-[#7400b8] font-medium" onClick={() => setMobileMenuOpen(false)}>Brands</Link>
                <Link href="/swap" className="py-2 text-[#202626] hover:text-[#7400b8] font-medium" onClick={() => setMobileMenuOpen(false)}>Swap</Link>
                <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer bg-gray-100 flex items-center justify-betweens px-5">
                  <input type="text" placeholder="Search" className="w-full outline-none" />
                  <Search className="h-5 w-5 text-[#202626]" />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Nav Links Row - Desktop Only */}
        <div className="hidden sm:flex w-full justify-center space-x-10 py-2 border-t border-gray-100 bg-white">
          <Link href="/auctions" className="hover:text-[#7400b8] text-[#202626] font-medium">Auctions</Link>
          <Link href="/sell" className="hover:text-[#7400b8] text-[#202626] font-medium">Sell</Link>
          <Link href="/verify" className="hover:text-[#7400b8] text-[#202626] font-medium">Verify</Link>
          <Link href="/brands" className="hover:text-[#7400b8] text-[#202626] font-medium">Brands</Link>
          <Link href="/swap" className="hover:text-[#7400b8] text-[#202626] font-medium">Swap</Link>
        </div>
      </nav>
      <LoginModal />
    </header>
  );
} 