import type { NextApiRequest, NextApiResponse } from 'next'

// In-memory session fallback (not persistent)
let sessionBids: { auctionId: string, address: string, amount: number, timestamp: number }[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { auctionId, address, amount } = req.body
    if (!auctionId || !address || typeof amount !== 'number') {
      return res.status(400).json({ status: 'error', message: 'Missing fields' })
    }
    sessionBids.push({ auctionId, address, amount, timestamp: Date.now() })
    return res.status(200).json({ status: 'success', message: 'Bid placed', bid: { auctionId, address, amount } })
  }
  if (req.method === 'GET') {
    const { auctionId } = req.query
    if (!auctionId || typeof auctionId !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Missing auctionId' })
    }
    const bids = sessionBids.filter(b => b.auctionId === auctionId)
    // Sort by amount descending
    const sorted = [...bids].sort((a, b) => b.amount - a.amount)
    // Add rank
    const ranked = sorted.map((b, i) => ({ ...b, rank: i + 1 }))
    return res.status(200).json({ status: 'success', bids: ranked })
  }
  res.status(405).json({ status: 'error', message: 'Method not allowed' })
} 