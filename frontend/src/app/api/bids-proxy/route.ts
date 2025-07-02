import { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const id = req.nextUrl.pathname.split('/').pop()
    const isDetail = id && id !== 'bids-proxy'
    const url = isDetail
      ? `${API_BASE_URL}/api/bids/a/${id}`
      : `${API_BASE_URL}/api/bids${searchParams ? '?' + searchParams.toString() : ''}`

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) {
      return Response.json(
        { error: `API request failed: ${res.status} ${res.statusText}` },
        { status: res.status }
      )
    }

    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json()
      return Response.json(data)
    } else {
      const text = await res.text()
      return Response.json({ data: text })
    }
  } catch (error) {
    console.error('Bids proxy GET error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('body', body)
    const res = await fetch(`${API_BASE_URL}/api/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        'Authorization': req.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return Response.json(
        { error: `API request failed:  ${res.status} ${res.statusText}` },
        { status: res.status }
      )
    }

    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json()
      return Response.json(data)
    } else {
      const text = await res.text()
      return Response.json({ data: text })
    }
  } catch (error) {
    console.error('Bids proxy POST error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 