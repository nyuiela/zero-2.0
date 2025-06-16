import Header from '@/components/header'
import Hero from '@/components/hero'
import AuctionGrid from '@/components/auction-grid'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#202626]">
      <Hero />
      <AuctionGrid />
    </div>
  )
}
