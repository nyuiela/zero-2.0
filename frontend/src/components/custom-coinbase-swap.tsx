"use client"

import { useState, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, AlertCircle, CheckCircle, Loader2, Search, X, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAccount, useBalance } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useDebounce } from 'use-debounce'
import { SWAP_CHAINS, SWAP_TOKENS, SwapChain, SwapToken } from './swap-tokens-chains'

// Chain interface
interface Chain {
  id: number
  name: string
  icon: string
  theme: {
    card: {
      className: string
      overlay?: {
        className?: string
        image?: string
      }
    }
    title: string
  }
}

// Token interface matching Coinbase's structure
interface Token {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  image: string
}

// Swap state interface
interface SwapState {
  fromToken: Token
  toToken: Token
  fromChain: Chain
  toChain: Chain
  fromAmount: string
  toAmount: string
  price: number
  slippage: number
  loading: boolean
  error: string | null
  success: boolean
}

// Remove old hardcoded CHAINS and TOKENS arrays
// Use SWAP_CHAINS and SWAP_TOKENS instead

// Example tokens for different chains
const ETH: Token = {
  address: '',
  chainId: 84532,
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
}

const USDC: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 84532,
  decimals: 6,
  name: 'USDC',
  symbol: 'USDC',
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
}

const DAI: Token = {
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  chainId: 84532,
  decimals: 18,
  name: 'Dai',
  symbol: 'DAI',
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
}

const TOKENS: Token[] = [ETH, USDC, DAI]

// Animation variants
const container = {
  hidden: {
    y: "5vh",
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    y: "0vh",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 16,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const searchContainer = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
}

const searchInput = {
  hidden: {
    width: "auto",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  show: {
    width: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
}

const chainCard = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 12,
    },
  },
}

