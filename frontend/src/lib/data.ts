export interface CarListing {
  auction_id: number;
  auction_status: string;
  color: string;
  created_at: string;
  current_price: number;
  description: string;
  engine_size: string;
  exterior_color: string;
  features: {
    exterior: string[];
    interior: string[];
    mechanical: string[];
  };
  fuel_type: string;
  highlight: string[];
  id: number;
  image_url: string[];
  included: string[];
  interior_color: string;
  location: string;
  lot: string;
  make: string;
  mileage: number;
  model: string;
  odometer: number;
  owner: string;
  report: {
    condition: string;
    inspection: string;
    notes: string;
  };
  seller: string;
  seller_type: string;
  starting_price: number;
  summary: string;
  token_id: number;
  transmission: string;
  updated_at: string;
  vehicale_overview: string;
  vin: string;
  year: number;
}

export interface RelatedAuction {
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

// Mock data for car listings
export const listings: CarListing[] = [
  {
    auction_id: 1,
    auction_status: "Active",
    color: "Red",
    created_at: "2024-01-01T00:00:00",
    current_price: 215000,
    description: "High-performance twin-turbo V8 Ferrari in pristine condition.",
    engine_size: "3.9L V8",
    exterior_color: "Rosso Corsa",
    features: {
      exterior: [
        "LED headlights",
        "Sport exhaust",
        "Carbon fiber body"
      ],
      interior: [
        "Leather seats",
        "Carbon fiber trim",
        "Premium audio"
      ],
      mechanical: [
        "Turbocharged engine",
        "Magnetic ride control",
        "Launch control"
      ]
    },
    fuel_type: "Petrol",
    highlight: [
      "Low mileage",
      "Clean title",
      "Sport exhaust"
    ],
    id: 1,
    image_url: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    included: [
      "Owner's manual",
      "Tool kit",
      "Extra key",
      "Service history"
    ],
    interior_color: "Black",
    location: "Los Angeles, CA",
    lot: "LOT-001",
    make: "Ferrari",
    mileage: 8200,
    model: "488 GTB",
    odometer: 8200,
    owner: "0x123abc456def789ghi",
    report: {
      condition: "excellent",
      inspection: "passed",
      notes: "minor wear"
    },
    seller: "SupercarDealerLA",
    seller_type: "Dealer",
    starting_price: 200000,
    summary: "Iconic Ferrari 488 GTB in pristine condition.",
    token_id: 1,
    transmission: "Automatic",
    updated_at: "2024-01-01T00:00:00",
    vehicale_overview: "Driven 8,200 miles, well-maintained, and regularly serviced.",
    vin: "ZFF79ALA4J0234001",
    year: 2019
  }
]

// Mock data for related auctions
const relatedAuctions: RelatedAuction[] = [
  {
    id: 334,
    year: '2011',
    make: 'Morgan',
    model: 'Aero 8 Supersports',
    location: 'Dubai, United Arab Emirates',
    image: 'https://ext.same-assets.com/360451443/3233359261.jpeg',
    currentBid: 'US$96,000',
    timeLeft: '14:36:33',
    bidCount: 22,
    reserve: 'Reserve Almost Met',
    country: 'UAE'
  },
  {
    id: 335,
    year: '2016',
    make: 'Ferrari',
    model: '488 Spider',
    location: 'Dubai, United Arab Emirates',
    image: 'https://ext.same-assets.com/360451443/428281940.jpeg',
    currentBid: '675,000 AED',
    timeLeft: '14:56:33',
    bidCount: 19,
    country: 'UAE'
  },
  {
    id: 289,
    year: '2024',
    make: 'Bentley',
    model: 'GT W12 Speed - 55km',
    location: 'Bautzen, Germany',
    image: 'https://ext.same-assets.com/360451443/3638646694.jpeg',
    currentBid: '€201,000',
    timeLeft: '36:36:33',
    bidCount: 27,
    country: 'Germany'
  },
  {
    id: 343,
    year: '2020',
    make: 'Mercedes-Benz',
    model: 'AMG GT 63 S Brabus 800',
    location: 'Dubai, United Arab Emirates',
    image: 'https://ext.same-assets.com/360451443/3057433556.jpeg',
    currentBid: '285,000 AED',
    timeLeft: '2 days',
    bidCount: 24,
    country: 'UAE'
  }
]

// Server-side function to get car listing by ID
export function getCarListing(id: string): CarListing | null {
  return listings.find(listing => listing.id.toString() === id) || null
}

// Server-side function to get related auctions
export function getRelatedAuctions(currentListingId: number): RelatedAuction[] {
  return relatedAuctions.filter(auction => auction.id !== currentListingId).slice(0, 4)
}