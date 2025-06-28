"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarFormData } from "@/lib/types/car"

interface Step2DetailedInfoProps {
  data: Partial<CarFormData>
  onDataChange: (data: Partial<CarFormData>) => void
  errors?: Record<string, string[]>
}

export default function Step2DetailedInfo({ data, onDataChange, errors }: Step2DetailedInfoProps) {
  const [featureInput, setFeatureInput] = useState('')
  const [featureType, setFeatureType] = useState<'exterior' | 'interior' | 'mechanical'>('exterior')

  const handleInputChange = (field: string, value: string | number) => {
    onDataChange({ ...data, [field]: value })
  }

  const handleSpecificationChange = (field: string, value: string | number) => {
    const currentSpecs = data.specifications || {}
    const specifications = { ...currentSpecs, [field]: value }
    onDataChange({ ...data, specifications })
  }

  const handleFeatureChange = (type: 'exterior' | 'interior' | 'mechanical', features: string[]) => {
    const currentFeatures = data.features || {}
    const allFeatures = { ...currentFeatures, [type]: features }
    onDataChange({ ...data, features: allFeatures })
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = data.features?.[featureType] || []
      if (!currentFeatures.includes(featureInput.trim())) {
        const newFeatures = [...currentFeatures, featureInput.trim()]
        handleFeatureChange(featureType, newFeatures)
        setFeatureInput('')
      }
    }
  }

  const removeFeature = (feature: string) => {
    const currentFeatures = data.features?.[featureType] || []
    const newFeatures = currentFeatures.filter(f => f !== feature)
    handleFeatureChange(featureType, newFeatures)
  }

  return (
    <div className="space-y-6">
      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Descriptions</CardTitle>
          <p className="text-muted-foreground">
            Provide detailed descriptions of your vehicle
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={data.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide a detailed description of the vehicle..."
              rows={4}
            />
            {errors?.description && <p className="text-red-600 text-sm">{errors.description[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary *</Label>
            <Textarea
              id="summary"
              value={data.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief summary of the vehicle..."
              rows={3}
            />
            {errors?.summary && <p className="text-red-600 text-sm">{errors.summary[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicale_overview">Vehicle Overview *</Label>
            <Textarea
              id="vehicale_overview"
              value={data.vehicale_overview || ''}
              onChange={(e) => handleInputChange('vehicale_overview', e.target.value)}
              placeholder="Overview of the vehicle's condition and history..."
              rows={3}
            />
            {errors?.vehicale_overview && <p className="text-red-600 text-sm">{errors.vehicale_overview[0]}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Specifications</CardTitle>
          <p className="text-muted-foreground">
            Technical specifications of your vehicle
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engine_size">Engine Size *</Label>
              <Input
                id="engine_size"
                value={data.specifications?.engine_size || ''}
                onChange={(e) => handleSpecificationChange('engine_size', e.target.value)}
                placeholder="e.g., 3.9L V8"
              />
              {errors?.specifications?.engine_size && <p className="text-red-600 text-sm">{errors.specifications.engine_size[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission *</Label>
              <Select
                value={data.specifications?.transmission || ''}
                onValueChange={(value) => handleSpecificationChange('transmission', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
              {errors?.specifications?.transmission && <p className="text-red-600 text-sm">{errors.specifications.transmission[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type *</Label>
              <Select
                value={data.specifications?.fuel_type || ''}
                onValueChange={(value) => handleSpecificationChange('fuel_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors?.specifications?.fuel_type && <p className="text-red-600 text-sm">{errors.specifications.fuel_type[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="exterior_color">Exterior Color *</Label>
              <Input
                id="exterior_color"
                value={data.specifications?.exterior_color || ''}
                onChange={(e) => handleSpecificationChange('exterior_color', e.target.value)}
                placeholder="e.g., Rosso Corsa"
              />
              {errors?.specifications?.exterior_color && <p className="text-red-600 text-sm">{errors.specifications.exterior_color[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interior_color">Interior Color *</Label>
              <Input
                id="interior_color"
                value={data.specifications?.interior_color || ''}
                onChange={(e) => handleSpecificationChange('interior_color', e.target.value)}
                placeholder="e.g., Black"
              />
              {errors?.specifications?.interior_color && <p className="text-red-600 text-sm">{errors.specifications.interior_color[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (miles) *</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={data.specifications?.mileage || ''}
                onChange={(e) => handleSpecificationChange('mileage', parseInt(e.target.value) || 0)}
                placeholder="e.g., 8200"
              />
              {errors?.specifications?.mileage && <p className="text-red-600 text-sm">{errors.specifications.mileage[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer Reading (miles) *</Label>
              <Input
                id="odometer"
                type="number"
                min="0"
                value={data.specifications?.odometer || ''}
                onChange={(e) => handleSpecificationChange('odometer', parseInt(e.target.value) || 0)}
                placeholder="e.g., 8200"
              />
              {errors?.specifications?.odometer && <p className="text-red-600 text-sm">{errors.specifications.odometer[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN Number *</Label>
              <Input
                id="vin"
                value={data.specifications?.vin || ''}
                onChange={(e) => handleSpecificationChange('vin', e.target.value.toUpperCase())}
                placeholder="e.g., ZFF79ALA4J0234001"
                maxLength={17}
              />
              {errors?.specifications?.vin && <p className="text-red-600 text-sm">{errors.specifications.vin[0]}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Features</CardTitle>
          <p className="text-muted-foreground">
            Add features for different categories
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={featureType} onValueChange={(value: 'exterior' | 'interior' | 'mechanical') => setFeatureType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exterior">Exterior</SelectItem>
                <SelectItem value="interior">Interior</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder={`Add ${featureType} feature`}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Feature Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['exterior', 'interior', 'mechanical'] as const).map((type) => (
              <div key={type} className="space-y-2">
                <Label className="text-sm font-semibold capitalize">{type} Features</Label>
                <div className="space-y-1">
                  {data.features?.[type]?.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={() => removeFeature(feature)}
                    >
                      {feature}
                      <span className="text-sm">×</span>
                    </span>
                  ))}
                  {(!data.features?.[type] || data.features[type].length === 0) && (
                    <p className="text-muted-foreground text-xs">No {type} features added</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 