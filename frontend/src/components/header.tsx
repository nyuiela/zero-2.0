"use client"
import React from 'react';
import Link from 'next/link';
import { LogOut, Search, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/authStore';
// import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { LoginModal } from './login-modal';

const contactInfo = [
  { label: 'US', value: '+1 323-407-8523' },
  { label: 'UAE', value: '+971 5 858 60396' },
  { label: 'UK', value: '+44 20 4525 8014' },
];

export default function Header() {
  // const [isSearchOpen, setIsSearchOpen] = useState(false)
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { user, logout, setOpen } = useAuthStore()
  // const router = useRouter()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  console.log("user ", user)

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

  return (
    <header className="w-full">
      {/* Top Bar */}
      {/* <div className="w-full bg-[#d6be8a] text-[#202626] text-sm flex items-center justify-between px-4 py-2">
        <span>Subscribe to Our Exclusive Email Newsletter &gt;</span>
        <button className="text-xl font-light">&times;</button>
      </div> */}
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
            <Link href="/stories" className="text-[#202626] hover:text-amber-500 font-medium">Stories</Link>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="default" className="text-black border-gray-600 hover:border-amber-00 hover:text-amber-00 py-3 px-4 border-0 shadow-none">
                      {/* <Wallet className="h-4 w-4 mr-2" /> */}
                      <User />
                      {/* {user.username} */}
                      {/* {address?.slice(0, 6)}...{address?.slice(-4)} */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border-gray-700 text-black border-none shadow-2xl p-0">
                    <DropdownMenuItem className="">
                      <Link href="/profile" className="flex items-center w-full">
                        {/* <div className='w-full h-[5rem] bg-red-300'> */}
                        <User className="h-4 w-4 mr-2" />
                        Profile
                        {/* </div> */}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="">
                      My Bids
                    </DropdownMenuItem>
                    <DropdownMenuItem className="">
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
          </div>

        </div>
      </nav>
      <LoginModal />
    </header>
  );
} 