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

function formatCurrency(amount: number, currency: 'ETH' | 'USDC' = 'ETH') {
  return currency === 'ETH'
    ? `${amount} ETH`
    : `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC`
}

export default function BiddingRoomPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount()
  const auctionId = params.id
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickBids, setQuickBids] = useState<number[]>([])
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const [timer, setTimer] = useState(60)
  const [lastBidTimestamp, setLastBidTimestamp] = useState<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Fetch bids (polling for real-time)
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch(`/api/bid?auctionId=${auctionId}`)
        const data = await res.json()
        if (data.status === 'success') {
          setBids(data.bids)
          if (data.bids.length > 0) {
            setLastBidTimestamp(data.bids[0].timestamp)
            setTimer(60) // Reset timer on new bid
          }
        }
      } catch (e) {
        // fallback: do nothing, just keep last state
      }
    }
    fetchBids()
    intervalRef.current = setInterval(fetchBids, 2000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [auctionId])

  // Timer logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1
        return 0
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [lastBidTimestamp])

  // Quick bid suggestions (10–80%)
  useEffect(() => {
    if (bids.length > 0) {
      const current = bids[0].amount
      setQuickBids([
        Math.ceil(current * 1.1),
        Math.ceil(current * 1.2),
        Math.ceil(current * 1.4),
        Math.ceil(current * 1.5),
        Math.ceil(current * 1.6),
        Math.ceil(current * 1.7),
        Math.ceil(current * 1.8),
      ])
    } else {
      setQuickBids([])
    }
  }, [bids])

  // Confetti on new top bid
  useEffect(() => {
    if (bids.length > 0 && address && bids[0].address === address) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    }
  }, [bids, address])

  const handleBid = async (amount: number) => {
    if (!isConnected || !address) {
      toast.error('Connect your wallet to bid!')
      return
    }
    // Enforce stake
    const stake = amount * 0.12
    toast.info(`You must stake ${formatCurrency(stake, currency)} to place this bid.`)
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
        setTimer(60) // Reset timer
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
    if (!isNaN(amount) && amount > (bids[0]?.amount || 0)) {
      handleBid(amount)
    } else {
      toast.error('Bid must be higher than current!')
    }
  }

  // Timer urgency color
  const timerColor = timer > 20 ? 'text-green-600' : timer > 10 ? 'text-yellow-500 animate-pulse' : 'text-red-600 animate-bounce'
  // Progress bar width
  const progressWidth = `${(timer / 60) * 100}%`

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232526] to-[#414345] flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none animate-fade-in">
          {/* Simple confetti effect */}
          <div className="w-full h-full flex flex-wrap items-center justify-center">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, position: 'absolute', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl mx-auto z-10">
        <Card className="shadow-2xl border-amber-400">
          <CardHeader className="bg-gradient-to-r from-amber-400 to-yellow-300 rounded-t-xl">
            <CardTitle className="text-black text-2xl flex items-center gap-4">
              Bidding Room for Auction #{auctionId}
              <Badge className="bg-white text-amber-600 border-amber-400">LIVE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-b-xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-900">Current Highest Bid</h2>
              {bids.length > 0 ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-green-700 animate-pulse">{formatCurrency(bids[0].amount, currency)}</span>
                  <Badge className="bg-green-100 text-green-800">Highest Bidder</Badge>
                  <span className="text-xs text-gray-500">by {bids[0].address.slice(0, 6)}...{bids[0].address.slice(-4)}</span>
                </div>
              ) : (
                <span className="text-gray-400">No bids yet</span>
              )}
            </div>
            {/* Timer */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${timerColor}`}>Time Left: {timer}s</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-amber-400 transition-all" style={{ width: progressWidth }} />
                </div>
              </div>
              {timer === 0 && (
                <div className="text-red-600 font-bold mt-2 animate-bounce">Bidding round ended!</div>
              )}
            </div>
            {/* Currency Toggle */}
            <div className="mb-4 flex gap-2 items-center">
              <span className="text-sm text-gray-600">Currency:</span>
              <Button variant={currency === 'ETH' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('ETH')}>ETH</Button>
              <Button variant={currency === 'USDC' ? 'default' : 'outline'} size="sm" onClick={() => setCurrency('USDC')}>USDC</Button>
            </div>
            {/* Bid Form */}
            <form onSubmit={handleBidSubmit} className="flex gap-2 mb-4">
              <Input
                type="number"
                min={bids[0]?.amount ? bids[0].amount + 1 : 1}
                step="1"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={bids[0]?.amount ? `Bid more than ${formatCurrency(bids[0].amount, currency)}` : 'Enter your bid'}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isSubmitting || timer === 0} className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold">
                {isSubmitting ? 'Bidding...' : 'Bid'}
              </Button>
            </form>
            {/* Stake Info */}
            {bidAmount && parseFloat(bidAmount) > 0 && (
              <div className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Stake Required:</span> {formatCurrency(parseFloat(bidAmount) * 0.12, currency)} (12% of bid)
              </div>
            )}
            {/* Quick Bid Buttons */}
            {quickBids.length > 0 && (
              <div className="mb-4 flex gap-2 flex-wrap">
                {quickBids.map((amt, idx) => (
                  <Button key={amt} variant="outline" className="border-amber-400 text-amber-600 font-bold hover:bg-amber-400 hover:text-white animate-fade-in" onClick={() => handleBid(amt)}>
                    Bid {formatCurrency(amt, currency)}
                  </Button>
                ))}
              </div>
            )}
            {/* Bidder Ranks */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2 text-gray-900">Bidder Ranks</h3>
              {bids.length > 0 ? (
                <ol className="list-decimal pl-6">
                  {bids.map((b, i) => (
                    <li key={b.address + b.amount} className={i === 0 ? 'font-bold text-green-700 animate-pulse' : ''}>
                      {b.address.slice(0, 6)}...{b.address.slice(-4)} — {formatCurrency(b.amount, currency)} <Badge className="ml-2">Rank {b.rank}</Badge>
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