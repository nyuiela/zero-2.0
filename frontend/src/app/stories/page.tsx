import Link from 'next/link'

const stories = [
  {
    slug: 'formula-one-evolution',
    title: 'From Formula One to F1, P1™ and W1  the Evolution of McLaren',
    description: 'Born in Auckland, New Zealand, in 1937, Bruce McLaren won four Grand Prix during his track career and, for 44 years, held the record as the youngest ever Grand Prix winner.',
    date: '02 JUNE, 2025',
    image: '/public/story1.jpg',
    hero: true,
    content: 'Full story content for McLaren evolution...'
  },
  {
    slug: 'adamastor-furia',
    title: 'The Adamastor Furia — Portugals First Supercar',
    description: 'Most people think of wine, beaches and Cristiano Ronaldo when it comes to Portugal, but the sunny country in the westernmost part of Europe is now home to a new supercar.',
    date: '02 MAY, 2025',
    image: '/public/story2.jpg',
    hero: false,
    content: 'Full story content for Adamastor Furia...'
  },
  {
    slug: 'falcon-f7',
    title: 'Rarely heard of American supercar was so exclusive...',
    description: 'The Falcon F7 is a rare and almost forgotten supercar built in the United States in the early 2010s. The idea was to combine...',
    date: '24 APRIL, 2025',
    image: '/public/story3.jpg',
    hero: false,
    content: 'Full story content for Falcon F7...'
  },
]

export default function StoriesPage() {
  const heroStory = stories.find(s => s.hero)
  const otherStories = stories.filter(s => !s.hero)
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Hero Section */}
      {heroStory && (
        <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto mb-12 rounded-xl shadow-lg overflow-hidden bg-transparent">
          <img src={heroStory.image} alt={heroStory.title} className="w-full md:w-1/2 h-80 object-cover" />
          <div className="p-8 flex-1 bg-transparent">
            <h1 className="text-3xl font-bold mb-4">{heroStory.title}</h1>
            <p className="text-gray-600 mb-4">{heroStory.description}</p>
            <Link href={`/stories/${heroStory.slug}`}>
              <button className="bg-[#00296b] text-white px-6 py-2 rounded">Read more</button>
            </Link>
          </div>
        </div>
      )}
      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {otherStories.map(story => (
          <div key={story.slug} className="bg-white border-none rounded-xl shadow p-4 flex flex-col">
            <img src={story.image} alt={story.title} className="w-full h-56 object-cover rounded mb-4" />
            <h2 className="text-xl font-bold mb-2">{story.title}</h2>
            <p className="text-gray-600 mb-2">{story.description}</p>
            <div className="flex-1" />
            <div className="flex items-center justify-between mt-2">
              <Link href={`/stories/${story.slug}`}>
                <button className="bg-[#00296b] text-white px-4 py-2 rounded text-sm">Read more</button>
              </Link>
              <span className="text-xs text-gray-400">{story.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 