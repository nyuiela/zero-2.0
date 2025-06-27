import { create } from 'zustand'
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
  logout: () => void,
  open: boolean,
  setOpen: (isClosed: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    clearJwtToken() // Clear JWT token from cookies
    set({ user: null })
  },
  open: false,
  setOpen: (isOpen) => set({ open: isOpen })
})) 