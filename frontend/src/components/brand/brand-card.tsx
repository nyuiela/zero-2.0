"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Gavel, 
  DollarSign, 
  Clock, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  totalAuctions: number;
  totalSales: number;
  lastActivity: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{brand.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(brand.status)}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Brand
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Brand
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="mt-2">
          {brand.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Auctions</p>
                <p className="text-xl font-semibold text-gray-900">{brand.totalAuctions}</p>
              </div>
              <Gavel className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(brand.totalSales)}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            Last activity: {brand.lastActivity}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            disabled={brand.status !== 'verified'}
          >
            <Gavel className="h-4 w-4 mr-1" />
            Create Auction
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Profile
          </Button>
        </div>

        {/* Status-specific messages */}
        {brand.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-yellow-800">
              Your brand is under review. You'll be notified once verification is complete.
            </p>
          </div>
        )}
        
        {brand.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-red-800">
              Brand verification was rejected. Please contact support for more information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
