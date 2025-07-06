'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/lib/authStore'
import { getJwtToken, isJwtTokenValid } from '@/lib/utils'
import Cookies from 'js-cookie'

// Cookie keys for auth persistence
const AUTH_COOKIE_KEYS = {
  USER_DATA: 'auth_user_data',
  JWT_TOKEN: 'sbx_jwt_token',
  AUTH_STATE: 'auth_state'
}

export default function AuthInitializer() {
  const { isConnected, address } = useAccount()
  const { setUser, setCurrentUsername, setAuthStep } = useAuthStore()

  useEffect(() => {
    const initializeAuth = () => {
      console.log('AuthInitializer: Starting authentication check...')
      
      // Step 1: Check for complete auth state in cookies
      const authState = getCookieData(AUTH_COOKIE_KEYS.AUTH_STATE)
      const userData = getCookieData(AUTH_COOKIE_KEYS.USER_DATA)
      const jwtToken = getJwtToken()
      
      console.log('AuthInitializer: Cookie data found:', {
        hasAuthState: !!authState,
        hasUserData: !!userData,
        hasJwtToken: !!jwtToken,
        isConnected,
        address: address?.slice(0, 6) + '...'
      })

      // Step 2: Validate JWT token first
      if (!jwtToken || !isJwtTokenValid()) {
        console.log('AuthInitializer: No valid JWT token found')
        clearAuthCookies()
        return
      }

      // Step 3: Check if we have complete auth state
      if (authState && userData) {
        console.log('AuthInitializer: Complete auth state found in cookies')
        
        // Restore complete auth state to Zustand
        setUser({
          address: userData.address,
          username: userData.username,
          jwt: jwtToken,
          verified: userData.verified || false
        })
        
        // Restore additional auth state
        if (authState.currentUsername) {
          setCurrentUsername(authState.currentUsername)
        }
        if (authState.authStep) {
          setAuthStep(authState.authStep)
        }
        
        console.log('AuthInitializer: Auto-login successful from cookies')
        return
      }
      if (jwtToken && isConnected && address) {
        console.log('AuthInitializer: JWT valid but incomplete state, restoring basic user')
        
        try {
          const payload = JSON.parse(atob(jwtToken.split('.')[1]))
          const username = payload.username || userData?.username || ''
          
          setUser({
            address,
            username,
            jwt: jwtToken,
            verified: true
          })
          
          if (username) {
            setCurrentUsername(username)
          }
          
          console.log('AuthInitializer: Basic user restored from JWT')
        } catch (error) {
          console.error('AuthInitializer: Error parsing JWT payload:', error)
          clearAuthCookies()
        }
        return
      }

      console.log('AuthInitializer: No valid authentication state found')
    }
    initializeAuth()
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      console.log('AuthInitializer: Wallet connected, checking auth state...')
      
      const userData = getCookieData(AUTH_COOKIE_KEYS.USER_DATA)
      const jwtToken = getJwtToken()
      
      if (userData && jwtToken && isJwtTokenValid()) {
        if (userData.address === address) {
          console.log('AuthInitializer: Wallet matches stored user')
        } else {
          console.log('AuthInitializer: Wallet address mismatch, clearing auth')
          clearAuthCookies()
        }
      }
    }
  }, [isConnected, address])

  // Helper functions
  const getCookieData = (key: string) => {
    try {
      const data = Cookies.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error parsing cookie ${key}:`, error)
      return null
    }
  }

  const clearAuthCookies = () => {
    try {
      Object.values(AUTH_COOKIE_KEYS).forEach(key => {
        Cookies.remove(key)
      })
      console.log('AuthInitializer: Auth cookies cleared')
    } catch (error) {
      console.error('Error clearing auth cookies:', error)
    }
  }
  return null
} 