"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarFormData } from "@/lib/types/car"

interface Step3AuctionLegalProps {
  data: Partial<CarFormData>
  onDataChange: (data: Partial<CarFormData>) => void
  errors?: Record<string, any>
}

export default function Step3AuctionLegal({ data, onDataChange, errors }: Step3AuctionLegalProps) {
  const handleInputChange = (field: string, value: string | number) => {
    onDataChange({ ...data, [field]: value })
  }

  const handleReportChange = (field: string, value: string) => {
    const report = { 
      condition: data.report?.condition || '',
      inspection: data.report?.inspection || '',
      notes: data.report?.notes || '',
      [field]: value 
    }
    onDataChange({ ...data, report })
  }

  return (
    <div className="space-y-6">
      {/* Auction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Auction Details</CardTitle>
          <p className="text-muted-foreground">
            Set your auction pricing and seller information
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starting_price">Starting Price (USD) *</Label>
              <Input
                id="starting_price"
                type="number"
                min="1"
                value={data.starting_price || ''}
                onChange={(e) => handleInputChange('starting_price', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 200000"
              />
              {errors?.starting_price && <p className="text-red-600 text-sm">{errors.starting_price[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_price">Current Price (USD) *</Label>
              <Input
                id="current_price"
                type="number"
                min="1"
                value={data.current_price || ''}
                onChange={(e) => handleInputChange('current_price', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 215000"
              />
              {errors?.current_price && <p className="text-red-600 text-sm">{errors.current_price[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller">Seller Name *</Label>
              <Input
                id="seller"
                value={data.seller || ''}
                onChange={(e) => handleInputChange('seller', e.target.value)}
                placeholder="e.g., SupercarDealerLA"
              />
              {errors?.seller && <p className="text-red-600 text-sm">{errors.seller[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller_type">Seller Type *</Label>
              <Select
                value={data.seller_type || ''}
                onValueChange={(value) => handleInputChange('seller_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seller type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dealer">Dealer</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Auction House">Auction House</SelectItem>
                </SelectContent>
              </Select>
              {errors?.seller_type && <p className="text-red-600 text-sm">{errors.seller_type[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Owner (Wallet/Account) *</Label>
              <Input
                id="owner"
                value={data.owner || ''}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                placeholder="e.g., 0x123abc456def789ghi"
              />
              {errors?.owner && <p className="text-red-600 text-sm">{errors.owner[0]}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal & Condition Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Legal & Condition Report</CardTitle>
          <p className="text-muted-foreground">
            Provide legal and condition details for transparency
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Input
                id="condition"
                value={data.report?.condition || ''}
                onChange={(e) => handleReportChange('condition', e.target.value)}
                placeholder="e.g., excellent"
              />
              {errors?.report?.condition && <p className="text-red-600 text-sm">{errors.report.condition[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspection">Inspection Status *</Label>
              <Input
                id="inspection"
                value={data.report?.inspection || ''}
                onChange={(e) => handleReportChange('inspection', e.target.value)}
                placeholder="e.g., passed"
              />
              {errors?.report?.inspection && <p className="text-red-600 text-sm">{errors.report.inspection[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={data.report?.notes || ''}
                onChange={(e) => handleReportChange('notes', e.target.value)}
                placeholder="Any additional notes..."
                rows={2}
              />
              {errors?.report?.notes && <p className="text-red-600 text-sm">{errors.report.notes[0]}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 