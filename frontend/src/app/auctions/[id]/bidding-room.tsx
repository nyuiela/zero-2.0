"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface Bid {
  auctionId: string
  address: string
  amount: number
  timestamp: number
  rank: number
}

export default function BiddingRoomPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount()
  const auctionId = params.id
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickBids, setQuickBids] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch bids (polling for real-time)
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch(`/api/bid?auctionId=${auctionId}`)
        const data = await res.json()
        if (data.status === 'success') {
          setBids(data.bids)
        }
      } catch (e) {
        // fallback: do nothing, just keep last state
      }
    }
    fetchBids()
    intervalRef.current = setInterval(fetchBids, 2000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [auctionId])

  // Update quick bid suggestions
  useEffect(() => {
    if (bids.length > 0) {
      const current = bids[0].amount
      setQuickBids([
        Math.ceil(current * 1.1),
        Math.ceil(current * 1.2),
        Math.ceil(current * 1.3),
        Math.ceil(current * 1.4)
      ])
    } else {
      setQuickBids([])
    }
  }, [bids])

  const handleBid = async (amount: number) => {
    if (!isConnected || !address) {
      toast.error('Connect your wallet to bid!')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId, address, amount })
      })
      const data = await res.json()
      if (data.status === 'success') {
        toast.success('Bid placed!')
        setBidAmount('')
      } else {
        throw new Error(data.message || 'Failed to place bid')
      }
    } catch (e) {
      toast.error('Failed to place bid (fallback or backend error)')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(bidAmount)
    if (!isNaN(amount) && amount > 0) {
      handleBid(amount)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Bidding Room for Auction #{auctionId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Current Highest Bid</h2>
              {bids.length > 0 ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-green-700">{bids[0].amount}</span>
                  <Badge className="bg-green-100 text-green-800">Highest Bidder</Badge>
                  <span className="text-xs text-gray-500">by {bids[0].address.slice(0, 6)}...{bids[0].address.slice(-4)}</span>
                </div>
              ) : (
                <span className="text-gray-400">No bids yet</span>
              )}
            </div>
            <form onSubmit={handleBidSubmit} className="flex gap-2 mb-4">
              <Input
                type="number"
                min={bids[0]?.amount ? bids[0].amount + 1 : 1}
                step="1"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={bids[0]?.amount ? `Bid more than ${bids[0].amount}` : 'Enter your bid'}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Bidding...' : 'Bid'}
              </Button>
            </form>
            {quickBids.length > 0 && (
              <div className="mb-4 flex gap-2">
                {quickBids.map((amt) => (
                  <Button key={amt} variant="outline" onClick={() => handleBid(amt)}>
                    Bid {amt}
                  </Button>
                ))}
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Bidder Ranks</h3>
              {bids.length > 0 ? (
                <ol className="list-decimal pl-6">
                  {bids.map((b, i) => (
                    <li key={b.address + b.amount} className={i === 0 ? 'font-bold text-green-700' : ''}>
                      {b.address.slice(0, 6)}...{b.address.slice(-4)} — {b.amount} <Badge className="ml-2">Rank {b.rank}</Badge>
                    </li>
                  ))}
                </ol>
              ) : (
                <span className="text-gray-400">No bids yet</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 