"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Upload, Globe, Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function RegisterBrandForm() {
  const [formData, setFormData] = useState({
    brandName: '',
    legalName: '',
    brandType: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    taxId: '',
    businessLicense: '',
    logo: null,
    documents: [],
    termsAccepted: false,
    privacyAccepted: false
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Brand registration submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Brand Information</span>
          </CardTitle>
          <CardDescription>Basic information about your brand</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                name="brandName"
                placeholder="e.g., Tesla Motors"
                value={formData.brandName}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="legalName">Legal Company Name</Label>
              <Input
                id="legalName"
                name="legalName"
                placeholder="e.g., Tesla, Inc."
                value={formData.legalName}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="brandType">Brand Type</Label>
            <Select onValueChange={(value) => handleSelectChange('brandType', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select brand type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="dealer">Authorized Dealer</SelectItem>
                <SelectItem value="independent">Independent Dealer</SelectItem>
                <SelectItem value="collector">Private Collector</SelectItem>
                <SelectItem value="auction-house">Auction House</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Brand Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your brand, specialties, and what makes you unique..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>How customers can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Business Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                name="address"
                placeholder="123 Business St, Suite 100"
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="San Francisco"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={(value) => handleSelectChange('country', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="94102"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Legal Information</span>
          </CardTitle>
          <CardDescription>Required for verification and compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                name="taxId"
                placeholder="12-3456789"
                value={formData.taxId}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="businessLicense">Business License Number</Label>
              <Input
                id="businessLicense"
                name="businessLicense"
                placeholder="BL123456789"
                value={formData.businessLicense}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Documentation</span>
          </CardTitle>
          <CardDescription>Upload required documents for verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Brand Logo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-1">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload your brand logo (PNG, JPG, SVG)</p>
              <Button type="button" variant="outline" size="sm">
                Choose Logo
              </Button>
            </div>
          </div>

          <div>
            <Label>Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-1">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload business license, tax documents, certifications, etc.
              </p>
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
            />
            <Label htmlFor="termsAccepted" className="text-sm">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacyAccepted"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => handleCheckboxChange('privacyAccepted', checked as boolean)}
            />
            <Label htmlFor="privacyAccepted" className="text-sm">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500"
          disabled={!formData.termsAccepted || !formData.privacyAccepted}
        >
          Submit for Review
        </Button>
      </div>
    </form>
  );
}
