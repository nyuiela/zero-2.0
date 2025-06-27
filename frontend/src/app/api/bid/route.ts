// In-memory session fallback (not persistent)
let sessionBids: { auctionId: string, address: string, amount: number, timestamp: number }[] = []

export async function POST(req: Request): Promise<Response> {
  const body = await req.json()
  const { auctionId, address, amount } = body
  if (!auctionId || !address || typeof amount !== 'number') {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing fields' }), { status: 400 })
  }
  sessionBids.push({ auctionId, address, amount, timestamp: Date.now() })
  return new Response(JSON.stringify({ status: 'success', message: 'Bid placed', bid: { auctionId, address, amount } }), { status: 200 })
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const auctionId = searchParams.get('auctionId')
  if (!auctionId) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing auctionId' }), { status: 400 })
  }
  const bids = sessionBids.filter(b => b.auctionId === auctionId)
  // Sort by amount descending
  const sorted = [...bids].sort((a, b) => b.amount - a.amount)
  // Add rank
  const ranked = sorted.map((b, i) => ({ ...b, rank: i + 1 }))
  return new Response(JSON.stringify({ status: 'success', bids: ranked }), { status: 200 })
} 