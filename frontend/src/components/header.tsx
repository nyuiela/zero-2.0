"use client"
import React, { useState } from 'react';
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
  return (
    <header className="w-full relative z-50">
      {/* Top Bar */}
      <div className="w-full bg-[#d6be8a] text-[#202626] text-sm flex items-center justify-between px-4 py-2 cursor-pointer font-bold " onClick={() => setIsBrandModalOpen(true)}>
        <span>Register as a brand &gt;</span>
        <button className="text-xl font-light">&times;</button>
      </div>
      {/* register brand form */}

      {isBrandModalOpen && <div
        className='fixed inset-0 bg-gray-50 z-50 overflow-hidden'>
        <div className='w-full bg-red-00 p-2 flex justify-end bg-[#d6be8a] '>
          <button className="text-2xl font-light cursor-pointer" onClick={() => setIsBrandModalOpen(false)}>&times;</button>
          {/* <button className='flex cursor-pointer' onClick={() => setIsBrandModalOpen(false)}>close</button> */}
        </div>
        <div className='h-full overflow-y-auto px-4 py-6'>
          <BrandRegistrationForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>}
      {/* <BrandRegistrationForm
        onSubmit={handleSubmit}
        isLoading={false}
      /> */}

      {/* Contact Info Bar */}
      <div className="w-full bg-gray-50 text-[#202626] text-xs flex items-center justify-center px-4 py-1 border-b border-gray-200">
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
        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-3xl  tracking-widest font-extralight font-serif text-[#00296b]">ZE | RO</span>
            <span className="text-xs tracking-widest text-gray-500 mt-1 font-extralight font-serif">Decentralized Cars</span>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6 px-4">

          {/* Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 flex space-x-8">
            <Link href="/auctions" className="text-[#202626] hover:text-amber-500 font-medium">Auctions</Link>
            <Link href="/sell" className="text-[#202626] hover:text-amber-500 font-medium">Sell</Link>
            <Link href="/verify" className="text-[#202626] hover:text-amber-500 font-medium">Verify</Link>
            <Link href="/" className="text-[#202626] hover:text-amber-500 font-medium">Brands</Link>
          </div>
          {/* Search and Sign In */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="h-5 w-5 text-[#202626]" />
            </button>
            {/* <Link href="/login" className="text-[#202626] hover:text-amber-500 font-medium">Sign in</Link> */}


            {/* Auth Section */}
            {!isAuthenticated ? (
              // Login Button (when not authenticated)
              <div
                onClick={() => setOpen(true)}
                className="bg-transparent hover:bg-white text-[#202626] hover:text-amber-500 font-medium cursor-pointer"
              >
                Login
              </div>
            ) : (
              // Two Dropdown Buttons (when wallet is connected)

              <div className="flex items-center space-x-3 text-black">
                {/* Address Dropdown */}
                <div>{chainId}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="default" className="text-black border-gray-600 hover:border-amber-00 hover:text-amber-00 py-3 px-4 border-0 shadow-none">
                      {/* <Wallet className="h-4 w-4 mr-2" /> */}
                      <User />
                      {/* {user.username} */}
                      {/* {address?.slice(0, 6)}...{address?.slice(-4)} */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-60 bg-white border-gray-700 text-black border-none shadow-2xl p-2 z-[100]"
                    sideOffset={8}
                  >
                    <DropdownMenuItem className="py-3 px-3 rounded-md hover:bg-gray-300 transition-colors">
                      <Link href="/profile" className="flex items-center w-full">
                        {/* <div className='w-full h-[5rem] bg-red-300'> */}
                        <User className="h-4 w-4 mr-3" />
                        Profile
                        {/* </div> */}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 px-3 rounded-md hover:bg-gray-300 transition-colors">
                      <div className="flex items-center w-full">
                        <Gavel className="h-4 w-4 mr-3" />
                        My Bids
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 px-3 rounded-md hover:bg-gray-300 transition-colors">
                      <div className="flex items-center w-full">
                        <Heart className="h-4 w-4 mr-3" />
                        Saved Auctions
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-300 my-2" />
                    <DropdownMenuItem
                      onClick={handleDisconnect}
                      className="py-3 px-3 rounded-md text-red-500 hover:bg-red-200 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

        </div>
      </nav>
      <LoginModal />
    </header>
  );
} 