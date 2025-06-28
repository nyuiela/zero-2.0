"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Car, Gavel, Building2, Calendar, DollarSign, Eye } from 'lucide-react';
import CreateAuctionForm from '@/components/brand/create-auction-form';
import RegisterBrandForm from '@/components/brand/register-brand-form';
import BrandCard from '@/components/brand/brand-card';

// Mock data for demonstration
const mockBrands = [
  {
    id: 1,
    name: "Tesla Motors",
    logo: "/api/placeholder/80/80",
    description: "Electric vehicles and clean energy company",
    totalAuctions: 24,
    totalSales: 1250000,
    lastActivity: "2 hours ago",
    status: "verified" as const
  },
  {
    id: 2,
    name: "BMW Group",
    logo: "/api/placeholder/80/80",
    description: "Premium automotive manufacturer",
    totalAuctions: 18,
    totalSales: 890000,
    lastActivity: "1 day ago",
    status: "verified" as const
  },
  {
    id: 3,
    name: "Classic Cars Co.",
    logo: "/api/placeholder/80/80",
    description: "Vintage and classic car specialist",
    totalAuctions: 12,
    totalSales: 450000,
    lastActivity: "3 days ago",
    status: "pending" as const
  }
];

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your brand, auctions, and registrations</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>View Public Profile</span>
              </Button>
              <Button className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500">
                <Plus className="h-4 w-4" />
                <span>Quick Actions</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="create-auction" className="flex items-center space-x-2">
              <Gavel className="h-4 w-4" />
              <span>Create Auction</span>
            </TabsTrigger>
            <TabsTrigger value="register-brand" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Register Brand</span>
            </TabsTrigger>
            <TabsTrigger value="brand-cards" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Brand Cards</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
                  <Gavel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">54</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,590,000</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">All verified</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your brand dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New auction created for Tesla Model S</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">BMW Group brand verification completed</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Classic Cars Co. submitted for review</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Auction Tab */}
          <TabsContent value="create-auction">
            <Card>
              <CardHeader>
                <CardTitle>Create New Auction</CardTitle>
                <CardDescription>Set up a new vehicle auction for your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateAuctionForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Brand Tab */}
          <TabsContent value="register-brand">
            <Card>
              <CardHeader>
                <CardTitle>Register New Brand</CardTitle>
                <CardDescription>Submit your brand for verification and approval</CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterBrandForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brand Cards Tab */}
          <TabsContent value="brand-cards">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your Brands</h2>
                  <p className="text-gray-600">Manage and view your registered brands</p>
                </div>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add New Brand</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBrands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
