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
const listings: CarListing[] = [
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