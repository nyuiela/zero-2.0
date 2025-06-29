"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, Car, Settings } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Error Card */}
        <Card className="text-center p-8 mb-8">
          <CardContent className="space-y-6">
            {/* Error Number */}
            <div className="relative">
              <h1 className="text-9xl font-bold gradient-text leading-none">404</h1>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-10 blur-3xl"></div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved to a different location.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-gradient">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/auctions">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <Car className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <p className="font-medium">Auctions</p>
                    <p className="text-sm text-muted-foreground">Browse cars</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/sell">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-primary-foreground text-sm font-bold">$</span>
                    </div>
                    <p className="font-medium">Sell Car</p>
                    <p className="text-sm text-muted-foreground">List your vehicle</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/profile">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <Settings className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <p className="font-medium">Profile</p>
                    <p className="text-sm text-muted-foreground">Manage account</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/verify">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <Search className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <p className="font-medium">Verify</p>
                    <p className="text-sm text-muted-foreground">Check transactions</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/support" className="text-primary hover:underline">
              Support
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
            <Link href="/faq" className="text-primary hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 