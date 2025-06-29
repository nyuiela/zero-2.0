import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { clearJwtToken } from './utils'

interface User {
  address: string
  username?: string
  jwt?: string
  verified?: boolean
  roleRequestStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  sellerRole?: boolean
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        clearJwtToken() // Clear JWT token from cookies
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
      setAuthStep: (step) => set({ authStep: step }),
      
      // Nonce and message persistence
      currentNonce: null,
      currentMessage: null,
      setNonceAndMessage: (nonce, message) => set({ 
        currentNonce: nonce, 
        currentMessage: message 
      }),
      clearNonceAndMessage: () => set({ 
        currentNonce: null, 
        currentMessage: null 
      }),
      
      // Username persistence
      currentUsername: '',
      setCurrentUsername: (username) => set({ currentUsername: username }),
      clearCurrentUsername: () => set({ currentUsername: '' }),
      
      // Wallet connection tracking
      isConnectingFromModal: false,
      setIsConnectingFromModal: (isConnecting) => set({ isConnectingFromModal: isConnecting }),
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