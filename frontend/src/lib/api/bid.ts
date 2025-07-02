import { Bid, ProofResponse } from "../utils"
import { API_BASE_URL } from "./config"
import { apiRequest } from "../utils"
import { ProofData } from "@/components/proof-modal"

export async function fetchBids(): Promise<Bid[] | null> {
  try {
    const res = await apiRequest(`/api/bids-proxy`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auctions.")
      // return mockAuctions
    }

    const json = await res.json()
    console.log("Auctions ", json);
    return json.data || []
  } catch (error) {
    console.error("Error fetching auctions, falling back to mock data:", error)
    // return mockAuctions
    return null
  }
}

export async function fetchBidById(id: number): Promise<Bid | null> {
  try {
    const res = await apiRequest(`/api/bids-proxy/${id}`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auction.")
      // return mockAuctions.find(auction => auction.id.toString() === id) || null
    }
    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.error("Error fetching auction, falling back to mock data:", error)
    return null;
    // return mockAuctions.find(auction => auction.id.toString() === id) || null
  }
}
export async function fetchBidByAuctionId(id: number): Promise<Bid[] | null> {
  try {
    const res = await apiRequest(`/api/bids-proxy/${id}`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auction.")
      // return mockAuctions.find(auction => auction.id.toString() === id) || null
    }
    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.error("Error fetching auction, falling back to mock data:", error)
    return null;
    // return mockAuctions.find(auction => auction.id.toString() === id) || null
  }
}


export async function placeBid(bidData: Partial<Bid>, jwt: string): Promise<ProofResponse> {
  try {
    const res = await apiRequest(`/api/bids-proxy`, {
      method: 'POST',
      body: JSON.stringify(
        bidData
      ),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
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