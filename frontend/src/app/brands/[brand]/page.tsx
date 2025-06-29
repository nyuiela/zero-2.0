"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Car, 
  Gavel, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  DollarSign,
  Activity
} from 'lucide-react'

interface BrandDetail {
  name: string
  admin: string
  isActive: boolean
  totalCars: number
  totalAuctions: number
  totalBids: number
  createdAt: string
  description: string
  location: string
  website: string
  contactEmail: string
  recentCars: Array<{
    id: string
    model: string
    year: number
    price: number
    status: string
  }>
  recentAuctions: Array<{
    id: string
    title: string
    endDate: string
    currentBid: number
    totalBids: number
    status: string
  }>
  stats: {
    monthlyRevenue: number
    averageCarPrice: number
    successRate: number
    totalUsers: number
  }
}

export default function BrandDetailPage() {
  const params = useParams()
  const brandName = params.brand as string
  const [brand, setBrand] = useState<BrandDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrandDetail()
  }, [brandName])

  const fetchBrandDetail = async () => {
    try {
      setLoading(true)
      
      // Mock brand detail data
      const mockBrandDetail: BrandDetail = {
        name: brandName.charAt(0).toUpperCase() + brandName.slice(1),
        admin: '0x1234...5678',
        isActive: true,
        totalCars: 45,
        totalAuctions: 23,
        totalBids: 156,
        createdAt: '2024-01-15',
        description: `${brandName.charAt(0).toUpperCase() + brandName.slice(1)} is a leading automotive brand known for innovation, quality, and reliability. We specialize in creating vehicles that combine cutting-edge technology with timeless design.`,
        location: 'Munich, Germany',
        website: `https://www.${brandName.toLowerCase()}.com`,
        contactEmail: `contact@${brandName.toLowerCase()}.com`,
        recentCars: [
          { id: '1', model: 'X5', year: 2024, price: 75000, status: 'Available' },
          { id: '2', model: '3 Series', year: 2023, price: 45000, status: 'Sold' },
          { id: '3', model: 'M3', year: 2024, price: 85000, status: 'Auction' },
          { id: '4', model: 'X3', year: 2023, price: 55000, status: 'Available' },
        ],
        recentAuctions: [
          { id: '1', title: '2024 X5 M Competition', endDate: '2024-12-15', currentBid: 85000, totalBids: 12, status: 'Active' },
          { id: '2', title: '2023 M3 Competition', endDate: '2024-12-10', currentBid: 78000, totalBids: 8, status: 'Active' },
          { id: '3', title: '2024 X3 M40i', endDate: '2024-12-05', currentBid: 65000, totalBids: 15, status: 'Ended' },
        ],
        stats: {
          monthlyRevenue: 1250000,
          averageCarPrice: 65000,
          successRate: 94.5,
          totalUsers: 2847
        }
      }

      setBrand(mockBrandDetail)
    } catch (error) {
      console.error('Error fetching brand detail:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00296b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brand details...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
          <p className="text-gray-600 mb-6">The brand you're looking for doesn't exist.</p>
          <Link href="/brands">
            <Button className="bg-[#00296b] hover:bg-[#00296b]/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Brands
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/brands">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Brands
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
              <p className="text-gray-600">{brand.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Car className="h-8 w-8 text-[#00296b]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{brand.totalCars}</p>
                  <p className="text-sm text-gray-600">Total Cars</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Gavel className="h-8 w-8 text-[#00296b]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{brand.totalAuctions}</p>
                  <p className="text-sm text-gray-600">Total Auctions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-[#00296b]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{brand.stats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-[#00296b]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{brand.stats.successRate}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Brand Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand Information */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{brand.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Founded</p>
                      <p className="text-sm text-gray-600">{brand.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <Badge variant={brand.isActive ? "default" : "secondary"}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Avg. Car Price</p>
                      <p className="text-sm text-gray-600">${brand.stats.averageCarPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">{brand.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Cars and Auctions */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cars" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cars">Recent Cars</TabsTrigger>
                    <TabsTrigger value="auctions">Recent Auctions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cars" className="mt-6">
                    <div className="space-y-4">
                      {brand.recentCars.map((car) => (
                        <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{car.model}</h4>
                            <p className="text-sm text-gray-600">{car.year}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${car.price.toLocaleString()}</p>
                            <Badge variant={car.status === 'Available' ? 'default' : 'secondary'}>
                              {car.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="auctions" className="mt-6">
                    <div className="space-y-4">
                      {brand.recentAuctions.map((auction) => (
                        <div key={auction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{auction.title}</h4>
                            <p className="text-sm text-gray-600">Ends: {auction.endDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${auction.currentBid.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{auction.totalBids} bids</p>
                            <Badge variant={auction.status === 'Active' ? 'default' : 'secondary'}>
                              {auction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Stats */}
          <div className="space-y-6">
            {/* Financial Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-medium text-gray-900">${(brand.stats.monthlyRevenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Car Price</span>
                  <span className="font-medium text-gray-900">${brand.stats.averageCarPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-medium text-gray-900">{brand.stats.successRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <a href={brand.website} className="text-sm text-[#00296b] hover:underline" target="_blank" rel="noopener noreferrer">
                    {brand.website}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a href={`mailto:${brand.contactEmail}`} className="text-sm text-[#00296b] hover:underline">
                    {brand.contactEmail}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{brand.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#00296b] hover:bg-[#00296b]/90">
                  View All Cars
                </Button>
                <Button variant="outline" className="w-full">
                  View All Auctions
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Brand
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 