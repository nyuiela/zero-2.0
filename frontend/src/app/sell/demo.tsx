"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSampleDataKeys, getSampleData, getRandomSampleData } from "@/lib/sampleData"
import { CarFormData } from "@/lib/types/car"
import { Database, Car, Zap, Clock, Mountain, Building } from "lucide-react"

export default function SampleDataDemo() {
  const [selectedData, setSelectedData] = useState<Partial<CarFormData> | null>(null)
  const sampleKeys = getSampleDataKeys()

  const handleSelectSample = (key: string) => {
    const data = getSampleData(key)
    setSelectedData(data)
  }

  const handleRandomSample = () => {
    const data = getRandomSampleData()
    setSelectedData(data)
  }

  const getIconForType = (key: string) => {
    switch (key) {
      case 'ferrari-488':
        return <Car className="w-5 h-5" />
      case 'tesla-model-s':
        return <Zap className="w-5 h-5" />
      case 'mustang-1969':
        return <Clock className="w-5 h-5" />
      case 'range-rover':
        return <Mountain className="w-5 h-5" />
      case 'bmw-3-series':
        return <Building className="w-5 h-5" />
      default:
        return <Database className="w-5 h-5" />
    }
  }

  const getTypeLabel = (key: string) => {
    switch (key) {
      case 'ferrari-488':
        return 'Luxury Sports'
      case 'tesla-model-s':
        return 'Electric'
      case 'mustang-1969':
        return 'Classic'
      case 'range-rover':
        return 'SUV'
      case 'bmw-3-series':
        return 'Luxury Sedan'
      default:
        return 'Other'
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sample Data Demo</h1>
          <p className="text-muted-foreground">
            Explore the available sample data for auto form filling
          </p>
        </div>

        {/* Sample Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sampleKeys.map((key) => {
            const data = getSampleData(key)
            const Icon = getIconForType(key)

            return (
              <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectSample(key)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Icon}
                      <Badge variant="secondary">{getTypeLabel(key)}</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{data.year} {data.make} {data.model}</CardTitle>
                  <p className="text-sm text-muted-foreground">{data.location}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Price:</strong> ${data.starting_price?.toLocaleString()}</p>
                    <p><strong>Mileage:</strong> {data.specifications?.mileage?.toLocaleString()} miles</p>
                    <p><strong>Condition:</strong> {data.report?.condition}</p>
                    <p><strong>Seller:</strong> {data.seller}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Random Sample Button */}
        <div className="text-center mb-8">
          <Button onClick={handleRandomSample} variant="outline" size="lg">
            <Database className="w-4 h-4 mr-2" />
            Load Random Sample
          </Button>
        </div>

        {/* Selected Data Display */}
        {selectedData && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Sample Data</CardTitle>
              <p className="text-muted-foreground">
                This is the data that would be used to fill the form
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Vehicle:</strong> {selectedData.year} {selectedData.make} {selectedData.model}</p>
                    <p><strong>Location:</strong> {selectedData.location}, {selectedData.country}</p>
                    <p><strong>Lot:</strong> {selectedData.lot}</p>
                    <p><strong>Images:</strong> {selectedData.images?.length || 0} images</p>
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Engine:</strong> {selectedData.specifications?.engine_size}</p>
                    <p><strong>Transmission:</strong> {selectedData.specifications?.transmission}</p>
                    <p><strong>Fuel Type:</strong> {selectedData.specifications?.fuel_type}</p>
                    <p><strong>Mileage:</strong> {selectedData.specifications?.mileage?.toLocaleString()} miles</p>
                    <p><strong>VIN:</strong> {selectedData.specifications?.vin}</p>
                  </div>
                </div>

                {/* Auction Details */}
                <div>
                  <h3 className="font-semibold mb-3">Auction Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Starting Price:</strong> ${selectedData.starting_price?.toLocaleString()}</p>
                    <p><strong>Current Price:</strong> ${selectedData.current_price?.toLocaleString()}</p>
                    <p><strong>Seller:</strong> {selectedData.seller}</p>
                    <p><strong>Seller Type:</strong> {selectedData.seller_type}</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Exterior:</strong> {selectedData.features?.exterior?.length || 0} features</p>
                    <p><strong>Interior:</strong> {selectedData.features?.interior?.length || 0} features</p>
                    <p><strong>Mechanical:</strong> {selectedData.features?.mechanical?.length || 0} features</p>
                    <p><strong>Highlights:</strong> {selectedData.highlight?.length || 0} items</p>
                    <p><strong>Included:</strong> {selectedData.included?.length || 0} items</p>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Description Preview</h3>
                <p className="text-sm text-muted-foreground">{selectedData.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use Sample Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. In the Sell Form</h4>
                <p className="text-sm text-muted-foreground">
                  Click the &quot;Fill with Sample Data&quot; button in the top-right corner of the sell page.
                  Choose from the dropdown menu to populate the form with realistic data.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Available Samples</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Ferrari 488 GTB:</strong> Luxury sports car with high-end features</li>
                  <li>• <strong>Tesla Model S Plaid:</strong> Electric vehicle with cutting-edge technology</li>
                  <li>• <strong>1969 Mustang Boss 302:</strong> Classic muscle car for collectors</li>
                  <li>• <strong>Range Rover Sport:</strong> Luxury SUV with off-road capability</li>
                  <li>• <strong>BMW 330i xDrive:</strong> Premium sedan with sport features</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Customization</h4>
                <p className="text-sm text-muted-foreground">
                  After filling with sample data, you can modify any field to match your actual vehicle.
                  The sample data provides a complete structure that you can edit as needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 