export default function CustomCoinbaseSwap() {
  const { address, isConnected } = useAccount()
  const [swapState, setSwapState] = useState<SwapState>({
    fromToken: SWAP_TOKENS[0],
    toToken: SWAP_TOKENS[1],
    fromChain: SWAP_CHAINS[0],
    toChain: SWAP_CHAINS[0],
    fromAmount: '',
    toAmount: '',
    price: 0,
    slippage: 0.5,
    loading: false,
    error: null,
    success: false
  })

  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false)
  const [showToTokenSelector, setShowToTokenSelector] = useState(false)
  const [showSlippageSettings, setShowSlippageSettings] = useState(false)
  const [showNetworkSelector, setShowNetworkSelector] = useState(false)
  const [networkSelectorDirection, setNetworkSelectorDirection] = useState<'from' | 'to'>('from')

  // Network selector states
  const [isSearching, setIsSearching] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 100)
  const [sort, setSort] = useState<'Default' | 'A-Z' | 'Z-A'>('Default')
  const [activeFilter, setActiveFilter] = useState<'all' | 'evm' | 'testnet'>('all')

  // Fetch real token balances using wagmi
  const { data: ethBalance, isLoading: ethBalanceLoading } = useBalance({
    address,
  })

  const { data: usdcBalance, isLoading: usdcBalanceLoading } = useBalance({
    address,
    token: USDC.address as `0x${string}`,
  })

  const { data: daiBalance, isLoading: daiBalanceLoading } = useBalance({
    address,
    token: DAI.address as `0x${string}`,
  })

  // Helper function to get balance for a specific token
  const getTokenBalance = (token: Token) => {
    if (!address) return { balance: '0', loading: false }
    
    switch (token.symbol) {
      case 'ETH':
        return {
          balance: ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : '0',
          loading: ethBalanceLoading
        }
      case 'USDC':
        return {
          balance: usdcBalance ? parseFloat(usdcBalance.formatted).toFixed(2) : '0',
          loading: usdcBalanceLoading
        }
      case 'DAI':
        return {
          balance: daiBalance ? parseFloat(daiBalance.formatted).toFixed(4) : '0',
          loading: daiBalanceLoading
        }
      default:
        return { balance: '0', loading: false }
    }
  }

  // Get balances for current tokens
  const fromTokenBalance = getTokenBalance(swapState.fromToken)
  const toTokenBalance = getTokenBalance(swapState.toToken)

  // Filter and sort chains
  const filteredChains = SWAP_CHAINS.filter(chain => {
    if (debouncedSearch) {
      return chain.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    }
    if (activeFilter === 'testnet') {
      return chain.name.toLowerCase().includes('sepolia') || chain.name.toLowerCase().includes('testnet')
    }
    if (activeFilter === 'evm') {
      return true // All our chains are EVM
    }
    return true
  }).sort((a, b) => {
    if (sort === 'A-Z') return a.name.localeCompare(b.name)
    if (sort === 'Z-A') return b.name.localeCompare(a.name)
    return 0 // Default order
  })

  // Calculate price and toAmount when fromAmount changes
  useEffect(() => {
    if (swapState.fromAmount && parseFloat(swapState.fromAmount) > 0) {
      // Mock price calculation (in real app, this would come from DEX API)
      const mockPrice = 1800 // 1 ETH = 1800 USDC
      const calculatedAmount = (parseFloat(swapState.fromAmount) * mockPrice).toFixed(6)
      setSwapState(prev => ({
        ...prev,
        toAmount: calculatedAmount,
        price: mockPrice
      }))
    } else {
      setSwapState(prev => ({
        ...prev,
        toAmount: '',
        price: 0
      }))
    }
  }, [swapState.fromAmount, swapState.fromToken, swapState.toToken])

  // Handle token selection
  const selectToken = (token: Token, type: 'from' | 'to') => {
    if (type === 'from') {
      setSwapState(prev => ({ ...prev, fromToken: token }))
      setShowFromTokenSelector(false)
    } else {
      setSwapState(prev => ({ ...prev, toToken: token }))
      setShowToTokenSelector(false)
    }
  }

  // Handle chain selection
  const selectChain = (chain: Chain) => {
    if (networkSelectorDirection === 'from') {
      setSwapState(prev => ({ ...prev, fromChain: chain }))
    } else {
      setSwapState(prev => ({ ...prev, toChain: chain }))
    }
    setShowNetworkSelector(false)
  }

  // Handle token swap (toggle positions)
  const swapTokens = () => {
    setSwapState(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromChain: prev.toChain,
      toChain: prev.fromChain,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }))
  }

  // Handle swap execution
  const executeSwap = async () => {
    if (!isConnected) return

    // Check if user has sufficient balance
    const currentBalance = parseFloat(fromTokenBalance.balance)
    const swapAmount = parseFloat(swapState.fromAmount)
    
    if (swapAmount > currentBalance) {
      setSwapState(prev => ({ 
        ...prev, 
        error: `Insufficient ${swapState.fromToken.symbol} balance. You have ${currentBalance} ${swapState.fromToken.symbol}` 
      }))
      return
    }

    setSwapState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate swap transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSwapState(prev => ({ 
        ...prev, 
        loading: false, 
        success: true,
        fromAmount: '',
        toAmount: ''
      }))

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSwapState(prev => ({ ...prev, success: false }))
      }, 3000)

    } catch (error) {
      setSwapState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Swap failed. Please try again.' 
      }))
    }
  }

  // Get button text based on state
  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet'
    if (swapState.loading) return 'Swapping...'
    if (!swapState.fromAmount || parseFloat(swapState.fromAmount) <= 0) return 'Enter an amount'
    
    // Check if user has sufficient balance
    const currentBalance = parseFloat(fromTokenBalance.balance)
    const swapAmount = parseFloat(swapState.fromAmount)
    
    if (swapAmount > currentBalance) {
      return `Insufficient ${swapState.fromToken.symbol} balance`
    }
    
    return `Swap ${swapState.fromAmount} ${swapState.fromToken.symbol} for ${swapState.toAmount} ${swapState.toToken.symbol}`
  }

  // Check if swap is possible
  const canSwap = isConnected && 
    swapState.fromAmount && 
    parseFloat(swapState.fromAmount) > 0 && 
    parseFloat(swapState.fromAmount) <= parseFloat(fromTokenBalance.balance) && 
    !swapState.loading

  return (
    <div className="relative">
      {/* Network Selector Modal */}
      <AnimatePresence>
        {showNetworkSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowNetworkSelector(false)}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Select {networkSelectorDirection === 'from' ? 'Source' : 'Destination'} Network
                  </h2>
                  <button
                    onClick={() => setShowNetworkSelector(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <motion.div
                variants={searchContainer}
                className="p-6 border-b border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    variants={searchInput}
                    className="relative flex-1"
                  >
                    <div className="flex items-center w-full h-12 bg-gray-50 rounded-xl pl-4 pr-4">
                      <Search className="w-5 h-5 text-gray-400 mr-3" />
                      <Input
                        placeholder="Search networks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900"
                        onFocus={() => setIsSearching(true)}
                      />
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          className="ml-2 p-1 rounded-full hover:bg-gray-200"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </motion.div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSort(sort === 'A-Z' ? 'Z-A' : sort === 'Z-A' ? 'Default' : 'A-Z')}
                    className="flex items-center gap-2"
                  >
                    <SortAsc className="w-4 h-4" />
                    {sort}
                  </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mt-4">
                  {['all', 'evm', 'testnet'].map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFilter(filter as any)}
                      className="capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Chain Grid */}
              <div className="p-6 overflow-y-auto max-h-96">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {filteredChains.map((chain) => (
                    <ChainCard
                      key={chain.id}
                      chain={chain}
                      onSelect={() => selectChain(chain)}
                      isSelected={
                        (networkSelectorDirection === 'from' && chain.id === swapState.fromChain.id) ||
                        (networkSelectorDirection === 'to' && chain.id === swapState.toChain.id)
                      }
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Swap Interface */}
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Swap</h2>
            <button
              onClick={() => setShowSlippageSettings(!showSlippageSettings)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slippage Settings */}
        {showSlippageSettings && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Slippage tolerance</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSwapState(prev => ({ ...prev, slippage: 0.5 }))}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    swapState.slippage === 0.5 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  0.5%
                </button>
                <button
                  onClick={() => setSwapState(prev => ({ ...prev, slippage: 1 }))}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    swapState.slippage === 1 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  1%
                </button>
                <button
                  onClick={() => setSwapState(prev => ({ ...prev, slippage: 2 }))}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    swapState.slippage === 2 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  2%
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Swap Interface */}
        <div className="p-6 space-y-4">
          {/* From Token Input */}
          <div className="bg-gray-50 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">You pay</span>
              <div className="flex items-center gap-2">
                {fromTokenBalance.loading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                ) : (
                  <span className="text-xs text-gray-500">
                    Balance: {fromTokenBalance.balance} {swapState.fromToken.symbol}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="0.0"
                value={swapState.fromAmount}
                onChange={(e) => setSwapState(prev => ({ ...prev, fromAmount: e.target.value }))}
                className="flex-1 text-2xl font-semibold bg-transparent border-none p-0 focus:ring-0 focus:outline-none"
              />
              <div className="relative">
                <button
                  onClick={() => setShowFromTokenSelector(!showFromTokenSelector)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <img 
                    src={swapState.fromToken.image} 
                    alt={swapState.fromToken.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-gray-900">{swapState.fromToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Token Selector Dropdown - From */}
                <AnimatePresence>
                  {showFromTokenSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">Select token</h3>
                          <button
                            onClick={() => setShowFromTokenSelector(false)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <Input
                          type="text"
                          placeholder="Search by name or paste address"
                          className="w-full text-sm"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {SWAP_TOKENS.map((token) => {
                          const tokenBalance = getTokenBalance(token)
                          return (
                            <button
                              key={token.symbol}
                              onClick={() => selectToken(token, 'from')}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                            >
                              <img 
                                src={token.image} 
                                alt={token.symbol}
                                className="w-6 h-6 rounded-full"
                              />
                              <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 text-sm">{token.symbol}</div>
                                <div className="text-xs text-gray-500">{token.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {tokenBalance.loading ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                                  ) : (
                                    `${tokenBalance.balance} ${token.symbol}`
                                  )}
                                </div>
                              </div>
                              {swapState.fromToken.symbol === token.symbol && (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Network Display */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">on</span>
              <button
                onClick={() => {
                  setNetworkSelectorDirection('from')
                  setShowNetworkSelector(true)
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <img 
                  src={swapState.fromChain.icon} 
                  alt={swapState.fromChain.name}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs font-medium text-gray-700">{swapState.fromChain.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Swap Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={swapTokens}
              disabled={swapState.loading}
              className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To Token Input */}
          <div className="bg-gray-50 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">You receive</span>
              <div className="flex items-center gap-2">
                {toTokenBalance.loading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                ) : (
                  <span className="text-xs text-gray-500">
                    Balance: {toTokenBalance.balance} {swapState.toToken.symbol}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="0.0"
                value={swapState.toAmount}
                readOnly
                className="flex-1 text-2xl font-semibold bg-transparent border-none p-0 focus:ring-0 focus:outline-none"
              />
              <div className="relative">
                <button
                  onClick={() => setShowToTokenSelector(!showToTokenSelector)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <img 
                    src={swapState.toToken.image} 
                    alt={swapState.toToken.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-gray-900">{swapState.toToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Token Selector Dropdown - To */}
                <AnimatePresence>
                  {showToTokenSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">Select token</h3>
                          <button
                            onClick={() => setShowToTokenSelector(false)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <Input
                          type="text"
                          placeholder="Search by name or paste address"
                          className="w-full text-sm"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {SWAP_TOKENS.map((token) => {
                          const tokenBalance = getTokenBalance(token)
                          return (
                            <button
                              key={token.symbol}
                              onClick={() => selectToken(token, 'to')}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                            >
                              <img 
                                src={token.image} 
                                alt={token.symbol}
                                className="w-6 h-6 rounded-full"
                              />
                              <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 text-sm">{token.symbol}</div>
                                <div className="text-xs text-gray-500">{token.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {tokenBalance.loading ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                                  ) : (
                                    `${tokenBalance.balance} ${token.symbol}`
                                  )}
                                </div>
                              </div>
                              {swapState.toToken.symbol === token.symbol && (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Network Display */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">on</span>
              <button
                onClick={() => {
                  setNetworkSelectorDirection('to')
                  setShowNetworkSelector(true)
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <img 
                  src={swapState.toChain.icon} 
                  alt={swapState.toChain.name}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs font-medium text-gray-700">{swapState.toChain.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Price Information */}
          {swapState.price > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rate</span>
                <span className="text-gray-900">
                  1 {swapState.fromToken.symbol} = {swapState.price.toLocaleString()} {swapState.toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Slippage</span>
                <span className="text-gray-900">{swapState.slippage}%</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {swapState.error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{swapState.error}</span>
            </div>
          )}

          {/* Success Message */}
          {swapState.success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Swap completed successfully!</span>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={executeSwap}
            disabled={!canSwap}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              canSwap
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {swapState.loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Swapping...
              </div>
            ) : (
              getButtonText()
            )}
          </Button>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By swapping, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chain Card Component
function ChainCard({ 
  chain, 
  onSelect, 
  isSelected 
}: { 
  chain: Chain
  onSelect: () => void
  isSelected: boolean
}) {
  return (
    <motion.div
      variants={chainCard}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`relative w-full aspect-[3.25/4] cursor-pointer overflow-hidden rounded-2xl shadow-sm ${chain.theme.card.className}`}
    >
      {/* Background Overlay */}
      {chain.theme.card.overlay?.image ? (
        <Image
          src={chain.theme.card.overlay.image}
          alt={chain.name}
          fill
          className={chain.theme.card.overlay.className}
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
        />
      ) : (
        <div className={chain.theme.card.overlay?.className || 'absolute inset-0'} />
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-3 py-6 h-full relative z-10">
        <Image
          src={chain.icon}
          alt={chain.name}
          width={64}
          height={64}
          className="w-16 h-16 mb-4"
        />
        <h3 className={`text-sm text-center font-medium ${chain.theme.title}`}>
          {chain.name}
        </h3>
        
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-5 h-5 text-white bg-blue-600 rounded-full" />
          </div>
        )}
      </div>
    </motion.div>
  )
} 