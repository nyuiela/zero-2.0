import { CarAuctioned, CarListing } from './../data';
import { Auction } from "../utils"
import { auctions as mockAuctions } from "../auction"
import { API_BASE_URL } from "./config"
import { apiRequest } from "../utils"
import { ProofData } from '@/components/proof-modal';

export async function fetchAuctions(): Promise<Auction[]> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/auctions`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auctions.")
      return mockAuctions
    }

    const json = await res.json()
    console.log("Auctions ", json);
    return json.data || []
  } catch (error) {
    console.error("Error fetching auctions, falling back to mock data:", error)
    return mockAuctions
  }
}
export async function fetchAuctionedCars(): Promise<CarAuctioned[] | undefined> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/auctions`)
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for auctions.")
      // return mockAuctions
    }
    const json = await res.json()
    const auctions = json.data;
    const carsRes = await apiRequest(`${API_BASE_URL}/api/cars`)
    const cars = await carsRes.json()

    // Step 1: Build a Map of auction.id => auction
    const auctionMap = new Map(
      auctions.map((auction: Auction) => [auction.id, auction])
    );
    console.log("Auction Map ", auctionMap)

    // Step 2: Merge cars with matching auction by comparing car.auction_id to auction.id
    const merged = cars.data
      .filter((car: CarListing) => auctionMap.has(car.auction_id)) // Only keep cars with a matching auction
      .map((car: any) => {
        const auction = auctionMap.get(car.auction_id);
        return {
          ...car,
          auction: auction, // Attach auction under 'auction' key
        };
      });

    console.log("Merged ", merged);
    return merged
    // return json.data || []
  } catch (error) {
    console.error("Error fetching auctions, falling back to mock data:", error)
    // return mockAuctions
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

interface ProofAuction extends ProofData {
  status: string;
  message: string

}
export async function createAuction(auctionData: Partial<Auction>, jwt: string): Promise<ProofAuction> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/auctions`, {
      method: 'POST',
      body: JSON.stringify(auctionData),
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