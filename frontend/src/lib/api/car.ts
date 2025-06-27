import { CarListing, listings as mockListings } from '../data';
import { API_BASE_URL } from './config';
import { apiRequest } from '../utils';

export async function fetchCars(): Promise<CarListing[]> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/cars`);
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

export async function fetchCarById(id: string): Promise<CarListing | null> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/cars/${id}`);
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for car.");
      return mockListings.find(car => car.id.toString() === id) || null;
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching car, falling back to mock data:", error);
    return mockListings.find(car => car.id.toString() === id) || null;
  }
}

export async function createCar(carData: Partial<CarListing>): Promise<{ status: string; message: string }> {
  try {
    const res = await apiRequest(`${API_BASE_URL}/api/cars`, {
      method: 'POST',
      body: JSON.stringify(carData),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create car');
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
} 