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
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <ListingClientRtk id={`${id}`} />
            </main>
        </div>
    )
}