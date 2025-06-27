import { Auction } from "../utils"
import { auctions as mockAuctions } from "../auction"
import { API_BASE_URL } from "./config"
import { apiRequest } from "../utils"

export async function fetchAuctions(): Promise<Auction[]> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/auctions`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auctions.")
      return mockAuctions
    }
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error("Error fetching auctions, falling back to mock data:", error)
    return mockAuctions
  }
}

export async function fetchAuctionById(id: string): Promise<Auction | null> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/auctions/${id}`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auction.")
      return mockAuctions.find(auction => auction.id.toString() === id) || null
    }
    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.error("Error fetching auction, falling back to mock data:", error)
    return mockAuctions.find(auction => auction.id.toString() === id) || null
  }
}

export async function createAuction(auctionData: Partial<Auction>): Promise<{ status: string; message: string }> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/auctions`, {
      method: 'POST',
      body: JSON.stringify(auctionData),
    })
    
    if (!res.ok) {
      throw new Error('Failed to create auction')
    }
    
    return await res.json()
  } catch (error) {
    console.error("Error creating auction:", error)
    throw error
  }
} 