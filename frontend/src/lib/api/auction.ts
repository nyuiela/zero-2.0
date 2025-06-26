import { Auction } from "../utils"
import { auctions as mockAuctions } from "../auction"
import { API_BASE_URL } from "./config"


export async function fetchAuctions(): Promise<Auction[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auctions`)
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