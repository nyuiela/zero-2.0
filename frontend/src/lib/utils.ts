import { ProofData } from "@/components/proof-modal"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// JWT Token Management Utilities
const JWT_COOKIE_NAME = 'sbx_jwt_token'
const JWT_EXPIRY_DAYS = 7

export function setJwtToken(token: string): void {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + JWT_EXPIRY_DAYS)

  document.cookie = `${JWT_COOKIE_NAME}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`
  
  console.log('JWT Token saved:', {
    name: JWT_COOKIE_NAME,
    tokenLength: token.length,
    expiry: expiryDate.toUTCString(),
    cookieString: document.cookie.includes(JWT_COOKIE_NAME)
  })
}

export function getJwtToken(): string | null {
  if (typeof document === 'undefined') return null // SSR check

  const cookies = document.cookie.split(';')
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith(`${JWT_COOKIE_NAME}=`))

  if (jwtCookie) {
    const token = jwtCookie.split('=')[1]
    console.log('JWT Token retrieved:', {
      name: JWT_COOKIE_NAME,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...'
    })
    return token
  }

  console.log('JWT Token not found in cookies')
  return null
}

export function clearJwtToken(): void {
  if (typeof document === 'undefined') return // SSR check

  document.cookie = `${JWT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export function isJwtTokenValid(): boolean {
  const token = getJwtToken()
  if (!token) {
    console.log('JWT validation: No token found')
    return false
  }

  try {
    // Basic JWT structure validation (header.payload.signature)
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log('JWT validation: Invalid token structure')
      clearJwtToken()
      return false
    }

    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(parts[1]))
    const currentTime = Math.floor(Date.now() / 1000)

    console.log('JWT validation:', {
      exp: payload.exp,
      currentTime,
      isExpired: payload.exp && payload.exp < currentTime,
      username: payload.username,
      address: payload.addr || payload.address
    })

    if (payload.exp && payload.exp < currentTime) {
      console.log('JWT validation: Token expired')
      clearJwtToken() // Clear expired token
      return false
    }

    // Check if token has required fields
    if (!payload.username || (!payload.addr && !payload.address)) {
      console.log('JWT validation: Missing required fields')
      clearJwtToken()
      return false
    }

    console.log('JWT validation: Token is valid')
    return true
  } catch (error) {
    console.error('Error validating JWT token:', error)
    clearJwtToken() // Clear invalid token
    return false
  }
}

// API request helper with JWT token
export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getJwtToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export interface Auction {
  id: number
  year: string
  make: string
  model: string
  location: string
  image: string
  currentBid: string
  timeLeft: string
  bidCount: number
  reserve?: string
  country: string
}

export interface Bid {
  amount: number,
  auction_id: number,
  bidder_id: string,
  created_at: string,
  id: number,
  updated_at: string
}
export interface ProofResponse extends ProofData {
  status: string,
  message: string
}
export function toRustCompatibleTimestamp(dateInput: any) {
  const date = new Date(dateInput); // input can be a Date or timestamp

  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = date.getUTCMilliseconds(); // 0–999

  // Convert milliseconds to microseconds (i.e., add 000 if no finer granularity)
  const micros = pad(milliseconds, 3) + "000";

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${micros}`;
}
