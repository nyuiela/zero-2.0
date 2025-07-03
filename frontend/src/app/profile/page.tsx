'use client'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { getJwtToken } from '@/lib/utils'
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
  Star,
  Car
} from 'lucide-react'
import { toast } from 'sonner'
import { AuctionRegistrationForm } from "@/components/auction-registration-form"
import { useRouter } from 'next/navigation'
import { zero_abi, zero_addr } from '@/lib/abi/abi'
import Image from 'next/image'
import ProfileBanner from '@/components/profile-banner'

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
  const { user, setUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roleRequestStatus, setRoleRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>(user?.roleRequestStatus || 'none')
  const [roleRequestLoading, setRoleRequestLoading] = useState(false)
  const router = useRouter()

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

  // Add state for profile NFT image
  const [profileNft, setProfileNft] = useState<string | null>(null)

  // Debug logging
  useEffect(() => {
    console.log('Profile Page Debug:', {
      isConnected,
      address,
      user,
      hasUser: !!user
    })
  }, [isConnected, address, user])

  // Fetch NFT image after login (simulate on mount for now)
  useEffect(() => {
    fetch('/api/request-nft')
      .then(res => res.json())
      .then(data => setProfileNft(data.image))
      .catch(() => setProfileNft(null))
  }, [])

  // Show loading if wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Login to view profile</h2>
          <p className="text-gray-400">Please login  to access your profile.</p>
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

  // Seller role request handler
  const handleRequestSellerRole = async () => {
    setRoleRequestLoading(true)
    try {
      // Try backend first with JWT token
      const res = await fetch('/api/role-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJwtToken() || ''}`
        },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        setRoleRequestStatus('pending')
        setUser({ ...(user || { address: address as string }), roleRequestStatus: 'pending' })
        toast.success('Seller role request submitted!')
      } else {
        throw new Error(data.message || 'Failed to submit request')
      }
    } catch (e) {
      // Fallback: in-app session
      setRoleRequestStatus('pending')
      setUser({ ...(user || { address: address as string }), roleRequestStatus: 'pending' })
      toast.info('Seller role request submitted (in-app fallback)!')
    } finally {
      setRoleRequestLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    // Your smart contract integration here
    const contractData = {
      brandName: data.brandName,
      startTime: BigInt(data.startTime),
      endTime: BigInt(data.endTime),
      initialBid: BigInt(Math.floor(parseFloat(data.initialBid) * 1e18)),
      bidThreshold: BigInt(Math.floor(parseFloat(data.bidThreshold) * 1e18)),
      bidToken: data.bidToken,
      nftTokenId: BigInt(data.nftTokenId),
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="w-full flex justify-center mb-6">
          <ProfileBanner image={profileNft} height="h-32" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account and seller applications</p>
            {/* Seller Role Request Section */}
            <div className="mt-4">
              {roleRequestStatus === 'none' && (
                <Button onClick={handleRequestSellerRole} disabled={roleRequestLoading}>
                  {roleRequestLoading ? 'Requesting...' : 'Request Seller Role'}
                </Button>
              )}
              {roleRequestStatus === 'pending' && (
                <Badge className="bg-yellow-100 text-yellow-800 ml-2">Seller Request Pending</Badge>
              )}

              {roleRequestStatus === 'rejected' && (
                <Badge className="bg-red-100 text-red-800 ml-2">Seller Request Rejected</Badge>
              )}
            </div>
            {roleRequestStatus === 'pending' && (
              <>
                {/* <Badge className="bg-green-100 text-green-800 ml-2">Seller Role Approved</Badge> */}
                <Button
                  className='m-2 rounded-[5px] border-none shadow-none bg-blue-400 hover:bg-blue-500 text-white font-bold cursor-pointer'
                  onClick={() => router.push("/create-auction")}>
                  Create Auction
                </Button>
              </>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto w-full sm:overflow-x-visible">
              <TabsList className="flex min-w-[320px] w-max gap-2 sm:grid sm:w-full sm:grid-cols-4 sm:min-w-0 bg-gray-100">
                <TabsTrigger value="profile" className="text-black whitespace-nowrap sm:whitespace-normal">Profile</TabsTrigger>
                <TabsTrigger value="seller" className="text-black whitespace-nowrap sm:whitespace-normal">Become a Seller</TabsTrigger>
                <TabsTrigger value="activity" className="text-black whitespace-nowrap sm:whitespace-normal">Activity</TabsTrigger>
                <TabsTrigger value="nfts" className="text-black whitespace-nowrap sm:whitespace-normal">My NFTs</TabsTrigger>
              </TabsList>
            </div>

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
                      <p className="text-foreground font-mono bg-muted px-3 py-2 rounded mt-1 text-sm break-all">
                        {displayAddress}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1 break-words">
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
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1 break-words">
                        Wallet Signature + Zero-Knowledge Proof
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                      <p className="text-foreground bg-muted px-3 py-2 rounded mt-1 break-words">
                        {new Date().toLocaleString()}
                      </p>
                    </div>

                    {!isVerified && user && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Verification in Progress</span>
                        </div>
                        <p className="text-sm text-yellow-700 break-words">
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
                        <p className="text-sm text-blue-700 break-words">
                          You&apos;re connected with your wallet but haven&apos;t completed the login process.
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
                        className="mt-1 break-words"
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

            {/* NFT Collection Tab */}
            <TabsContent value="nfts" className="mt-6">
              <Card className='border-none shadow-none bg-transparent'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    My Car NFTs
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Your collection of car NFTs from the blockchain
                  </p>
                </CardHeader>
                <CardContent>
                  <CarNFTCollection address={address} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}

// Car NFT Collection Component
function CarNFTCollection({ address }: { address: string | undefined }) {
  const [nfts, setNfts] = useState<CarNFT[]>([])
  const [loading, setLoading] = useState(true)
  const { address: owner } = useAccount()
  const [error, setError] = useState<string | null>(null)
  const cResponse = useReadContract({
    abi: zero_abi,
    address: zero_addr,
    functionName: "totalSupply",
    args: [],
    account: owner
  })
  console.log("C response ", cResponse)

  useEffect(() => {
    if (!address) {
      setLoading(false)
      return
    }

    fetchUserNFTs(address)
  }, [address])

  const fetchUserNFTs = async (userAddress: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch NFTs from smart contract
      const userNFTs = await getUserNFTs(userAddress)
      setNfts(userNFTs)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('Failed to load NFTs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-muted-foreground">Loading NFTs...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-2">Error loading NFTs</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button
          onClick={() => fetchUserNFTs(address!)}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-muted-foreground mb-2">No NFTs found</p>
        <p className="text-sm text-muted-foreground">
          You don&apos;t own any car NFTs yet. Start by registering a brand or participating in auctions.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <CarNFTCard key={nft.tokenId} nft={nft} />
      ))}
    </div>
  )
}

// Individual Car NFT Card Component
function CarNFTCard({ nft }: { nft: CarNFT }) {
  const [imageError, setImageError] = useState(false)
  const [isLocked, setIsLocked] = useState(nft.isLocked)

  const handleLockToggle = async () => {
    try {
      // Call smart contract to toggle lock status
      await toggleNFTLock(nft.tokenId)
      setIsLocked(!isLocked)
      toast.success(`NFT ${isLocked ? 'unlocked' : 'locked'} successfully`)
    } catch (error) {
      console.error('Error toggling lock:', error)
      toast.error('Failed to toggle lock status')
    }
  }

  return (
    <div className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none h-fit bg-gray-200/40 rounded-sm">
      {/* NFT Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100">
        {nft.imageUrl && !imageError ? (
          <img
            src={nft.imageUrl}
            alt={`${nft.brandName} ${nft.model}`}
            className="w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Car className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Lock Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={isLocked ? "destructive" : "secondary"}
            className="text-xs"
          >
            {isLocked ? "Locked" : "Available"}
          </Badge>
        </div>

        {/* Token ID Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="text-xs bg-white/90">
            #{nft.tokenId}
          </Badge>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Brand and Model */}
          {/* Additional Info */}
          <div className="text-xs text-muted-foreground border-none m-0 border-t flex p-0 justify-between">
            <p className="break-words">Minted: {new Date(nft.mintTimestamp).toLocaleDateString()}</p>
            <p className="break-all">Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-foreground break-words">
              {nft.brandName} {nft.model}
            </h3>
            <p className="text-sm text-muted-foreground break-words">
              {nft.year} • {nft.color}
            </p>
          </div>

          {/* Specifications */}
          {/* <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Engine:</span>
              <p className="font-medium">{nft.engineSize}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Transmission:</span>
              <p className="font-medium">{nft.transmission}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mileage:</span>
              <p className="font-medium">{nft.mileage.toLocaleString()} mi</p>
            </div>
            <div>
              <span className="text-muted-foreground">VIN:</span>
              <p className="font-mono text-xs font-medium truncate" title={nft.vin}>
                {nft.vin}
              </p>
            </div>
          </div> */}

          {/* Condition and Verification */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={nft.condition === 'excellent' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {nft.condition.charAt(0).toUpperCase() + nft.condition.slice(1)}
              </Badge>
              {nft.isVerified && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div> */}
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLockToggle}
              disabled={nft.isInAuction}
              className="flex-1 hover:bg-[#00296b]"
            >
              {isLocked ? "Unlock" : "Lock"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLocked || nft.isInAuction}
              className="flex-1 hover:bg-[#00296b]"
            >
              {nft.isInAuction ? "In Auction" : "Create Auction"}
            </Button>
          </div>



        </div>
      </div>
    </div >
  )
}

// Types for Car NFT
interface CarNFT {
  tokenId: string
  brandName: string
  model: string
  year: number
  color: string
  engineSize: string
  transmission: string
  mileage: number
  vin: string
  condition: string
  isVerified: boolean
  isLocked: boolean
  isInAuction: boolean
  imageUrl?: string
  mintTimestamp: number
  owner: string
}

// Mock function to fetch NFTs from smart contract
async function getUserNFTs(address: string): Promise<CarNFT[]> {
  // This would be replaced with actual smart contract calls
  // For now, returning mock data
  return [
    {
      tokenId: "1",
      brandName: "Ferrari",
      model: "488 GTB",
      year: 2019,
      color: "Rosso Corsa",
      engineSize: "3.9L V8 Twin-Turbo",
      transmission: "7-Speed Automatic",
      mileage: 8200,
      vin: "ZFF79ALA4J0234001",
      condition: "excellent",
      isVerified: true,
      isLocked: false,
      isInAuction: false,
      imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      mintTimestamp: Date.now() - 86400000, // 1 day ago
      owner: address
    },
    {
      tokenId: "2",
      brandName: "Tesla",
      model: "Model S Plaid",
      year: 2022,
      color: "Pearl White",
      engineSize: "Tri-Motor Electric",
      transmission: "Single-Speed",
      mileage: 15000,
      vin: "5YJS1E47LF1234567",
      condition: "excellent",
      isVerified: true,
      isLocked: true,
      isInAuction: true,
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      mintTimestamp: Date.now() - 172800000, // 2 days ago
      owner: address
    }
  ]
}

// Mock function to toggle NFT lock status
async function toggleNFTLock(tokenId: string): Promise<void> {
  // This would be replaced with actual smart contract call
  console.log(`Toggling lock for NFT ${tokenId}`)
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
} 