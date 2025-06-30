<<<<<<< HEAD
'use client'
=======
"use client"
>>>>>>> 082db9adb652f31585cbfd83751eb7d876d78db8
import { useState } from 'react'

const faqs = [
  { q: 'How do I register a car brand?', a: 'Go to the Brands page and click Register Brand. Fill out the form and follow the steps.' },
  { q: 'How do I sell my vehicle?', a: 'Click Sell in the navigation or footer, and follow the guided steps to list your car for auction.' },
  { q: 'How do I contact support?', a: 'Use the Contact Us page or email us at support@zero.com.' },
  { q: 'What is ZERO?', a: 'ZERO is a decentralized car auction platform built on blockchain for transparency and trust.' },
  { q: 'Is ZERO available worldwide?', a: 'Yes, anyone can join and participate in auctions globally.' },
  { q: 'How do I bid on a car?', a: 'Go to Auctions, select a car, and place your bid. You need to connect your wallet.' },
  { q: 'How do I withdraw my earnings?', a: 'Go to your Profile and follow the withdrawal instructions.' },
  { q: 'What cryptocurrencies are supported?', a: 'Currently, we support ETH on Base Sepolia testnet.' },
  { q: 'How do I reset my password?', a: 'ZERO uses wallet-based authentication, so no passwords are needed.' },
  { q: 'How do I report a problem?', a: 'Contact us via the Contact Us page or email support@zero.com.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border-none p-10 rounded-xl shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={faq.q} className="border-b border-gray-200 pb-2">
              <button
                className="w-full text-left font-semibold text-lg flex justify-between items-center focus:outline-none"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                {faq.q}
                <span className="ml-2 text-[#00296b]">{open === idx ? '-' : '+'}</span>
              </button>
              {open === idx && (
                <div className="mt-2 text-gray-600 text-base animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 