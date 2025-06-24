import Hero from '@/components/hero'
import AuctionGrid from '@/components/auction-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#202626]">
      <Hero />
      <AuctionGrid />
    </div>
  )
}
