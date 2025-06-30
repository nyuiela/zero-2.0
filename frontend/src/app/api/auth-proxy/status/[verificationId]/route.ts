import { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(
  req: NextRequest,
  { params }: { params: { verificationId: string } }
) {
  const res = await fetch(`${API_BASE_URL}/api/auth/status/${params.verificationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return Response.json(data)
} 