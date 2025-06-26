import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const Hero = () => {
  const featuredAuctions = [
    {
      id: 340,
      year: '2010',
      make: 'Dodge',
      model: 'Viper SRT-10 Roadster',
      image: 'https://ext.same-assets.com/360451443/3746763894.jpeg',
      link: '/listing/340'
    },
    {
      id: 330,
      year: '2022',
      make: 'Ford',
      model: 'GT Holman Moody Heritage Edition',
      image: 'https://ext.same-assets.com/360451443/1059592237.jpeg',
      link: '/listing/330'
    }
  ]

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {featuredAuctions.map((auction) => (
            <Link
              key={auction.id}
              href={auction.link}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl bg-gray-900 aspect-[16/10]">
                <Image
                  src={auction.image}
                  alt={`${auction.year} ${auction.make} ${auction.model}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  <div className="text-brand text-white text-lg lg:text-xl font-semibold mb-2">
                    {auction.year}
                  </div>
                  <h2 className="text-white text-2xl lg:text-4xl font-bold mb-2 lg:mb-3">
                    {auction.make}
                  </h2>
                  <p className="text-white text-lg lg:text-2xl mb-4 lg:mb-6 leading-tight">
                    {auction.model}
                  </p>
                  <Button
                    className="bg-white/60 hover:bg-[#593e35] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform group-hover:scale-105 w-fit"
                  >
                    Bid Now
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero