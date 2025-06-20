export interface CarListing {
    id: number
    year: string
    make: string
    model: string
    location: string
    currentBid: string
    timeLeft: string
    bidCount: number
    reserve?: string
    country: string
    description: string
    images: string[]
    specifications: {
        engine: string
        power: string
        torque: string
        transmission: string
        drivetrain: string
        topSpeed: string
        acceleration: string
        weight: string
        fuel: string
        exterior: string
        interior: string
        wheels: string
        brakes: string
    }
    features: string[]
    history: string
    provenance: string
    seller: {
        name: string
        location: string
        phone: string
        email: string
        verified: boolean
    }
    startingBid: string
    estimatedValue: string
    auctionEnd: string
    views: number
    watchers: number
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
        id: 330,
        year: '2022',
        make: 'Ford',
        model: 'GT Holman Moody Heritage Edition',
        location: 'Cologne, Germany',
        currentBid: '€701,500',
        timeLeft: '13:06:33',
        bidCount: 30,
        reserve: 'Reserve Almost Met',
        country: 'Germany',
        description: 'This exceptional 2022 Ford GT Holman Moody Heritage Edition represents the pinnacle of American automotive engineering and racing heritage. With only 2,500 miles on the odometer, this pristine example showcases the legendary partnership between Ford and Holman Moody Racing.',
        images: [
            'https://ext.same-assets.com/360451443/3096838199.jpeg',
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
            'https://ext.same-assets.com/360451443/428281940.jpeg',
            'https://ext.same-assets.com/360451443/3549048287.jpeg',
            'https://ext.same-assets.com/360451443/701319310.jpeg',
            'https://ext.same-assets.com/360451443/3057433556.jpeg'
        ],
        specifications: {
            engine: '3.5L Twin-Turbo V6',
            power: '647 hp @ 6,250 rpm',
            torque: '550 lb-ft @ 5,900 rpm',
            transmission: '7-Speed Dual-Clutch Automatic',
            drivetrain: 'Rear-Wheel Drive',
            topSpeed: '218 mph',
            acceleration: '0-60 mph in 3.3 seconds',
            weight: '3,054 lbs',
            fuel: 'Premium Unleaded',
            exterior: 'Gulf Racing Blue',
            interior: 'Carbon Fiber with Alcantara',
            wheels: 'Carbon Fiber Racing Wheels',
            brakes: 'Brembo Carbon-Ceramic'
        },
        features: [
            'Carbon Fiber Body Panels',
            'Track Package',
            'Michelin Pilot Sport Cup 2 Tires',
            'Carbon Fiber Interior Trim',
            'Racing Harnesses',
            'Roll Cage',
            'Traction Management System',
            'Launch Control',
            'Bilstein Adaptive Dampers',
            'Titanium Roll Cage'
        ],
        history: 'Originally delivered to Holman Moody Racing for development testing, this Ford GT was used as a demonstration vehicle for the Heritage Edition program. It has been meticulously maintained by authorized Ford technicians and comes with complete service records.',
        provenance: 'Factory Fresh • Single Owner • Full Documentation • Collector Quality',
        seller: {
            name: 'Premium Automotive Collection',
            location: 'Cologne, Germany',
            phone: '+49 221 123 4567',
            email: 'info@premiumauto.de',
            verified: true
        },
        startingBid: '€500,000',
        estimatedValue: '€750,000 - €900,000',
        auctionEnd: '2025-06-18T18:00:00Z',
        views: 2847,
        watchers: 156
    },
    {
        id: 339,
        year: '2004',
        make: 'Ferrari',
        model: '360 Modena',
        location: 'Riverside, CA, USA',
        currentBid: 'US$81,000',
        timeLeft: '15:36:33',
        bidCount: 31,
        reserve: 'Reserve Almost Met',
        country: 'USA',
        description: 'A stunning example of Ferrari\'s legendary 360 Modena, this 2004 model represents the perfect balance of classic Ferrari design and modern performance. With its naturally aspirated V8 engine and timeless silhouette, this Modena continues the proud tradition of mid-engine Ferrari excellence.',
        images: [
            'https://ext.same-assets.com/360451443/3549048287.jpeg',
            'https://ext.same-assets.com/360451443/3096838199.jpeg',
            'https://ext.same-assets.com/360451443/428281940.jpeg',
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
            'https://ext.same-assets.com/360451443/701319310.jpeg',
            'https://ext.same-assets.com/360451443/3057433556.jpeg'
        ],
        specifications: {
            engine: '3.6L Naturally Aspirated V8',
            power: '400 hp @ 8,500 rpm',
            torque: '275 lb-ft @ 4,750 rpm',
            transmission: '6-Speed F1 Paddle Shift',
            drivetrain: 'Rear-Wheel Drive',
            topSpeed: '183 mph',
            acceleration: '0-60 mph in 4.3 seconds',
            weight: '3,477 lbs',
            fuel: 'Premium Unleaded',
            exterior: 'Rosso Corsa Red',
            interior: 'Tan Leather with Carbon Fiber',
            wheels: '18" Challenge Stradale Wheels',
            brakes: 'Brembo Ventilated Discs'
        },
        features: [
            'F1 Paddle Shift Transmission',
            'Tubi Exhaust System',
            'Carbon Fiber Interior Accents',
            'Sport Seats',
            'Yellow Brake Calipers',
            'Scuderia Ferrari Shields',
            'Navigation System',
            'Premium Audio System',
            'Climate Control',
            'Power Windows'
        ],
        history: 'This 360 Modena has been carefully maintained throughout its life with regular service at authorized Ferrari dealers. Complete maintenance records are available, showing consistent care and proper storage.',
        provenance: 'California Car • Clean Carfax • Service Records Available • Collector Owned',
        seller: {
            name: 'Classic Ferrari Specialists',
            location: 'Riverside, CA, USA',
            phone: '+1 951 555 0123',
            email: 'sales@classicferrari.com',
            verified: true
        },
        startingBid: 'US$65,000',
        estimatedValue: 'US$85,000 - US$110,000',
        auctionEnd: '2025-06-19T20:00:00Z',
        views: 1834,
        watchers: 89
    },
    {
        id: 327,
        year: '1999',
        make: 'Nissan',
        model: 'Skyline R34 GT-R',
        location: 'Dubai, United Arab Emirates',
        currentBid: '155,000 AED',
        timeLeft: '38:36:33',
        bidCount: 24,
        country: 'UAE',
        description: 'An iconic 1999 Nissan Skyline R34 GT-R, the final and most refined iteration of the legendary GT-R lineage. This example features the legendary RB26DETT twin-turbo inline-6 engine and ATTESA E-TS Pro all-wheel drive system that made the R34 a legend on both street and track.',
        images: [
            'https://ext.same-assets.com/360451443/701319310.jpeg',
            'https://ext.same-assets.com/360451443/3096838199.jpeg',
            'https://ext.same-assets.com/360451443/3549048287.jpeg',
            'https://ext.same-assets.com/360451443/428281940.jpeg',
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
            'https://ext.same-assets.com/360451443/3057433556.jpeg'
        ],
        specifications: {
            engine: '2.6L Twin-Turbo I6 (RB26DETT)',
            power: '276 hp @ 7,000 rpm',
            torque: '289 lb-ft @ 4,400 rpm',
            transmission: '6-Speed Manual (Getrag)',
            drivetrain: 'ATTESA E-TS Pro AWD',
            topSpeed: '155 mph (limited)',
            acceleration: '0-60 mph in 4.8 seconds',
            weight: '3,153 lbs',
            fuel: 'Premium Unleaded',
            exterior: 'Midnight Purple II',
            interior: 'Black Cloth with Alcantara',
            wheels: '18" BBS LM Wheels',
            brakes: 'Brembo 4-Piston Calipers'
        },
        features: [
            'ATTESA E-TS Pro AWD System',
            'Active LSD',
            'Multi-Function Display',
            'HICAS 4-Wheel Steering',
            'Recaro Sport Seats',
            'Nismo Exhaust System',
            'Boost Controller',
            'Oil Cooler',
            'Strut Tower Brace',
            'Limited Slip Differential'
        ],
        history: 'This R34 GT-R was imported from Japan and has been meticulously maintained by GT-R specialists. It retains its original RB26DETT engine and has been upgraded with performance enhancements while maintaining its authentic character.',
        provenance: 'JDM Import • Documented History • Performance Upgrades • Enthusiast Owned',
        seller: {
            name: 'JDM Legends Dubai',
            location: 'Dubai, United Arab Emirates',
            phone: '+971 4 555 0789',
            email: 'sales@jdmlegends.ae',
            verified: true
        },
        startingBid: '120,000 AED',
        estimatedValue: '180,000 - 220,000 AED',
        auctionEnd: '2025-06-20T19:00:00Z',
        views: 3156,
        watchers: 203
    },
    {
        id: 334,
        year: '2011',
        make: 'Morgan',
        model: 'Aero 8 Supersports',
        location: 'Dubai, United Arab Emirates',
        currentBid: 'US$96,000',
        timeLeft: '14:36:33',
        bidCount: 22,
        reserve: 'Reserve Almost Met',
        country: 'UAE',
        description: 'A rare Morgan Aero 8 Supersports, combining British craftsmanship with modern performance. Low mileage, well maintained.',
        images: [
            'https://ext.same-assets.com/360451443/3233359261.jpeg',
            'https://ext.same-assets.com/360451443/428281940.jpeg',
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
        ],
        specifications: {
            engine: '4.8L V8',
            power: '367 hp',
            torque: '370 Nm',
            transmission: '6-Speed Automatic',
            drivetrain: 'Rear-Wheel Drive',
            topSpeed: '170 mph',
            acceleration: '0-60 mph in 4.5 seconds',
            weight: '1,180 kg',
            fuel: 'Petrol',
            exterior: 'Silver',
            interior: 'Black Leather',
            wheels: 'Alloy',
            brakes: 'Disc'
        },
        features: [
            'Convertible Roof',
            'Premium Audio',
            'Navigation',
            'Leather Seats',
        ],
        history: 'Single owner, always garaged.',
        provenance: 'Dubai Import • Full Service History',
        seller: {
            name: 'Morgan Dubai',
            location: 'Dubai, UAE',
            phone: '+971 4 123 4567',
            email: 'info@morgandubai.com',
            verified: true
        },
        startingBid: 'US$80,000',
        estimatedValue: 'US$100,000 - US$120,000',
        auctionEnd: '2025-06-21T18:00:00Z',
        views: 1200,
        watchers: 45
    },
    {
        id: 335,
        year: '2016',
        make: 'Ferrari',
        model: '488 Spider',
        location: 'Dubai, United Arab Emirates',
        currentBid: '675,000 AED',
        timeLeft: '14:56:33',
        bidCount: 19,
        country: 'UAE',
        description: 'A stunning Ferrari 488 Spider in pristine condition, finished in classic Rosso Corsa.',
        images: [
            'https://ext.same-assets.com/360451443/428281940.jpeg',
            'https://ext.same-assets.com/360451443/3233359261.jpeg',
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
        ],
        specifications: {
            engine: '3.9L Twin-Turbo V8',
            power: '661 hp',
            torque: '760 Nm',
            transmission: '7-Speed Dual-Clutch',
            drivetrain: 'Rear-Wheel Drive',
            topSpeed: '211 mph',
            acceleration: '0-60 mph in 3.0 seconds',
            weight: '1,420 kg',
            fuel: 'Petrol',
            exterior: 'Red',
            interior: 'Black Leather',
            wheels: 'Forged Alloy',
            brakes: 'Carbon-Ceramic'
        },
        features: [
            'Convertible',
            'Carbon Fiber Trim',
            'Premium Audio',
        ],
        history: 'Dealer maintained, accident free.',
        provenance: 'UAE Delivery • Full Service History',
        seller: {
            name: 'Ferrari Dubai',
            location: 'Dubai, UAE',
            phone: '+971 4 555 1234',
            email: 'sales@ferraridubai.com',
            verified: true
        },
        startingBid: '600,000 AED',
        estimatedValue: '700,000 - 800,000 AED',
        auctionEnd: '2025-06-22T18:00:00Z',
        views: 900,
        watchers: 30
    },
    {
        id: 343,
        year: '2020',
        make: 'Mercedes-Benz',
        model: 'AMG GT 63 S Brabus 800',
        location: 'Dubai, United Arab Emirates',
        currentBid: '285,000 AED',
        timeLeft: '2 days',
        bidCount: 24,
        country: 'UAE',
        description: 'A rare Brabus 800 edition of the AMG GT 63 S, with full options and low mileage.',
        images: [
            'https://ext.same-assets.com/360451443/3057433556.jpeg',
            'https://ext.same-assets.com/360451443/428281940.jpeg',
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
        ],
        specifications: {
            engine: '4.0L V8 Biturbo',
            power: '800 hp',
            torque: '1,000 Nm',
            transmission: '9-Speed Automatic',
            drivetrain: 'All-Wheel Drive',
            topSpeed: '196 mph',
            acceleration: '0-60 mph in 2.9 seconds',
            weight: '2,045 kg',
            fuel: 'Petrol',
            exterior: 'Black',
            interior: 'Red Leather',
            wheels: 'Brabus Monoblock',
            brakes: 'Carbon-Ceramic'
        },
        features: [
            'Brabus Package',
            'Panoramic Roof',
            'Burmester Audio',
        ],
        history: 'One owner, showroom condition.',
        provenance: 'Dubai Brabus • Full Service History',
        seller: {
            name: 'Brabus Dubai',
            location: 'Dubai, UAE',
            phone: '+971 4 777 8888',
            email: 'info@brabusdubai.com',
            verified: true
        },
        startingBid: '250,000 AED',
        estimatedValue: '300,000 - 350,000 AED',
        auctionEnd: '2025-06-23T18:00:00Z',
        views: 1100,
        watchers: 40
    },
    {
        id: 289,
        year: '2024',
        make: 'Bentley',
        model: 'GT W12 Speed - 55km',
        location: 'Bautzen, Germany',
        currentBid: '€201,000',
        timeLeft: '36:36:33',
        bidCount: 27,
        country: 'Germany',
        description: 'Brand new Bentley GT W12 Speed with only 55km on the clock. Ultimate luxury and performance.',
        images: [
            'https://ext.same-assets.com/360451443/3638646694.jpeg',
            'https://ext.same-assets.com/360451443/3096838199.jpeg',
            'https://ext.same-assets.com/360451443/428281940.jpeg',
        ],
        specifications: {
            engine: '6.0L W12 Twin-Turbo',
            power: '650 hp',
            torque: '900 Nm',
            transmission: '8-Speed Automatic',
            drivetrain: 'All-Wheel Drive',
            topSpeed: '208 mph',
            acceleration: '0-60 mph in 3.5 seconds',
            weight: '2,244 kg',
            fuel: 'Petrol',
            exterior: 'Blue',
            interior: 'White Leather',
            wheels: '21" Alloy',
            brakes: 'Carbon-Ceramic'
        },
        features: [
            'Heated Seats',
            'Massage Seats',
            'Premium Audio',
        ],
        history: 'Brand new, delivery mileage.',
        provenance: 'German Delivery • One Owner',
        seller: {
            name: 'Bentley Bautzen',
            location: 'Bautzen, Germany',
            phone: '+49 3591 123456',
            email: 'sales@bentleybautzen.de',
            verified: true
        },
        startingBid: '€180,000',
        estimatedValue: '€220,000 - €250,000',
        auctionEnd: '2025-06-24T18:00:00Z',
        views: 800,
        watchers: 25
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