import { notFound } from 'next/navigation'
import ListingClient from '@/components/listing-client'
import { getCarListing, getRelatedAuctions } from '@/lib/data'

interface ListingPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params
    
    // Server-side data fetching
    const listing = getCarListing(id)

    if (!listing) {
        notFound()
    }

    const relatedAuctions = getRelatedAuctions(listing.id)

    return (
        <div className="min-h-screen bg-background">            
            <main className="container mx-auto px-4 py-8">
                <ListingClient listing={listing} relatedAuctions={relatedAuctions} />
            </main>
        </div>
    )
}