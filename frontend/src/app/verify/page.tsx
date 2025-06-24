'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Shield, 
  Car, 
  Gavel, 
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Hash,
  Calendar,
  Wallet
} from 'lucide-react'
import { useAuthStore } from '@/lib/authStore'
import { useAccount } from 'wagmi'

interface Transaction {
  id: string
  type: 'purchase' | 'listing' | 'bid' | 'verification' | 'seller_registration'
  hash: string
  blockNumber: number
  timestamp: number
  from: string
  to: string
  value?: string
  status: 'pending' | 'confirmed' | 'failed'
  proof?: {
    receipt: any
    stats: any
  }
  metadata?: {
    carId?: string
    auctionId?: string
    sellerAddress?: string
    buyerAddress?: string
    amount?: string
    username?: string
  }
}

interface Proof {
  id: string
  type: 'car_listing' | 'bid_verification' | 'seller_verification' | 'purchase_verification'
  transactionHash: string
  timestamp: number
  status: 'generating' | 'completed' | 'failed'
  receipt?: any
  stats?: any
  metadata: {
    description: string
    carId?: string
    auctionId?: string
    username?: string
  }
}

export default function VerifyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [proofs, setProofs] = useState<Proof[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const { address } = useAccount()

  // Mock data for demonstration
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'seller_registration',
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        blockNumber: 12345678,
        timestamp: Date.now() - 86400000, // 1 day ago
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0xContractAddress1234567890abcdef1234567890abcdef',
        status: 'confirmed',
        metadata: {
          sellerAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          username: 'supercar_dealer'
        }
      },
      {
        id: '2',
        type: 'listing',
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        blockNumber: 12345679,
        timestamp: Date.now() - 43200000, // 12 hours ago
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0xContractAddress1234567890abcdef1234567890abcdef',
        status: 'confirmed',
        proof: {
          receipt: { mock: true },
          stats: { segments: 1, total_cycles: 1000 }
        },
        metadata: {
          carId: 'CAR001',
          auctionId: 'AUCTION001',
          sellerAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
        }
      },
      {
        id: '3',
        type: 'purchase',
        hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        blockNumber: 12345680,
        timestamp: Date.now() - 3600000, // 1 hour ago
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0xContractAddress1234567890abcdef1234567890abcdef',
        value: '2.5 ETH',
        status: 'confirmed',
        metadata: {
          carId: 'CAR002',
          buyerAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          amount: '2.5 ETH'
        }
      },
      {
        id: '4',
        type: 'verification',
        hash: '0x5555555555555555555555555555555555555555555555555555555555555555',
        blockNumber: 12345681,
        timestamp: Date.now() - 1800000, // 30 minutes ago
        from: address || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0xContractAddress1234567890abcdef1234567890abcdef',
        status: 'confirmed',
        proof: {
          receipt: { mock: true },
          stats: { segments: 1, total_cycles: 1500 }
        },
        metadata: {
          username: user?.username || 'user123'
        }
      }
    ]

    const mockProofs: Proof[] = [
      {
        id: '1',
        type: 'car_listing',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        timestamp: Date.now() - 43200000,
        status: 'completed',
        receipt: { mock: true },
        stats: { segments: 1, total_cycles: 1000 },
        metadata: {
          description: 'Zero-knowledge proof for car listing verification',
          carId: 'CAR001',
          auctionId: 'AUCTION001'
        }
      },
      {
        id: '2',
        type: 'bid_verification',
        transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        timestamp: Date.now() - 3600000,
        status: 'completed',
        receipt: { mock: true },
        stats: { segments: 1, total_cycles: 800 },
        metadata: {
          description: 'Bid verification proof for auction CAR002',
          carId: 'CAR002',
          auctionId: 'AUCTION002'
        }
      },
      {
        id: '3',
        type: 'seller_verification',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        timestamp: Date.now() - 86400000,
        status: 'completed',
        receipt: { mock: true },
        stats: { segments: 1, total_cycles: 1200 },
        metadata: {
          description: 'Seller identity verification proof',
          username: 'supercar_dealer'
        }
      },
      {
        id: '4',
        type: 'purchase_verification',
        transactionHash: '0x5555555555555555555555555555555555555555555555555555555555555555',
        timestamp: Date.now() - 1800000,
        status: 'completed',
        receipt: { mock: true },
        stats: { segments: 1, total_cycles: 1500 },
        metadata: {
          description: 'Purchase transaction verification proof',
          username: user?.username || 'user123'
        }
      }
    ]

    setTransactions(mockTransactions)
    setProofs(mockProofs)
    setLoading(false)
  }, [address, user])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Car className="h-4 w-4" />
      case 'listing': return <Gavel className="h-4 w-4" />
      case 'bid': return <Gavel className="h-4 w-4" />
      case 'verification': return <Shield className="h-4 w-4" />
      case 'seller_registration': return <UserCheck className="h-4 w-4" />
      default: return <Hash className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="default" className="bg-green-600">Confirmed</Badge>
      case 'pending': return <Badge variant="secondary">Pending</Badge>
      case 'failed': return <Badge variant="destructive">Failed</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.metadata?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  const filteredProofs = proofs.filter(proof => {
    const matchesSearch = proof.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proof.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proof.metadata.username?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const openBlockExplorer = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading block explorer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Block Explorer</h1>
          <p className="text-gray-400">Verify on-chain transactions and zero-knowledge proofs</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by transaction hash, address, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-700 text-black"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-amber-600 text-white' : 'text-black'}
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterType('purchase')}
              className={filterType === 'purchase' ? 'bg-amber-600 text-white' : 'text-black'}
            >
              Purchases
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterType('listing')}
              className={filterType === 'listing' ? 'bg-amber-600 text-white' : 'text-black'}
            >
              Listings
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterType('verification')}
              className={filterType === 'verification' ? 'bg-amber-600 text-white' : 'text-black'}
            >
              Verifications
            </Button>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions" className="text-black">Transactions</TabsTrigger>
            <TabsTrigger value="proofs" className="text-black">Zero-Knowledge Proofs</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <Card key={tx.id} className="bg-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <CardTitle className="text-white capitalize">{tx.type.replace('_', ' ')}</CardTitle>
                          <CardDescription className="text-gray-400">
                            Block #{tx.blockNumber} • {formatTimestamp(tx.timestamp)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Transaction Hash:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-white bg-gray-700 px-2 py-1 rounded">
                            {formatAddress(tx.hash)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBlockExplorer(tx.hash)}
                            className="text-amber-400 hover:text-amber-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">From:</p>
                        <code className="text-white bg-gray-700 px-2 py-1 rounded">
                          {formatAddress(tx.from)}
                        </code>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">To:</p>
                        <code className="text-white bg-gray-700 px-2 py-1 rounded">
                          {formatAddress(tx.to)}
                        </code>
                      </div>
                      {tx.value && (
                        <div>
                          <p className="text-gray-400 mb-1">Value:</p>
                          <code className="text-white bg-gray-700 px-2 py-1 rounded">
                            {tx.value}
                          </code>
                        </div>
                      )}
                      {tx.metadata?.username && (
                        <div>
                          <p className="text-gray-400 mb-1">Username:</p>
                          <code className="text-white bg-gray-700 px-2 py-1 rounded">
                            {tx.metadata.username}
                          </code>
                        </div>
                      )}
                      {tx.proof && (
                        <div className="md:col-span-2">
                          <p className="text-gray-400 mb-1">Zero-Knowledge Proof:</p>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proofs" className="mt-6">
            <div className="space-y-4">
              {filteredProofs.map((proof) => (
                <Card key={proof.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-amber-400" />
                        <div>
                          <CardTitle className="text-white capitalize">{proof.type.replace('_', ' ')}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {formatTimestamp(proof.timestamp)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(proof.status)}
                        {getStatusBadge(proof.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 mb-1">Description:</p>
                        <p className="text-white">{proof.metadata.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Transaction Hash:</p>
                          <div className="flex items-center gap-2">
                            <code className="text-white bg-gray-700 px-2 py-1 rounded">
                              {formatAddress(proof.transactionHash)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openBlockExplorer(proof.transactionHash)}
                              className="text-amber-400 hover:text-amber-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {proof.metadata.username && (
                          <div>
                            <p className="text-gray-400 mb-1">Username:</p>
                            <code className="text-white bg-gray-700 px-2 py-1 rounded">
                              {proof.metadata.username}
                            </code>
                          </div>
                        )}
                        {proof.metadata.carId && (
                          <div>
                            <p className="text-gray-400 mb-1">Car ID:</p>
                            <code className="text-white bg-gray-700 px-2 py-1 rounded">
                              {proof.metadata.carId}
                            </code>
                          </div>
                        )}
                        {proof.metadata.auctionId && (
                          <div>
                            <p className="text-gray-400 mb-1">Auction ID:</p>
                            <code className="text-white bg-gray-700 px-2 py-1 rounded">
                              {proof.metadata.auctionId}
                            </code>
                          </div>
                        )}
                      </div>
                      {proof.stats && (
                        <div>
                          <p className="text-gray-400 mb-1">Proof Statistics:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="bg-gray-700 p-2 rounded">
                              <p className="text-gray-400">Segments</p>
                              <p className="text-white font-mono">{proof.stats.segments}</p>
                            </div>
                            <div className="bg-gray-700 p-2 rounded">
                              <p className="text-gray-400">Total Cycles</p>
                              <p className="text-white font-mono">{proof.stats.total_cycles}</p>
                            </div>
                            <div className="bg-gray-700 p-2 rounded">
                              <p className="text-gray-400">User Cycles</p>
                              <p className="text-white font-mono">{proof.stats.user_cycles}</p>
                            </div>
                            <div className="bg-gray-700 p-2 rounded">
                              <p className="text-gray-400">Paging Cycles</p>
                              <p className="text-white font-mono">{proof.stats.paging_cycles}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 