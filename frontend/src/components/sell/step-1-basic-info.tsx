"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "./image-upload"
import { CarFormData, CarImage } from "@/lib/types/car"

interface Step1BasicInfoProps {
  data: Partial<CarFormData>
  onDataChange: (data: Partial<CarFormData>) => void
  errors?: Record<string, string[]>
}

export default function Step1BasicInfo({ data, onDataChange, errors }: Step1BasicInfoProps) {
  const [featureInput, setFeatureInput] = useState('')

  const handleInputChange = (field: string, value: string | number) => {
    onDataChange({ ...data, [field]: value })
  }

  const handleImagesChange = (images: CarImage[]) => {
    onDataChange({ ...data, images })
  }

  const addHighlight = () => {
    if (featureInput.trim() && !data.highlight?.includes(featureInput.trim())) {
      const newHighlights = [...(data.highlight || []), featureInput.trim()]
      onDataChange({ ...data, highlight: newHighlights })
      setFeatureInput('')
    }
  }

  const removeHighlight = (highlight: string) => {
    const newHighlights = data.highlight?.filter(h => h !== highlight) || []
    onDataChange({ ...data, highlight: newHighlights })
  }

  const addIncluded = () => {
    if (featureInput.trim() && !data.included?.includes(featureInput.trim())) {
      const newIncluded = [...(data.included || []), featureInput.trim()]
      onDataChange({ ...data, included: newIncluded })
      setFeatureInput('')
    }
  }

  const removeIncluded = (item: string) => {
    const newIncluded = data.included?.filter(i => i !== item) || []
    onDataChange({ ...data, included: newIncluded })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
          <p className="text-muted-foreground">
            Start by providing the essential details about your vehicle
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Images */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Vehicle Images *</Label>
            <ImageUpload
              images={data.images || []}
              onImagesChange={handleImagesChange}
              errors={errors?.images}
            />
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={data.year || ''}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                placeholder="e.g., 2020"
              />
              {errors?.year && <p className="text-red-600 text-sm">{errors.year[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={data.make || ''}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Ferrari"
              />
              {errors?.make && <p className="text-red-600 text-sm">{errors.make[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={data.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., 488 GTB"
              />
              {errors?.model && <p className="text-red-600 text-sm">{errors.model[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot">Lot Number *</Label>
              <Input
                id="lot"
                value={data.lot || ''}
                onChange={(e) => handleInputChange('lot', e.target.value)}
                placeholder="e.g., LOT-001"
              />
              {errors?.lot && <p className="text-red-600 text-sm">{errors.lot[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={data.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Los Angeles, CA"
              />
              {errors?.location && <p className="text-red-600 text-sm">{errors.location[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={data.country || ''}
                onValueChange={(value) => handleInputChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="UAE">United Arab Emirates</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors?.country && <p className="text-red-600 text-sm">{errors.country[0]}</p>}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Highlights</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a highlight feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
            {data.highlight && data.highlight.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.highlight.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm cursor-pointer hover:bg-secondary/80"
                    onClick={() => removeHighlight(highlight)}
                  >
                    {highlight}
                    <span className="text-lg">×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Included Items */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Included Items</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add an included item"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
              />
              <button
                type="button"
                onClick={addIncluded}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
            {data.included && data.included.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.included.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm cursor-pointer hover:bg-secondary/80"
                    onClick={() => removeIncluded(item)}
                  >
                    {item}
                    <span className="text-lg">×</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 