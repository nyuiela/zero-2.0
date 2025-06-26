"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CarForm {
  year: string
  make: string
  model: string
  location: string
  currentBid: string
  timeLeft: string
  bidCount: number
  reserve?: string
  country: string
  description: string
  images: File[]
  specifications: {
    engine: string
    power: string
    torque: string
    transmission: string
    drivetrain: string
    topSpeed: string
    acceleration: string
    weight: string
    fuel: string
    exterior: string
    interior: string
    wheels: string
    brakes: string
  }
  features: string[]
  history: string
  provenance: string
  seller: {
    name: string
    location: string
    phone: string
    email: string
    verified: boolean
  }
  startingBid: string
  estimatedValue: string
  auctionEnd: string
  views: number
  watchers: number
}

const initialForm: CarForm = {
  year: '',
  make: '',
  model: '',
  location: '',
  currentBid: '',
  timeLeft: '',
  bidCount: 0,
  reserve: '',
  country: '',
  description: '',
  images: [],
  specifications: {
    engine: '', power: '', torque: '', transmission: '', drivetrain: '', topSpeed: '', acceleration: '', weight: '', fuel: '', exterior: '', interior: '', wheels: '', brakes: ''
  },
  features: [],
  history: '',
  provenance: '',
  seller: { name: '', location: '', phone: '', email: '', verified: false },
  startingBid: '',
  estimatedValue: '',
  auctionEnd: '',
  views: 0,
  watchers: 0
}

export default function SellYourCarPage() {
  const [form, setForm] = useState<CarForm>(initialForm)
  const [featureInput, setFeatureInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('specifications.')) {
      const specKey = name.replace('specifications.', '')
      setForm((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [specKey]: value }
      }))
    } else if (name.startsWith('seller.')) {
      const sellerKey = name.replace('seller.', '')
      setForm((prev) => ({
        ...prev,
        seller: { ...prev.seller, [sellerKey]: value }
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, images: Array.from(files) }))
    }
  }

  const addFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }))
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter(f => f !== feature) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Try backend first
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file) => formData.append('images', file))
        } else if (key === 'specifications' || key === 'seller' || key === 'features') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value as string)
        }
      })
      const res = await fetch('/api/cars', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.status === 'success') {
        toast.success('Car registered for auction!')
        setForm(initialForm)
        router.push('/profile')
        return
      } else {
        throw new Error(data.message || 'Failed to register car')
      }
    } catch (e) {
      // Fallback: in-app session
      window.sessionStorage.setItem('uploadedCar', JSON.stringify(form))
      toast.info('Car registered (in-app fallback)!')
      setForm(initialForm)
      router.push('/profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register Your Car for Auction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <Input name="year" value={form.year} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Make</label>
                  <Input name="make" value={form.make} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <Input name="model" value={form.model} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <Input name="location" value={form.location} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Country</label>
                  <Input name="country" value={form.country} onChange={handleInputChange} required />
                </div>
              </div>
              {/* Images */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Images</label>
                <Input type="file" multiple accept="image/*" onChange={handleImageChange} required />
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((file, idx) => (
                      <Badge key={idx}>{file.name}</Badge>
                    ))}
                  </div>
                )}
              </div>
              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(form.specifications).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <Input name={`specifications.${key}`} value={value} onChange={handleInputChange} />
                  </div>
                ))}
              </div>
              {/* Features */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Features</label>
                <div className="flex gap-2 mt-1">
                  <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Add a feature" />
                  <Button type="button" onClick={addFeature} variant="outline">Add</Button>
                </div>
                {form.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(feature)}>
                        {feature} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {/* Description, History, Provenance */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <Textarea name="description" value={form.description} onChange={handleInputChange} required rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">History</label>
                <Textarea name="history" value={form.history} onChange={handleInputChange} rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Provenance</label>
                <Textarea name="provenance" value={form.provenance} onChange={handleInputChange} rows={2} />
              </div>
              {/* Seller Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seller Name</label>
                  <Input name="seller.name" value={form.seller.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seller Location</label>
                  <Input name="seller.location" value={form.seller.location} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seller Phone</label>
                  <Input name="seller.phone" value={form.seller.phone} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seller Email</label>
                  <Input name="seller.email" value={form.seller.email} onChange={handleInputChange} required />
                </div>
              </div>
              {/* Auction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Starting Bid</label>
                  <Input name="startingBid" value={form.startingBid} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimated Value</label>
                  <Input name="estimatedValue" value={form.estimatedValue} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Auction End (ISO date)</label>
                  <Input name="auctionEnd" value={form.auctionEnd} onChange={handleInputChange} />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Register Car'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 