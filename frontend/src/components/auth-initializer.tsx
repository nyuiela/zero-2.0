'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { getJwtToken, isJwtTokenValid } from '@/lib/utils'

export default function AuthInitializer() {
  const { isConnected, address } = useAccount()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const initializeAuth = () => {
      // Check if we have a valid JWT token
      const token = getJwtToken()
      
      if (token && isJwtTokenValid() && isConnected && address) {
        // Restore user session from stored token
        setUser({
          address,
          username: '', // Will be filled from token if needed
          jwt: token,
          verified: true
        })
        console.log('Auto-login successful from stored token')
      }
    }

    // Small delay to ensure wallet connection is established
    const timer = setTimeout(initializeAuth, 1000)
    
    return () => clearTimeout(timer)
  }, [isConnected, address, setUser])

  // This component doesn't render anything
  return null
} 