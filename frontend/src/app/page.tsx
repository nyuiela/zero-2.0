import Hero from '@/components/hero'
import AuctionGrid from '@/components/auction-grid'
import CarGrid from '@/components/cargrid'

export default function Home() {
  return (
    <main>
      <Hero />
      <CarGrid />
      <AuctionGrid />
    </main>
  )
}
