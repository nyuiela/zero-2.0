"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Upload, DollarSign, Clock, Car } from 'lucide-react';

export default function CreateAuctionForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    startingBid: '',
    reservePrice: '',
    auctionDuration: '',
    startDate: '',
    endDate: '',
    images: [],
    features: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auction form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Auction Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., 2022 Tesla Model S Plaid"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Select onValueChange={(value) => handleSelectChange('brand', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tesla">Tesla</SelectItem>
                <SelectItem value="bmw">BMW</SelectItem>
                <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                <SelectItem value="audi">Audi</SelectItem>
                <SelectItem value="porsche">Porsche</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              placeholder="e.g., Model S"
              value={formData.model}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="2022"
                value={formData.year}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                placeholder="15,000"
                value={formData.mileage}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select onValueChange={(value) => handleSelectChange('condition', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startingBid">Starting Bid ($)</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startingBid"
                  name="startingBid"
                  type="number"
                  placeholder="50,000"
                  value={formData.startingBid}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reservePrice">Reserve Price ($)</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reservePrice"
                  name="reservePrice"
                  type="number"
                  placeholder="80,000"
                  value={formData.reservePrice}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="auctionDuration">Auction Duration</Label>
            <Select onValueChange={(value) => handleSelectChange('auctionDuration', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="5">5 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="10">10 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide detailed information about the vehicle, its history, maintenance, and any unique features..."
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1"
        />
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Vehicle Images</span>
          </CardTitle>
          <CardDescription>Upload high-quality images of the vehicle (max 10 images)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
            <Button type="button" variant="outline">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500">
          Create Auction
        </Button>
      </div>
    </form>
  );
}
