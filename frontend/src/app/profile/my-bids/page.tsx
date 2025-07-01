"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend, CartesianGrid } from "recharts"
import { TrendingUp, Award, Gavel, Clock, User, Flame, Trophy, ArrowUpRight, ArrowDownLeft, Star, Zap, BarChart3, Users, Activity, Calendar, Timer, ChevronLeft, ChevronRight } from "lucide-react"

// Mock bid data
const mockBids = [
  { id: 1, car: "2022 Ford GT", amount: 701500, status: "win", time: "2024-07-10T14:00:00Z", address: "0x1234...abcd" },
  { id: 2, car: "2011 Morgan Aero 8", amount: 96000, status: "loss", time: "2024-07-09T13:00:00Z", address: "0x1234...abcd" },
  { id: 3, car: "2016 Ferrari 488", amount: 675000, status: "almost", time: "2024-07-08T12:00:00Z", address: "0x1234...abcd" },
  { id: 4, car: "2004 Ferrari 360", amount: 81000, status: "win", time: "2024-07-07T11:00:00Z", address: "0x1234...abcd" },
  { id: 5, car: "2024 Bentley GT", amount: 201000, status: "loss", time: "2024-07-06T10:00:00Z", address: "0x1234...abcd" },
  { id: 6, car: "1999 Nissan Skyline", amount: 155000, status: "almost", time: "2024-07-05T09:00:00Z", address: "0x1234...abcd" },
  { id: 7, car: "2020 Mercedes AMG GT", amount: 285000, status: "win", time: "2024-07-04T08:00:00Z", address: "0x1234...abcd" },
  { id: 8, car: "2020 Nissan GT-R", amount: 275000, status: "loss", time: "2024-07-03T07:00:00Z", address: "0x1234...abcd" },
]

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]
const statusMap: Record<string, string> = { win: "Win", loss: "Loss", almost: "Almost Win" }

// Advanced mocks
const leaderboard = [
  { user: "0x1234...abcd", wins: 3, total: 8, amount: 1200000 },
  { user: "0x5678...efgh", wins: 2, total: 6, amount: 900000 },
  { user: "0x9abc...def0", wins: 1, total: 4, amount: 600000 },
]
const heatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({ day, hour, value: Math.floor(Math.random() * 3) }))
).flat()

