"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAccount } from 'wagmi'
import { Car, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'

interface Brand {
  name: string
  admin: string
  isActive: boolean
  totalCars: number
  totalAuctions: number
  totalBids: number
  createdAt: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [userBrands, setUserBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const { address } = useAccount()

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
          name: 'Toyota',
          admin: '0x1234...5678',
          isActive: true,
          totalCars: 45,
          totalAuctions: 23,
          totalBids: 156,
          createdAt: '2024-01-15'
        },
        {
          name: 'BMW',
          admin: '0x8765...4321',
          isActive: true,
          totalCars: 32,
          totalAuctions: 18,
          totalBids: 98,
          createdAt: '2024-02-20'
        },
        {
          name: 'Mercedes',
          admin: '0x1111...2222',
          isActive: true,
          totalCars: 28,
          totalAuctions: 15,
          totalBids: 87,
          createdAt: '2024-01-30'
        },
        {
          name: 'Audi',
          admin: '0x3333...4444',
          isActive: false,
          totalCars: 22,
          totalAuctions: 12,
          totalBids: 65,
          createdAt: '2024-03-10'
        },
        {
          name: 'Honda',
          admin: '0x5555...6666',
          isActive: true,
          totalCars: 18,
          totalAuctions: 9,
          totalBids: 43,
          createdAt: '2024-02-05'
        },
        {
          name: 'Tesla',
          admin: '0x7777...8888',
          isActive: true,
          totalCars: 15,
          totalAuctions: 8,
          totalBids: 38,
          createdAt: '2024-03-15'
        }
      ]

      setBrands(mockBrands)
      
      // Filter user's brands (mock - in real implementation, check against user's address)
      if (address) {
        const userBrands = mockBrands.filter(brand => 
          brand.admin.toLowerCase() === address.toLowerCase()
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00296b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brands...</p>
        </div>
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
            <Button className="bg-[#7400b8] text-white hover:bg-[#7400b8]/80">
              Register Brand
            </Button>
          </div>
        </div>
      </div>

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
                    <Card key={brand.name} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                          <Badge variant={brand.isActive ? "default" : "secondary"}>
                            {brand.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>Cars: {brand.totalCars}</p>
                          <p>Auctions: {brand.totalAuctions}</p>
                          <p>Total Bids: {brand.totalBids}</p>
                        </div>
                        <Link href={`/brands/${brand.name.toLowerCase()}`}>
                          <Button variant="outline" size="sm" className="mt-4 w-full hover:bg-[#7500b898]">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
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
                  <Card key={brand.name} className="hover:shadow-lg border-none bg-white transition-shadow">
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                        <Badge variant={brand.isActive ? "default" : "secondary"}>
                          {brand.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Cars: {brand.totalCars}</p>
                        <p>Auctions: {brand.totalAuctions}</p>
                        <p>Total Bids: {brand.totalBids}</p>
                      </div>
                      <Link href={`/brands/${brand.name.toLowerCase()}`}>
                        <Button variant="outline" size="sm" className="mt-4 w-full bg-[#7400b8] hover:bg-blue-900 text-white">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
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
                            className="bg-[#7400b8] h-2 rounded-full" 
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