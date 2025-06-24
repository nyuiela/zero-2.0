'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Wallet, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Upload,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface SellerApplication {
  businessName: string
  businessType: 'dealer' | 'auction_house' | 'private_seller'
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  businessLicense: string
  yearsInBusiness: string
  description: string
  specialties: string[]
  website?: string
  socialMedia?: string
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [sellerApplication, setSellerApplication] = useState<SellerApplication>({
    businessName: '',
    businessType: 'dealer',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    businessLicense: '',
    yearsInBusiness: '',
    description: '',
    specialties: [],
    website: '',
    socialMedia: ''
  })

  const [newSpecialty, setNewSpecialty] = useState('')

  // Debug logging
  useEffect(() => {
    console.log('Profile Page Debug:', {
      isConnected,
      address,
      user,
      hasUser: !!user
    })
  }, [isConnected, address, user])

  // Show loading if wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-400">Please connect your wallet to access your profile.</p>
        </div>
      </div>
    )
  }

  // Use address from wallet if no user data
  const displayAddress = user?.address || address
  const displayUsername = user?.username || 'Not set'
  const isVerified = user?.verified || false

  const handleSellerApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Application submitted successfully!', {
        description: 'We will review your application and contact you within 3-5 business days.',
        duration: 5000,
      })
      
      // Reset form
      setSellerApplication({
        businessName: '',
        businessType: 'dealer',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        businessLicense: '',
        yearsInBusiness: '',
        description: '',
        specialties: [],
        website: '',
        socialMedia: ''
      })
      
    } catch (error) {
      toast.error('Failed to submit application', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !sellerApplication.specialties.includes(newSpecialty.trim())) {
      setSellerApplication(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setSellerApplication(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account and seller applications</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="profile" className="text-black">Profile</TabsTrigger>
              <TabsTrigger value="seller" className="text-black">Become a Seller</TabsTrigger>
              <TabsTrigger value="activity" className="text-black">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                      <p className="text-foreground font-mono bg-muted px-3 py-2 rounded mt-1 text-sm">
                        {displayAddress}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1">
                        {displayUsername}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {isVerified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                          </>
                        ) : user ? (
                          <>
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-gray-500" />
                            <Badge className="bg-gray-100 text-gray-800">Not Logged In</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security & Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security & Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Authentication Method</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1">
                        Wallet Signature + Zero-Knowledge Proof
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1">
                        {new Date().toLocaleString()}
                      </p>
                    </div>

                    {!isVerified && user && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Verification in Progress</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Your identity verification is being processed. This usually takes 2-5 minutes.
                        </p>
                      </div>
                    )}

                    {!user && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Complete Your Login</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          You're connected with your wallet but haven't completed the login process. 
                          Click the Login button in the header to complete your account setup.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seller" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Seller Application
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Apply to become a verified seller or auction dealer on our platform
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSellerApplicationSubmit} className="space-y-6">
                    {/* Business Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Business Name *</label>
                        <Input
                          value={sellerApplication.businessName}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, businessName: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Business Type *</label>
                        <select
                          value={sellerApplication.businessType}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, businessType: e.target.value as any }))}
                          required
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="dealer">Automotive Dealer</option>
                          <option value="auction_house">Auction House</option>
                          <option value="private_seller">Private Seller</option>
                        </select>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contact Person *</label>
                        <Input
                          value={sellerApplication.contactPerson}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, contactPerson: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email *</label>
                        <Input
                          type="email"
                          value={sellerApplication.email}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone *</label>
                        <Input
                          value={sellerApplication.phone}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Business License *</label>
                        <Input
                          value={sellerApplication.businessLicense}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, businessLicense: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address *</label>
                      <Input
                        value={sellerApplication.address}
                        onChange={(e) => setSellerApplication(prev => ({ ...prev, address: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">City *</label>
                        <Input
                          value={sellerApplication.city}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, city: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">State/Province *</label>
                        <Input
                          value={sellerApplication.state}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, state: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">ZIP/Postal Code *</label>
                        <Input
                          value={sellerApplication.zipCode}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, zipCode: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Country *</label>
                      <Input
                        value={sellerApplication.country}
                        onChange={(e) => setSellerApplication(prev => ({ ...prev, country: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    {/* Business Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Years in Business *</label>
                        <Input
                          value={sellerApplication.yearsInBusiness}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, yearsInBusiness: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Website</label>
                        <Input
                          type="url"
                          value={sellerApplication.website}
                          onChange={(e) => setSellerApplication(prev => ({ ...prev, website: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Specialties</label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          placeholder="Add a specialty (e.g., Classic Cars, Supercars)"
                          className="flex-1"
                        />
                        <Button type="button" onClick={addSpecialty} variant="outline">
                          Add
                        </Button>
                      </div>
                      {sellerApplication.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sellerApplication.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="cursor-pointer" onClick={() => removeSpecialty(specialty)}>
                              {specialty} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Business Description *</label>
                      <Textarea
                        value={sellerApplication.description}
                        onChange={(e) => setSellerApplication(prev => ({ ...prev, description: e.target.value }))}
                        required
                        placeholder="Tell us about your business, experience, and what makes you unique..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity to display</p>
                      <p className="text-sm">Your bidding and auction activity will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 