import Hero from '@/components/hero'
import AuctionGrid from '@/components/auction-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-white/90">
      <Hero />
      <AuctionGrid />
    </div>
  )
}
