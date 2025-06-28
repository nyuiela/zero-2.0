'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  ExternalLink,
  Shield,
  Car,
  Gavel,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Wallet,
  Eye
} from 'lucide-react'
import { useAuthStore } from '@/lib/authStore'
import { ProofModal } from '@/components/proof-modal'

interface ProofData {
  receipt: {
    inner: {
      Fake: {
        claim: {
          Value: {
            exit_code: {
              Halted: number
            }
            input: {
              Pruned: number[]
            }
            output: {
              Value: {
                assumptions: {
                  Value: unknown[]
                }
                journal: {
                  Value: number[]
                }
              }
            }
            post: {
              Value: {
                merkle_root: number[]
                pc: number
              }
            }
            pre: {
              Value: {
                merkle_root: number[]
                pc: number
              }
            }
          }
        }
      }
    }
    journal: {
      bytes: number[]
    }
    metadata: {
      verifier_parameters: number[]
    }
  }
  stats: {
    paging_cycles: number
    reserved_cycles: number
    segments: number
    total_cycles: number
    user_cycles: number
  }
}

interface Proof {
  id: string
  type: 'car_listing' | 'bid_verification' | 'seller_verification' | 'purchase_verification' | 'brand_registration'
  transactionHash: string
  timestamp: number
  status: 'generating' | 'completed' | 'failed'
  proofData: ProofData
  metadata: {
    description: string
    carId?: string
    auctionId?: string
    username?: string
    brandName?: string
    amount?: string
  }
}

