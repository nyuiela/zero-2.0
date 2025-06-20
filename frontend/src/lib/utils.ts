import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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