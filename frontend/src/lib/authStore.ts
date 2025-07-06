import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { clearJwtToken, setJwtToken } from './utils'
import Cookies from 'js-cookie'

// Cookie keys for auth persistence
const AUTH_COOKIE_KEYS = {
  USER_DATA: 'auth_user_data',
  AUTH_STATE: 'auth_state'
}

export interface User {
  address: string
  username: string
  jwt: string
  verified: boolean
}

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
  open: boolean
  setOpen: (isOpen: boolean) => void
  // Add authentication flow state
  authStep: 'username' | 'connect' | 'sign' | 'complete'
  setAuthStep: (step: 'username' | 'connect' | 'sign' | 'complete') => void
  // Add nonce and message persistence
  currentNonce: string | null
  currentMessage: string | null
  setNonceAndMessage: (nonce: string, message: string) => void
  clearNonceAndMessage: () => void
  // Add username persistence
  currentUsername: string
  setCurrentUsername: (username: string) => void
  clearCurrentUsername: () => void
  // Add wallet connection tracking
  isConnectingFromModal: boolean
  setIsConnectingFromModal: (isConnecting: boolean) => void
}

// Helper function to save auth state to cookies
const saveAuthToCookies = (user: User, authState: Partial<AuthState>) => {
  try {
    // Save user data
    Cookies.set(AUTH_COOKIE_KEYS.USER_DATA, JSON.stringify({
      address: user.address,
      username: user.username,
      verified: user.verified
    }), { expires: 7 })

    // Save additional auth state
    Cookies.set(AUTH_COOKIE_KEYS.AUTH_STATE, JSON.stringify({
      currentUsername: authState.currentUsername || '',
      authStep: authState.authStep || 'username',
      currentNonce: authState.currentNonce,
      currentMessage: authState.currentMessage,
      isConnectingFromModal: authState.isConnectingFromModal || false
    }), { expires: 7 })

    // Save JWT token (already handled by setJwtToken)
    setJwtToken(user.jwt)
    
    console.log('💾 AuthStore: Complete auth state saved to cookies')
  } catch (error) {
    console.error('Error saving auth to cookies:', error)
  }
}

// Helper function to clear auth cookies
const clearAuthCookies = () => {
  try {
    Object.values(AUTH_COOKIE_KEYS).forEach(key => {
      Cookies.remove(key)
    })
    clearJwtToken()
    console.log('🧹 AuthStore: Auth cookies cleared')
  } catch (error) {
    console.error('Error clearing auth cookies:', error)
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        set({ user })
        // Save complete auth state to cookies when user is set
        const currentState = get()
        saveAuthToCookies(user, currentState)
      },
      logout: () => {
        clearAuthCookies() // Clear all auth cookies
        set({ 
          user: null, 
          authStep: 'username',
          currentNonce: null,
          currentMessage: null,
          currentUsername: '',
          isConnectingFromModal: false
        })
      },
      open: false,
      setOpen: (isOpen) => set({ open: isOpen }),
      
      // Authentication flow state
      authStep: 'username',
      setAuthStep: (step) => {
        set({ authStep: step })
        // Update cookies when auth step changes
        const currentState = get()
        if (currentState.user) {
          saveAuthToCookies(currentState.user, { ...currentState, authStep: step })
        }
      },
      
      // Nonce and message persistence
      currentNonce: null,
      currentMessage: null,
      setNonceAndMessage: (nonce, message) => {
        set({ currentNonce: nonce, currentMessage: message })
        // Update cookies when nonce/message changes
        const currentState = get()
        if (currentState.user) {
          saveAuthToCookies(currentState.user, { ...currentState, currentNonce: nonce, currentMessage: message })
        }
      },
      clearNonceAndMessage: () => {
        set({ currentNonce: null, currentMessage: null })
        // Update cookies when nonce/message is cleared
        const currentState = get()
        if (currentState.user) {
          saveAuthToCookies(currentState.user, { ...currentState, currentNonce: null, currentMessage: null })
        }
      },
      
      // Username persistence
      currentUsername: '',
      setCurrentUsername: (username) => {
        set({ currentUsername: username })
        // Update cookies when username changes
        const currentState = get()
        if (currentState.user) {
          saveAuthToCookies(currentState.user, { ...currentState, currentUsername: username })
        }
      },
      clearCurrentUsername: () => {
        set({ currentUsername: '' })
        // Update cookies when username is cleared
        const currentState = get()
        if (currentState.user) {
          saveAuthToCookies(currentState.user, { ...currentState, currentUsername: '' })
        }
      },
      
      // Wallet connection tracking
      isConnectingFromModal: false,
      setIsConnectingFromModal: (isConnecting) => {
        set({ isConnectingFromModal: isConnecting })
        // Update cookies when connection state changes
        const currentState = get()
        if (currentState.user) {
          saveAuthToCookies(currentState.user, { ...currentState, isConnectingFromModal: isConnecting })
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        authStep: state.authStep,
        currentNonce: state.currentNonce,
        currentMessage: state.currentMessage,
        currentUsername: state.currentUsername,
        isConnectingFromModal: state.isConnectingFromModal
      }),
    }
  )
) 