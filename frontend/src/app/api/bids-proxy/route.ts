import { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const id = req.nextUrl.pathname.split('/').pop()
  const isDetail = id && id !== 'bids-proxy'
  const url = isDetail
    ? `${API_BASE_URL}/api/bids/${id}`
    : `${API_BASE_URL}/api/bids${searchParams ? '?' + searchParams.toString() : ''}`
  const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
  const data = await res.json()
  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const res = await fetch(`${API_BASE_URL}/api/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') || 'application/json',
      'Authorization': req.headers.get('authorization') || '',
    },
    body,
  })
  const data = await res.json()
  return Response.json(data)
} 