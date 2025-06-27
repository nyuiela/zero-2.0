// In-memory session fallback (not persistent)
let sessionRoleRequests: Record<string, 'pending' | 'approved' | 'rejected'> = {}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json()
  const { address } = body
  if (!address) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing address' }), { status: 400 })
  }
  // Simulate backend: always set to pending
  sessionRoleRequests[address] = 'pending'
  return new Response(JSON.stringify({ status: 'success', message: 'Request submitted', roleRequestStatus: 'pending' }), { status: 200 })
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  if (!address) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing address' }), { status: 400 })
  }
  const status = sessionRoleRequests[address] || 'none'
  return new Response(JSON.stringify({ status: 'success', roleRequestStatus: status }), { status: 200 })
} 