export default function VerifyPage() {
  const [proofs, setProofs] = useState<Proof[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null)
  const [showProofModal, setShowProofModal] = useState(false)
  const { user } = useAuthStore()

  // Enhanced mock data with realistic proof data
  useEffect(() => {
    const mockProofs: Proof[] = [
      {
        id: '1',
        type: 'brand_registration',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        timestamp: Date.now() - 86400000, // 1 day ago
        status: 'completed',
        proofData: {
          receipt: {
            inner: {
              Fake: {
                claim: {
                  Value: {
                    exit_code: {
                      Halted: 0
                    },
                    input: {
                      Pruned: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    output: {
                      Value: {
                        assumptions: {
                          Value: []
                        },
                        journal: {
                          Value: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
                        }
                      }
                    },
                    post: {
                      Value: {
                        merkle_root: [0, 0, 0, 0, 0, 0, 0, 0],
                        pc: 0
                      }
                    },
                    pre: {
                      Value: {
                        merkle_root: [1355755649, 145095981, 1945602564, 1827369077, 346262116, 1637052400, 1857755399, 1497292232],
                        pc: 0
                      }
                    }
                  }
                }
              }
            },
            journal: {
              bytes: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
            },
            metadata: {
              verifier_parameters: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          stats: {
            paging_cycles: 227651,
            reserved_cycles: 519606,
            segments: 10,
            total_cycles: 9961472,
            user_cycles: 9214215
          }
        },
        metadata: {
          description: 'Zero-knowledge proof for Toyota brand registration',
          brandName: 'Toyota',
          username: 'toyota_admin'
        }
      },
      {
        id: '2',
        type: 'car_listing',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        timestamp: Date.now() - 43200000, // 12 hours ago
        status: 'completed',
        proofData: {
          receipt: {
            inner: {
              Fake: {
                claim: {
                  Value: {
                    exit_code: {
                      Halted: 0
                    },
                    input: {
                      Pruned: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    output: {
                      Value: {
                        assumptions: {
                          Value: []
                        },
                        journal: {
                          Value: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
                        }
                      }
                    },
                    post: {
                      Value: {
                        merkle_root: [0, 0, 0, 0, 0, 0, 0, 0],
                        pc: 0
                      }
                    },
                    pre: {
                      Value: {
                        merkle_root: [1355755649, 145095981, 1945602564, 1827369077, 346262116, 1637052400, 1857755399, 1497292232],
                        pc: 0
                      }
                    }
                  }
                }
              }
            },
            journal: {
              bytes: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
            },
            metadata: {
              verifier_parameters: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          stats: {
            paging_cycles: 185432,
            reserved_cycles: 456789,
            segments: 8,
            total_cycles: 8234567,
            user_cycles: 7592346
          }
        },
        metadata: {
          description: 'Zero-knowledge proof for car listing verification',
          carId: 'CAR001',
          auctionId: 'AUCTION001',
          username: 'supercar_dealer'
        }
      },
      {
        id: '3',
        type: 'purchase_verification',
        transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: 'completed',
        proofData: {
          receipt: {
            inner: {
              Fake: {
                claim: {
                  Value: {
                    exit_code: {
                      Halted: 0
                    },
                    input: {
                      Pruned: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    output: {
                      Value: {
                        assumptions: {
                          Value: []
                        },
                        journal: {
                          Value: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
                        }
                      }
                    },
                    post: {
                      Value: {
                        merkle_root: [0, 0, 0, 0, 0, 0, 0, 0],
                        pc: 0
                      }
                    },
                    pre: {
                      Value: {
                        merkle_root: [1355755649, 145095981, 1945602564, 1827369077, 346262116, 1637052400, 1857755399, 1497292232],
                        pc: 0
                      }
                    }
                  }
                }
              }
            },
            journal: {
              bytes: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
            },
            metadata: {
              verifier_parameters: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          stats: {
            paging_cycles: 156789,
            reserved_cycles: 345678,
            segments: 6,
            total_cycles: 7123456,
            user_cycles: 6620989
          }
        },
        metadata: {
          description: 'Purchase transaction verification proof',
          carId: 'CAR002',
          amount: '2.5 ETH',
          username: user?.username || 'user123'
        }
      },
      {
        id: '4',
        type: 'seller_verification',
        transactionHash: '0x5555555555555555555555555555555555555555555555555555555555555555',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        status: 'completed',
        proofData: {
          receipt: {
            inner: {
              Fake: {
                claim: {
                  Value: {
                    exit_code: {
                      Halted: 0
                    },
                    input: {
                      Pruned: [0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    output: {
                      Value: {
                        assumptions: {
                          Value: []
                        },
                        journal: {
                          Value: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
                        }
                      }
                    },
                    post: {
                      Value: {
                        merkle_root: [0, 0, 0, 0, 0, 0, 0, 0],
                        pc: 0
                      }
                    },
                    pre: {
                      Value: {
                        merkle_root: [1355755649, 145095981, 1945602564, 1827369077, 346262116, 1637052400, 1857755399, 1497292232],
                        pc: 0
                      }
                    }
                  }
                }
              }
            },
            journal: {
              bytes: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
            },
            metadata: {
              verifier_parameters: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          stats: {
            paging_cycles: 198765,
            reserved_cycles: 432109,
            segments: 7,
            total_cycles: 8765432,
            user_cycles: 8135118
          }
        },
        metadata: {
          description: 'Seller identity verification proof',
          username: 'premium_seller'
        }
      }
    ]

    setProofs(mockProofs)
    setLoading(false)
  }, [user?.username])

  const filteredProofs = proofs.filter(proof => {
    const matchesSearch =
      proof.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.metadata.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.metadata.carId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.metadata.brandName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === 'all' || proof.type === filterType

    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'generating':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'generating':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Generating</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brand_registration':
        return <Shield className="h-5 w-5 text-blue-500" />
      case 'car_listing':
        return <Car className="h-5 w-5 text-green-500" />
      case 'purchase_verification':
        return <Wallet className="h-5 w-5 text-purple-500" />
      case 'seller_verification':
        return <UserCheck className="h-5 w-5 text-orange-500" />
      case 'bid_verification':
        return <Gavel className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const openBlockExplorer = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank')
  }

  const handleViewProof = (proof: Proof) => {
    setSelectedProof(proof)
    setShowProofModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading proof explorer...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background lg:mx-[10rem] xl:mx-[20rem]">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Proof Explorer</h1>
            <p className="text-gray-400">Explore and verify zero-knowledge proofs for all transactions</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by transaction hash, description, or metadata..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-700 text-black"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-amber-600 text-white' : 'text-black'}
              >
                All
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilterType('brand_registration')}
                className={filterType === 'brand_registration' ? 'bg-amber-600 text-white' : 'text-black'}
              >
                Brand Registration
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilterType('car_listing')}
                className={filterType === 'car_listing' ? 'bg-amber-600 text-white' : 'text-black'}
              >
                Car Listings
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilterType('purchase_verification')}
                className={filterType === 'purchase_verification' ? 'bg-amber-600 text-white' : 'text-black'}
              >
                Purchases
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilterType('seller_verification')}
                className={filterType === 'seller_verification' ? 'bg-amber-600 text-white' : 'text-black'}
              >
                Seller Verification
              </Button>
            </div>
          </div>

          {/* Proofs List */}
          <div className="space-y-4">
            {filteredProofs.map((proof) => (
              <Card key={proof.id} className="bg-white border-gray-300 shadow-sm text-black rounded-lg hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(proof.type)}
                      <div>
                        <CardTitle className="text-black capitalize text-lg">
                          {proof.type.replace('_', ' ')}
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-sm">
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
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Description:</p>
                      <p className="text-black font-medium">{proof.metadata.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Transaction Hash:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
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
                          <p className="text-gray-600 text-sm mb-1">Username:</p>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {proof.metadata.username}
                          </code>
                        </div>
                      )}

                      {proof.metadata.brandName && (
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Brand:</p>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {proof.metadata.brandName}
                          </code>
                        </div>
                      )}

                      {proof.metadata.carId && (
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Car ID:</p>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {proof.metadata.carId}
                          </code>
                        </div>
                      )}

                      {proof.metadata.amount && (
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Amount:</p>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {proof.metadata.amount}
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Proof Statistics */}
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Proof Statistics:</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-600">Total Cycles</p>
                          <p className="font-mono text-sm font-semibold text-blue-700">
                            {proof.proofData.stats.total_cycles.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-600">User Cycles</p>
                          <p className="font-mono text-sm font-semibold text-green-700">
                            {proof.proofData.stats.user_cycles.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-600">Segments</p>
                          <p className="font-mono text-sm font-semibold text-purple-700">
                            {proof.proofData.stats.segments}
                          </p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-600">Paging Cycles</p>
                          <p className="font-mono text-sm font-semibold text-orange-700">
                            {proof.proofData.stats.paging_cycles.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-600">Reserved Cycles</p>
                          <p className="font-mono text-sm font-semibold text-red-700">
                            {proof.proofData.stats.reserved_cycles.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleViewProof(proof)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Full Proof
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openBlockExplorer(proof.transactionHash)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Etherscan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProofs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No proofs found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Proof Modal */}
      <ProofModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        proof={selectedProof?.proofData || null}
        transactionHash={selectedProof?.transactionHash}
      />
    </>
  )
} 