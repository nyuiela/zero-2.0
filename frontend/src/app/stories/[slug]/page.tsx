import { notFound } from 'next/navigation'
import Link from 'next/link'

const stories = [
  {
    slug: 'formula-one-evolution',
    title: 'From Formula One to F1, P1™ and W1 – the Evolution of McLaren',
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

export default function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = stories.find(s => s.slug === params.slug)
  if (!story) return notFound()
  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <div className="bg-white border-none rounded-xl shadow-lg max-w-3xl w-full p-8">
        <img src={story.image} alt={story.title} className="w-full h-80 object-cover rounded mb-6" />
        <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
        <p className="text-gray-600 mb-4">{story.date}</p>
        <p className="text-gray-700 mb-6">{story.content}</p>
        <Link href="/stories">
          <button className="bg-[#00296b] text-white px-6 py-2 rounded">Back to Stories</button>
        </Link>
      </div>
    </div>
  )
} 