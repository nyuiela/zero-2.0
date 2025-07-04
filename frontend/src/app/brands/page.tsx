"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAccount, useReadContract } from 'wagmi'
import { Car, TrendingUp, Users, Award, ArrowRight, Lock } from 'lucide-react'
import { profile } from 'console'
import { profile_abi, profile_addr, registry_abi, registry_addr } from '@/lib/abi/abi'
import { useRouter } from 'next/navigation'
import { BrandStatusBadge } from '@/components/brand-status-badge'
import { BrandRegistrationForm } from '@/components/brand-registration-form'

interface Brand {
  brand: string
  brandPermission: string
  ccip: string
  chainFunction: string
  lastUpdated: bigint | number | string
  locked: boolean
  merkleVerifier: string
  oracle: string
  state: string
  syncer: string
  url: string
  status: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [userBrands, setUserBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const { address } = useAccount()
  const profile = useReadContract({
    functionName: "getProfile",
    abi: profile_abi,
    address: profile_addr,
    account: address,
    args: ["lesscars1"],
  })
  const brandStatus = useReadContract({
    functionName: "getBrandinfo",
    abi: registry_abi,
    address: registry_addr,
    args: ["KALEEL"],
    account: address
  })
  const router = useRouter()
  console.log("Brand Status ", brandStatus)
  console.log("Profile ", profile)
  // Mock data for charts - in real implementation, this would come from API
  const popularBrandsData = [
    { name: 'Toyota', value: 45, color: '#8884d8' },
    { name: 'BMW', value: 32, color: '#82ca9d' },
    { name: 'Mercedes', value: 28, color: '#ffc658' },
    { name: 'Audi', value: 22, color: '#ff7300' },
    { name: 'Honda', value: 18, color: '#00C49F' },
  ]

  const auctionTrendsData = [
    { month: 'Jan', auctions: 12, bids: 45 },
    { month: 'Feb', auctions: 19, bids: 67 },
    { month: 'Mar', auctions: 15, bids: 52 },
    { month: 'Apr', auctions: 25, bids: 89 },
    { month: 'May', auctions: 22, bids: 76 },
    { month: 'Jun', auctions: 30, bids: 105 },
  ]

  const brandStatsData = [
    { name: 'Total Brands', value: 156, icon: Award },
    { name: 'Active Brands', value: 142, icon: TrendingUp },
    { name: 'Total Cars', value: 2847, icon: Car },
    { name: 'Total Users', value: 892, icon: Users },
  ]

  useEffect(() => {
    fetchBrands()
  }, [address])

  const fetchBrands = async () => {
    try {
      setLoading(true)

      // Mock brands data - in real implementation, this would come from contract/API
      const mockBrands: Brand[] = [
        {
          brand: "lesscars1",
          brandPermission: "0x108f8Df99A5edE55ddA08b545db5F6886dc61d74",
          ccip: "0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925",
          chainFunction: "0x1b88549cd82C06875766DF1F6c696c089afad628",
          lastUpdated: 1751336196,
          locked: false,
          status: "pending",
          merkleVerifier: "0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E",
          oracle: "0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C",
          state: "",
          syncer: "0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c",
          url: "https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1"
        },
        {
          brand: 'BMW',
          brandPermission: '0x8765ssf49982480130we241234r1831430114321',
          ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
          chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
          lastUpdated: 1751336196,
          locked: false,
          status: "in_progress",
          merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
          oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
          state: '',
          syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
          url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
        },
        {
          brand: 'Mercedes',
          brandPermission: '0x1111...2222',
          ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
          chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
          lastUpdated: 1751336196,
          locked: false,
          status: "submitted",
          merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
          oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
          state: '',
          syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
          url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
        },
        {
          brand: 'Audi',
          brandPermission: '0x3333...4444',
          ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
          chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
          lastUpdated: 1751336196,
          locked: false,
          status: "in_review",
          merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
          oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
          state: '',
          syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
          url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
        },
        {
          brand: 'Honda',
          brandPermission: '0x5555...6666',
          ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
          chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
          lastUpdated: 1751336196,
          locked: true,
          status: "failed",
          merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
          oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
          state: '',
          syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
          url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
        },
        {
          brand: 'Tesla',
          brandPermission: '0x7777...8888',
          ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
          chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
          lastUpdated: 1751336196,
          locked: false,
          status: "success",
          merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
          oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
          state: '',
          syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
          url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
        },
        {
          brand: 'Ferrari',
          brandPermission: '0x9999...aaaa',
          ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
          chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
          lastUpdated: 1751336196,
          locked: false,
          status: "expired",
          merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
          oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
          state: '',
          syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
          url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
        }
      ]

      setBrands(mockBrands)

      // Filter user's brands (mock - in real implementation, check against user's address)
      if (address) {
        const userBrands = mockBrands.filter(brand =>
          brand.brandPermission.toLowerCase() === address.toLowerCase()
        )
        setUserBrands(userBrands)
      }

    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-4xl text-amber-400 font-bold animate-pulse text-center">
          ZERO
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
              <p className="mt-2 text-gray-600">
                Discover and explore car brands on the platform
              </p>
            </div>
            <Button className="bg-[#00296b] text-white hover:bg-[#00296b]/90" onClick={() => setIsBrandModalOpen(true)}>
              Register Brand
            </Button>
          </div>
        </div>
      </div>

      {isBrandModalOpen && (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden">
          <div className="w-full p-2 flex justify-end bg-[#d6be8a]">
            <button className="text-2xl font-light cursor-pointer" onClick={() => setIsBrandModalOpen(false)}>&times;</button>
          </div>
          <div className="h-full overflow-y-auto px-4 py-6">
            <BrandRegistrationForm />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Brands Grid */}
          <div className="lg:col-span-2">
            {/* User's Brands Section */}
            {userBrands.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Brands</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBrands.map((brand) => (
                    <Card key={brand.brand} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4 relative">
                          <h3 className="text-lg font-semibold text-gray-900">{brand.brand}</h3>
                          <div className="flex items-center gap-2">
                            <BrandStatusBadge status={brand.status} />
                            {brand.locked && (
                              <Lock className="w-5 h-5 text-gray-400 absolute -top-2 -right-2 bg-white rounded-full p-1 shadow" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>Permission: <span className="break-all">{brand.brandPermission}</span></p>
                          <p>Oracle: <span className="break-all">{brand.oracle}</span></p>
                          <p>Last Updated: {typeof brand.lastUpdated === "bigint" ? Number(brand.lastUpdated) : brand.lastUpdated}</p>
                          <p>
                            Website:{" "}
                            <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              Visit
                            </a>
                          </p>
                        </div>
                        <Link href={`/brands/${brand.brand.toLowerCase()}`}>
                          <Button variant="outline" size="sm" className="mt-4 w-full">
                            View Details<ArrowRight className="ml-0 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Brands Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Brands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brands.map((brand) => (
                  <Card key={brand.brand} className="hover:shadow-lg border-none bg-white transition-shadow pb-0 overflow-hidden">
                    <CardContent className="bg-white p-5 py-0">
                      <div className="flex items-center justify-between mb-4 relative">
                        <h3 className="text-lg font-semibold text-gray-900">{brand.brand}</h3>
                        <div className="flex items-center gap-2">
                          <BrandStatusBadge status={brand.status} />
                          {brand.locked && (
                            <Lock className="w-5 h-5 text-gray-400 absolute -top-2 -right-2 bg-white rounded-full p-1 shadow" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Permission: <span className="break-all">{brand.brandPermission}</span></p>
                        <p>Oracle: <span className="break-all">{brand.oracle}</span></p>
                        <p>Last Updated: {typeof brand.lastUpdated === "bigint" ? Number(brand.lastUpdated) : brand.lastUpdated}</p>
                        <p>
                          Website:{" "}
                          <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            Visit
                          </a>
                        </p>
                      </div>
                    </CardContent>
                    <Link href={`/brands/${brand.brand.toLowerCase()}`}>
                      <Button variant="outline" size="sm" className="w-full text-black border-none shadow-none text-md hover:bg-[#00296b]/80 disabled:opacity-50 disabled:cursor-not-allowed py-2 cursor-pointer bg-gray-300 rounded-none text-xs hover:underline">
                        View Details <ArrowRight className="ml-0 h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Charts */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {brandStatsData.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.name} className='bg-white border-none'>
                    <CardContent className="p-4 text-center bg-white">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-[#00296b]" />
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.name}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Popular Brands Chart */}
            <Card className='bg-white'>
              <CardHeader>
                <CardTitle className="text-lg">Popular Brands</CardTitle>
              </CardHeader>
              <CardContent className='bg-white'>
                <div className="space-y-3">
                  {popularBrandsData.map((brand, index) => (
                    <div key={brand.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: brand.color }}
                        />
                        <span className="text-sm font-medium">{brand.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{brand.value} cars</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auction Trends Chart */}
            <Card className='bg-white'>
              <CardHeader>
                <CardTitle className="text-lg">Auction Trends</CardTitle>
              </CardHeader>
              <CardContent className='bg-white'>
                <div className="space-y-3">
                  {auctionTrendsData.slice(-3).map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{trend.month}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{trend.auctions} auctions</p>
                        <p className="text-xs text-gray-600">{trend.bids} bids</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Active Brands */}
            <Card className='bg-white'>
              <CardHeader>
                <CardTitle className="text-lg">Most Active Brands</CardTitle>
              </CardHeader>
              <CardContent className='bg-white'>
                <div className="space-y-3">
                  {popularBrandsData.slice(0, 5).map((brand) => (
                    <div key={brand.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{brand.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#00296b] h-2 rounded-full"
                            style={{ width: `${(brand.value / 45) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{brand.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 