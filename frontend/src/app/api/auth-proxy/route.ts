import { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/api/auth`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const url = req.nextUrl.pathname.endsWith('/verify')
    ? `${API_BASE_URL}/api/auth/verify`
    : `${API_BASE_URL}/api/auth`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') || 'application/json',
      'Authorization': req.headers.get('authorization') || '',
    },
    body,
  })
  // Pass through headers if needed (e.g. JWT)
  const data = await res.json()
  const headers = new Headers()
  const authHeader = res.headers.get('authorization')
  if (authHeader) headers.set('authorization', authHeader)
  return new Response(JSON.stringify(data), { status: res.status, headers })
} 