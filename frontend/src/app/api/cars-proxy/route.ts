import { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/api/cars`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
  })
  const data = await res.json()
  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const res = await fetch(`${API_BASE_URL}/api/cars`, {
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