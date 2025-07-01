import ListingClientRtk from '@/components/listing-client-rtk'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ListingPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params
    const carsLoading = false; // Replace with actual loading state
    const auctionId = id; // Replace with actual auction ID

    if (carsLoading || !auctionId) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <p className="text-4xl text-amber-400 font-bold animate-pulse text-center">
                    ZERO
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <ListingClientRtk id={`${id}`} />
            </main>
        </div>
    )
}