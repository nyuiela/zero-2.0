import { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = (await params).id

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 })
  }

  const res = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
  })
  const data = await res.json()
  // If data is { data: [object], ... }, return data.data[0]
  if (data && Array.isArray(data.data) && data.data.length > 0) {
    return Response.json(data.data[0])
  }
  // fallback: return as is
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