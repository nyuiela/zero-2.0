import { CarFormData, CarImage } from "@/lib/types/car"

// Sample car images for testing
const createSampleImages = (): CarImage[] => [
  {
    id: "1",
    type: "url",
    url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    preview: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "2",
    type: "url",
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    preview: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "3",
    type: "url",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    preview: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
]

// Sample data for different car types
export const sampleCarData: Record<string, Partial<CarFormData>> = {
  // Luxury Sports Car
  "ferrari-488": {
    year: 2019,
    make: "Ferrari",
    model: "488 GTB",
    location: "Los Angeles, CA",
    country: "United States",
    lot: "LOT-001",
    images: createSampleImages(),
    description: "High-performance twin-turbo V8 Ferrari in pristine condition. This iconic supercar delivers an exhilarating driving experience with its 3.9L V8 engine producing 661 horsepower. Perfect for collectors and enthusiasts seeking the ultimate Italian sports car experience.",
    summary: "Iconic Ferrari 488 GTB in pristine condition with low mileage and full service history.",
    vehicale_overview: "Driven only 8,200 miles, this Ferrari 488 GTB has been meticulously maintained and regularly serviced. The car features the original Rosso Corsa paint with black interior, and comes with complete documentation including service records and owner's manual.",
    specifications: {
      engine_size: "3.9L V8 Twin-Turbo",
      transmission: "7-Speed Automatic",
      fuel_type: "Petrol",
      exterior_color: "Rosso Corsa",
      interior_color: "Black",
      mileage: 8200,
      odometer: 8200,
      vin: "ZFF79ALA4J0234001"
    },
    features: {
      exterior: [
        "LED Headlights",
        "Sport Exhaust System",
        "Carbon Fiber Body Panels",
        "20-inch Forged Wheels",
        "Carbon Ceramic Brakes"
      ],
      interior: [
        "Leather Sport Seats",
        "Carbon Fiber Trim",
        "Premium Audio System",
        "Navigation System",
        "Climate Control"
      ],
      mechanical: [
        "Twin-Turbocharged Engine",
        "Magnetic Ride Control",
        "Launch Control System",
        "Electronic Differential",
        "Sport Suspension"
      ]
    },
    report: {
      condition: "Excellent",
      inspection: "Passed",
      notes: "Minor wear on driver's seat bolster. All systems functioning perfectly. Recent service completed."
    },
    starting_price: 200000,
    current_price: 215000,
    highlight: [
      "Low Mileage",
      "Clean Title",
      "Full Service History",
      "Original Paint",
      "Sport Exhaust"
    ],
    included: [
      "Owner's Manual",
      "Tool Kit",
      "Extra Key Fob",
      "Service Records",
      "Car Cover"
    ],
    seller: "SupercarDealerLA",
    seller_type: "Dealer",
    owner: "0x123abc456def789ghi"
  },

  // Electric Vehicle
  "tesla-model-s": {
    year: 2022,
    make: "Tesla",
    model: "Model S Plaid",
    location: "San Francisco, CA",
    country: "United States",
    lot: "LOT-002",
    images: createSampleImages(),
    description: "Ultra-high performance electric sedan with cutting-edge technology. The Model S Plaid features a tri-motor all-wheel drive system delivering 1,020 horsepower and acceleration from 0-60 mph in under 2 seconds. Perfect for tech enthusiasts and performance seekers.",
    summary: "Tesla Model S Plaid with Ludicrous mode and full self-driving capability.",
    vehicale_overview: "This 2022 Tesla Model S Plaid has been driven 15,000 miles and features the latest software updates. The car includes Full Self-Driving capability and has been maintained according to Tesla's recommendations.",
    specifications: {
      engine_size: "Tri-Motor Electric",
      transmission: "Single-Speed Automatic",
      fuel_type: "Electric",
      exterior_color: "Pearl White",
      interior_color: "Cream",
      mileage: 15000,
      odometer: 15000,
      vin: "5YJS1E47LF1234567"
    },
    features: {
      exterior: [
        "21-inch Arachnid Wheels",
        "Carbon Fiber Décor",
        "LED Headlights",
        "Glass Roof",
        "Auto-Presenting Door Handles"
      ],
      interior: [
        "17-inch Touchscreen",
        "Yoke Steering Wheel",
        "Premium Audio System",
        "Heated/Cooled Seats",
        "Ambient Lighting"
      ],
      mechanical: [
        "Tri-Motor AWD",
        "Adaptive Air Suspension",
        "Regenerative Braking",
        "Supercharger Compatible",
        "Ludicrous Mode"
      ]
    },
    report: {
      condition: "Excellent",
      inspection: "Passed",
      notes: "All systems operational. Battery health at 98%. Recent software update installed."
    },
    starting_price: 85000,
    current_price: 89000,
    highlight: [
      "Full Self-Driving",
      "Ludicrous Mode",
      "Low Mileage",
      "Premium Interior",
      "Supercharger Access"
    ],
    included: [
      "Mobile Connector",
      "Wall Connector",
      "Key Cards",
      "Owner's Manual",
      "Warranty Documentation"
    ],
    seller: "TeslaCertified",
    seller_type: "Dealer",
    owner: "0x456def789ghi123abc"
  },

  // Classic Car
  "mustang-1969": {
    year: 1969,
    make: "Ford",
    model: "Mustang Boss 302",
    location: "Detroit, MI",
    country: "United States",
    lot: "LOT-003",
    images: createSampleImages(),
    description: "Rare and highly collectible 1969 Ford Mustang Boss 302 in original condition. This classic muscle car represents the golden era of American automotive performance and is perfect for collectors and vintage car enthusiasts.",
    summary: "Original 1969 Ford Mustang Boss 302 with matching numbers and documented history.",
    vehicale_overview: "This Boss 302 has been carefully preserved and maintained over the years. The car retains its original paint and interior, with only necessary mechanical updates for safety and reliability. Complete documentation and restoration records included.",
    specifications: {
      engine_size: "5.0L V8",
      transmission: "4-Speed Manual",
      fuel_type: "Petrol",
      exterior_color: "Calypso Coral",
      interior_color: "Black",
      mileage: 45000,
      odometer: 45000,
      vin: "9F02R123456"
    },
    features: {
      exterior: [
        "Boss 302 Graphics",
        "Hood Scoop",
        "Magnum 500 Wheels",
        "Dual Exhaust",
        "Racing Mirrors"
      ],
      interior: [
        "Bucket Seats",
        "Wood Grain Steering Wheel",
        "Tachometer",
        "AM Radio",
        "Floor Mats"
      ],
      mechanical: [
        "High-Performance Engine",
        "Heavy-Duty Suspension",
        "Power Steering",
        "Power Brakes",
        "Limited Slip Differential"
      ]
    },
    report: {
      condition: "Good",
      inspection: "Passed",
      notes: "Original paint with minor patina. Engine rebuilt 5,000 miles ago. All mechanical systems in excellent condition."
    },
    starting_price: 75000,
    current_price: 82000,
    highlight: [
      "Matching Numbers",
      "Original Paint",
      "Documented History",
      "Rare Model",
      "Investment Grade"
    ],
    included: [
      "Owner's Manual",
      "Build Sheet",
      "Restoration Photos",
      "Service Records",
      "Marti Report"
    ],
    seller: "ClassicCarCollector",
    seller_type: "Private",
    owner: "0x789ghi123abc456def"
  },

  // SUV
  "range-rover": {
    year: 2021,
    make: "Land Rover",
    model: "Range Rover Sport",
    location: "Miami, FL",
    country: "United States",
    lot: "LOT-004",
    images: createSampleImages(),
    description: "Luxury SUV with exceptional off-road capability and refined on-road manners. The Range Rover Sport combines British luxury with advanced technology and impressive performance for the ultimate driving experience.",
    summary: "2021 Range Rover Sport HSE with premium features and excellent condition.",
    vehicale_overview: "This Range Rover Sport has been driven 25,000 miles and maintained at authorized Land Rover service centers. The vehicle features the latest technology and has been kept in excellent condition both inside and out.",
    specifications: {
      engine_size: "3.0L V6 Supercharged",
      transmission: "8-Speed Automatic",
      fuel_type: "Petrol",
      exterior_color: "Santorini Black",
      interior_color: "Ivory",
      mileage: 25000,
      odometer: 25000,
      vin: "SALGS2SE8MA123456"
    },
    features: {
      exterior: [
        "20-inch Alloy Wheels",
        "LED Headlights",
        "Power Tailgate",
        "Privacy Glass",
        "Roof Rails"
      ],
      interior: [
        "Leather Seats",
        "Meridian Audio System",
        "Navigation System",
        "Climate Control",
        "Panoramic Sunroof"
      ],
      mechanical: [
        "Terrain Response System",
        "Air Suspension",
        "All-Wheel Drive",
        "Hill Descent Control",
        "Towing Package"
      ]
    },
    report: {
      condition: "Excellent",
      inspection: "Passed",
      notes: "Minor stone chips on front bumper. All systems functioning perfectly. Recent service completed."
    },
    starting_price: 65000,
    current_price: 68000,
    highlight: [
      "Low Mileage",
      "Full Service History",
      "Premium Package",
      "Excellent Condition",
      "Warranty Remaining"
    ],
    included: [
      "Owner's Manual",
      "Tool Kit",
      "Spare Key",
      "Service Records",
      "Extended Warranty"
    ],
    seller: "LuxuryAutoGroup",
    seller_type: "Dealer",
    owner: "0xabc456def789ghi123"
  },

  // Compact Car
  "bmw-3-series": {
    year: 2020,
    make: "BMW",
    model: "330i xDrive",
    location: "New York, NY",
    country: "United States",
    lot: "LOT-005",
    images: createSampleImages(),
    description: "Sporty luxury sedan with all-wheel drive capability and premium features. The BMW 330i xDrive offers the perfect balance of performance, comfort, and technology for daily driving and weekend adventures.",
    summary: "2020 BMW 330i xDrive with M Sport package and premium features.",
    vehicale_overview: "This BMW 330i has been driven 30,000 miles and maintained at BMW service centers. The car features the M Sport package and has been kept in excellent condition with regular maintenance.",
    specifications: {
      engine_size: "2.0L Turbo I4",
      transmission: "8-Speed Automatic",
      fuel_type: "Petrol",
      exterior_color: "Alpine White",
      interior_color: "Black",
      mileage: 30000,
      odometer: 30000,
      vin: "WBA8E9G50LNT12345"
    },
    features: {
      exterior: [
        "M Sport Package",
        "18-inch Alloy Wheels",
        "LED Headlights",
        "Power Sunroof",
        "Heated Mirrors"
      ],
      interior: [
        "Sport Seats",
        "iDrive System",
        "Premium Audio",
        "Climate Control",
        "Ambient Lighting"
      ],
      mechanical: [
        "xDrive All-Wheel Drive",
        "Sport Suspension",
        "Dynamic Stability Control",
        "Run-Flat Tires",
        "Start/Stop System"
      ]
    },
    report: {
      condition: "Excellent",
      inspection: "Passed",
      notes: "Minor wear on driver's seat. All systems operational. Recent brake service completed."
    },
    starting_price: 35000,
    current_price: 37000,
    highlight: [
      "M Sport Package",
      "xDrive AWD",
      "Low Mileage",
      "Premium Features",
      "Excellent Condition"
    ],
    included: [
      "Owner's Manual",
      "Tool Kit",
      "Spare Key",
      "Service Records",
      "BMW Warranty"
    ],
    seller: "BMWManhattan",
    seller_type: "Dealer",
    owner: "0xdef789ghi123abc456"
  }
}

// Function to get sample data by key
export const getSampleData = (key: string): Partial<CarFormData> => {
  return sampleCarData[key] || sampleCarData["ferrari-488"]
}

// Function to get all available sample data keys
export const getSampleDataKeys = (): string[] => {
  return Object.keys(sampleCarData)
}

// Function to get random sample data
export const getRandomSampleData = (): Partial<CarFormData> => {
  const keys = getSampleDataKeys()
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return getSampleData(randomKey)
}

// Function to fill form with sample data
export const fillFormWithSampleData = (key: string): Partial<CarFormData> => {
  return getSampleData(key)
} 