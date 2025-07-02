import ListingClientRtk from '@/components/listing-client-rtk'

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