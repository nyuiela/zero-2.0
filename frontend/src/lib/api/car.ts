import { CarListing, listings as mockListings } from '../data';
import { API_BASE_URL } from './config';

export async function fetchCars(): Promise<CarListing[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cars`);
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for cars.");
      return mockListings;
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching cars, falling back to mock data:", error);
    return mockListings;
  }
} 