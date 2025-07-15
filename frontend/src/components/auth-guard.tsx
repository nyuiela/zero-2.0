'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean // If true, requires full auth (wallet + login). If false, just wallet connection
}

/**
 * AuthGuard Component
 * 
 * Protects routes that require authentication. Automatically redirects to home page
 * if user is not authenticated.
 * 
 * @example
 * // Require full authentication (wallet + login)
 * <AuthGuard>
 *   <ProtectedPage />
 * </AuthGuard>
 * 
 * @example
 * // Require only wallet connection
 * <AuthGuard requireAuth={false}>
 *   <WalletOnlyPage />
 * </AuthGuard>
 * 
 * @param children - The content to render if authenticated
 * @param requireAuth - If true, requires both wallet connection and login. If false, only requires wallet connection
 */
export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { user } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  // Civic Auth
  const civicUserContext = useUser();
  const civicUser = civicUserContext?.user;
  const civicHasWallet = civicUser && userHasWallet(civicUserContext);

  useEffect(() => {
    // Add a small delay to allow auth state to settle
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isChecking) {
      // Check if user meets the authentication requirements
      // Allow access if: (wallet connect + user) OR (Civic user + Civic wallet)
      const isWalletAuth = isConnected && user;
      const isCivicAuth = civicUser && civicHasWallet;
      const isAuthenticated = requireAuth ? (isWalletAuth || isCivicAuth) : (isConnected || isCivicAuth);

      if (!isAuthenticated) {
        // Redirect to home page if not authenticated
        router.push('/')
      }
    }
  }, [isConnected, user, requireAuth, router, isChecking, civicUser, civicHasWallet])

  // Show loading while checking auth
  if (isChecking || (!isConnected && !(civicUser && civicHasWallet)) || (requireAuth && !(user || (civicUser && civicHasWallet)))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 