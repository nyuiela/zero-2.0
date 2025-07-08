"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAccount, useReadContract } from 'wagmi'
import { Car, TrendingUp, Users, Award, ArrowRight, Lock, Filter, RefreshCw } from 'lucide-react'
import { profile_abi, profile_addr, registry_abi, registry_addr } from '@/lib/abi/abi'
import { useRouter } from 'next/navigation'
import { BrandStatusBadge } from '@/components/brand-status-badge'
import { BrandRegistrationForm } from '@/components/brand-registration-form'
import { useBrandsData, BrandData } from '@/hooks/useBrandsData'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BrandsPage() {
   const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
   const [statusFilter, setStatusFilter] = useState<string>('all')
   const [typeFilter, setTypeFilter] = useState<string>('all')
   const { address } = useAccount()
   const { brands, hostedBrands, activatedBrands, requestedBrands, isLoading, error, refetch } = useBrandsData()
   const router = useRouter()

   // Filter brands based on selected filters
   const filteredBrands = brands.filter(brand => {
      const matchesStatus = statusFilter === 'all' || brand.status === statusFilter
      const matchesType = typeFilter === 'all' || brand.type === typeFilter
      return matchesStatus && matchesType
   })

   // Filter user's brands (brands where user is the permission holder)
   const userBrands = brands.filter(brand =>
      brand.brandPermission?.toLowerCase() === address?.toLowerCase()
   )

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
      { name: 'Total Brands', value: brands.length, icon: Award },
      { name: 'Activated Brands', value: activatedBrands.length, icon: TrendingUp },
      { name: 'Requested Brands', value: requestedBrands.length, icon: Car },
      { name: 'Hosted Brands', value: hostedBrands.length, icon: Users },
   ]

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00296b] mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading brands...</p>
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <p className="text-red-600 mb-4">Error loading brands</p>
               <Button onClick={() => refetch()} className="bg-[#00296b] text-white">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
               </Button>
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
                  {/* Filters */}
                  <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                     <div className="flex items-center gap-4">

                        <input type="search" name="brand-search" id="" className='w-full bg-red-00 rounded-md p-2 px-4 border-gray-500 border-[1px]' placeholder="Search 'any' brand " />
                        <Filter className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filters:</span>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                           <SelectTrigger className="w-48">
                              <SelectValue placeholder="Filter by status" />
                           </SelectTrigger>
                           <SelectContent className='bg-white border-none'>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="in_review">In Review</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                           </SelectContent>
                        </Select>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                           <SelectTrigger className="w-48">
                              <SelectValue placeholder="Filter by type" />
                           </SelectTrigger>
                           <SelectContent className='bg-white border-none'>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="hosted">Hosted</SelectItem>
                              <SelectItem value="activated">Activated</SelectItem>
                              <SelectItem value="requested">Requested</SelectItem>
                           </SelectContent>
                        </Select>

                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                              setStatusFilter('all')
                              setTypeFilter('all')
                           }}
                        >
                           Clear Filters
                        </Button>
                     </div>
                  </div>

                  {/* User's Brands Section */}
                  {userBrands.length > 0 && (
                     <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Brands</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {userBrands.map((brand) => (
                              <BrandCard key={brand.id} brand={brand} />
                           ))}
                        </div>
                     </div>
                  )}

                  {/* All Brands Section */}
                  <div>
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                           All Brands ({filteredBrands.length})
                        </h2>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Refresh
                        </Button>
                     </div>

                     {filteredBrands.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border">
                           <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                           <p className="text-gray-600">No brands match your current filters</p>
                           <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() => {
                                 setStatusFilter('all')
                                 setTypeFilter('all')
                              }}
                           >
                              Clear Filters
                           </Button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {filteredBrands.map((brand) => (
                              <BrandCard key={brand.id} brand={brand} />
                           ))}
                        </div>
                     )}
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

// Brand Card Component
function BrandCard({ brand }: { brand: BrandData }) {
   // Debug logging to see what status values we're getting
   console.log('Brand card data:', {
      id: brand.id,
      brand: brand.brand,
      type: brand.type,
      status: brand.status
   })

   const getBrandTypeLabel = (type: string) => {
      switch (type) {
         case 'hosted': return 'Hosted'
         case 'activated': return 'Activated'
         case 'requested': return 'Requested'
         default: return type
      }
   }

   const getBrandTypeColor = (type: string) => {
      switch (type) {
         case 'hosted': return 'bg-blue-100 text-blue-800'
         case 'activated': return 'bg-green-100 text-green-800'
         case 'requested': return 'bg-yellow-100 text-yellow-800'
         default: return 'bg-gray-100 text-gray-800'
      }
   }

   return (
      <Card className="hover:shadow-lg border-none bg-white transition-shadow pb-0 overflow-hidden">
         <CardContent className="bg-white p-5 py-0">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-lg font-semibold text-gray-900 truncate">{brand.brand}</h3>
               <div className="flex items-center gap-2">
                  <BrandStatusBadge status={brand.status} />
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getBrandTypeColor(brand.type)}`}>
                     {getBrandTypeLabel(brand.type)}
                  </span>
                  {brand.locked && (
                     <Lock className="w-5 h-5 text-gray-400 absolute -top-2 -right-2 bg-white rounded-full p-1 shadow" />
                  )}
               </div>
            </div>

            <div className="mb-4">
               <p className="text-sm text-gray-500">Brand ID:</p>
               <p className="text-sm text-gray-500 mt-1 break-all font-mono">{brand.id}</p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
               {brand.blockNumber && (
                  <p>Block: <span className="font-mono text-xs">{brand.blockNumber}</span></p>
               )}
               {brand.blockTimestamp && (
                  <p>Created: {new Date(Number(brand.blockTimestamp) * 1000).toLocaleDateString()}</p>
               )}
               {brand.transactionHash && (
                  <p>
                     <a
                        href={`https://sepolia.basescan.org/tx/${brand.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs"
                     >
                        View Transaction
                     </a>
                  </p>
               )}
               {/* Show additional fields for hosted brands */}
               {brand.type === 'hosted' && brand.brandPermission && (
                  <p>Permission: <span className="break-all">{brand.brandPermission}</span></p>
               )}
               {brand.type === 'hosted' && brand.oracle && (
                  <p>Oracle: <span className="break-all">{brand.oracle}</span></p>
               )}
               {brand.type === 'hosted' && brand.url && (
                  <p>
                     Website:{" "}
                     <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Visit
                     </a>
                  </p>
               )}
            </div>
         </CardContent>
         <Link href={`/brands/${brand.id}`}>
            <Button variant="outline" size="sm" className="w-full text-black border-none shadow-none text-md hover:bg-[#00296b]/80 disabled:opacity-50 disabled:cursor-not-allowed py-2 cursor-pointer bg-gray-300 rounded-none text-xs hover:underline">
               View Details <ArrowRight className="ml-0 h-4 w-4" />
            </Button>
         </Link>
      </Card>
   )
} 