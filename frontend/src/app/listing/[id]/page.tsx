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
            <ListingClientRtk id={`${id}`} />
        </div>
    )
}