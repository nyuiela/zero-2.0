import { CarListing, listings as mockListings } from '../data';
import { apiRequest } from '../utils';

export async function fetchCars(): Promise<CarListing[]> {
  try {
    const res = await apiRequest(`/api/cars-proxy`);
    if (!res.ok) {
      console.warn("API failed, falling back to mock data for cars.");
      return mockListings;
    }
    const json = await res.json();
    console.log("Carssss s", json)
    return json.data || [];
  } catch (error) {
    console.error("Error fetching cars, falling back to mock data:", error);
    return mockListings;
  }
}

export async function fetchCarById(id: string): Promise<CarListing | null> {
  try {
    const res = await apiRequest(`/api/cars-proxy/${id}`);
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

export async function createCar(carData: Partial<CarListing>, jwt: string): Promise<{ status: string; message: string }> {
  try {
    const res = await apiRequest(`/api/cars-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        id: 0,
        mileage: 13242,
        vin: "fwrqr244",
        transmission: "automatic",
        fuel_type: "electric",
        engine_size: "40L",
        exterior_color: "white",
        interior_color: "white",
        odometer: 4000,
        auction_id: 0,
        token_id: 0,
        created_at: "2024-01-01T00:00:00",
        updated_at: "2024-01-01T00:00:00",
        color: 'white',
        ...carData
      }),
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