export default function MyBidsPage() {
  // Stats
  const totalBids = mockBids.length
  const wins = mockBids.filter(b => b.status === "win").length
  const losses = mockBids.filter(b => b.status === "loss").length
  const almost = mockBids.filter(b => b.status === "almost").length
  const totalAmount = mockBids.reduce((sum, b) => sum + b.amount, 0)
  const avgBid = totalBids ? Math.round(totalAmount / totalBids) : 0
  const winRate = totalBids ? Math.round((wins / totalBids) * 100) : 0
  const highestBid = Math.max(...mockBids.map(b => b.amount))
  const lowestBid = Math.min(...mockBids.map(b => b.amount))
  const mostBidCar = mockBids.reduce((acc, b) => {
    acc[b.car] = (acc[b.car] || 0) + 1; return acc
  }, {} as Record<string, number>)
  const mostBidCarName = Object.entries(mostBidCar).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
  const mostCommonIncrement = 5000 // mock
  const streak = 2 // mock
  const clutchWins = 1 // mock
  const luckLosses = 1 // mock

  // Chart data
  const pieData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
    { name: "Almost", value: almost },
  ]
  const barData = mockBids.map(b => ({ car: b.car, amount: b.amount, status: statusMap[b.status as string] }))
  const lineData = mockBids.map((b, i) => ({ name: `Bid ${i + 1}`, amount: b.amount }))

  // Pagination
  const [page, setPage] = useState(1)
  const pageSize = 6
  const pagedBids = mockBids.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(mockBids.length / pageSize)

  // Filter
  const [filter, setFilter] = useState<string>("all")
  const filteredBids = filter === "all" ? mockBids : mockBids.filter(b => b.status === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff] py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <h1 className="text-4xl font-extrabold mb-6 text-[#00296b] flex items-center gap-2 tracking-tight">
          <Gavel className="h-8 w-8 text-amber-500 animate-bounce" /> My Bids
        </h1>
        {/* Advanced Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#fffbe6] to-[#e0e7ff] border-none shadow-lg animate-fade-in-up">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-[#00296b] flex items-center justify-center gap-2">
                {totalBids} <BarChart3 className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-sm text-gray-600">Total Bids</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#e0ffe6] to-[#e0e7ff] border-none shadow-lg animate-fade-in-up delay-100">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-green-600 flex items-center justify-center gap-2">
                {wins} <Trophy className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-sm text-gray-600">Wins</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#ffe6e6] to-[#e0e7ff] border-none shadow-lg animate-fade-in-up delay-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-red-500 flex items-center justify-center gap-2">
                {losses} <ArrowDownLeft className="h-6 w-6 text-red-400" />
              </div>
              <div className="text-sm text-gray-600">Losses</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#fffbe6] to-[#e0e7ff] border-none shadow-lg animate-fade-in-up delay-300">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-yellow-500 flex items-center justify-center gap-2">
                {almost} <Flame className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-sm text-gray-600">Almost Wins</div>
            </CardContent>
          </Card>
        </div>
        {/* Super Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-none shadow-md animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-green-500" /> Win Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-green-600">{winRate}%</CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md animate-fade-in-up delay-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Award className="h-5 w-5 text-amber-500" /> Highest Bid</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-amber-600">${highestBid.toLocaleString()}</CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md animate-fade-in-up delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Star className="h-5 w-5 text-blue-500" /> Most Bid-On Car</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-blue-600">{mostBidCarName}</CardContent>
          </Card>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border-none shadow-md animate-fade-in-up">
            <CardHeader>
              <CardTitle>Bidding Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md animate-fade-in-up delay-100">
            <CardHeader>
              <CardTitle>Bidding Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="car" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#00C49F" name="Bid Amount" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Leaderboard & Heatmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border-none shadow-md animate-fade-in-up">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div key={entry.user} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]">
                    <span className="font-bold text-lg text-[#00296b]">#{i + 1}</span>
                    <span className="font-mono text-sm">{entry.user}</span>
                    <Badge variant="default" className="ml-2">{entry.wins} Wins</Badge>
                    <span className="ml-auto font-semibold text-green-600">${entry.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md animate-fade-in-up delay-100">
            <CardHeader>
              <CardTitle>Bid Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-gray-400">
                {/* Placeholder for heatmap chart */}
                <span className="text-xs">(Heatmap coming soon)</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Bidding Strategy */}
        <Card className="bg-gradient-to-br from-[#fffbe6] to-[#e0e7ff] border-none shadow-md animate-fade-in-up mb-8">
          <CardHeader>
            <CardTitle>Bidding Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-lg font-semibold text-[#00296b] mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" /> Avg. Time Between Bids
                </div>
                <div className="text-2xl font-bold">2 hrs</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#00296b] mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" /> Most Common Increment
                </div>
                <div className="text-2xl font-bold">$5,000</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#00296b] mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" /> Streak
                </div>
                <div className="text-2xl font-bold">2 Wins</div>
              </div>
            </div>
            <div className="mt-6">
              <LineChart width={400} height={200} data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </div>
          </CardContent>
        </Card>
        {/* Bid History Table */}
        <Card className="bg-white border-none shadow-md animate-fade-in-up mb-8">
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
              <Button size="sm" variant={filter === "win" ? "default" : "outline"} onClick={() => setFilter("win")}>Wins</Button>
              <Button size="sm" variant={filter === "loss" ? "default" : "outline"} onClick={() => setFilter("loss")}>Losses</Button>
              <Button size="sm" variant={filter === "almost" ? "default" : "outline"} onClick={() => setFilter("almost")}>Almost</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Car</th>
                    <th className="py-2 px-2">Amount</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBids.slice((page - 1) * pageSize, page * pageSize).map((bid) => (
                    <tr key={bid.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 font-medium">{bid.car}</td>
                      <td className="py-2 px-2">${bid.amount.toLocaleString()}</td>
                      <td className="py-2 px-2">
                        <Badge variant={bid.status === "win" ? "default" : bid.status === "loss" ? "destructive" : "secondary"}>
                          {statusMap[bid.status as string]}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">{new Date(bid.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft /></Button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 