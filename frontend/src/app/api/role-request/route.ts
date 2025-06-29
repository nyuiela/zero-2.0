// In-memory session fallback (not persistent)
const sessionRoleRequests: { address: string, status: 'pending' | 'approved' | 'rejected', timestamp: number }[] = []

export async function POST(req: Request): Promise<Response> {
  // Check for JWT token in Authorization header
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    return new Response(JSON.stringify({ status: 'error', message: 'Authentication required' }), { status: 401 })
  }

  // In a real implementation, you would validate the JWT token here
  console.log('Role request with token:', token ? 'Present' : 'Missing')

  const body = await req.json()
  const { address } = body
  
  if (!address) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing address' }), { status: 400 })
  }

  // Check if request already exists
  const existingRequest = sessionRoleRequests.find(r => r.address === address)
  if (existingRequest) {
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: 'Role request already exists',
      currentStatus: existingRequest.status 
    }), { status: 400 })
  }

  sessionRoleRequests.push({ 
    address, 
    status: 'pending', 
    timestamp: Date.now() 
  })

  return new Response(JSON.stringify({ 
    status: 'success', 
    message: 'Role request submitted successfully',
  }), { status: 200 })
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  
  if (!address) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing address' }), { status: 400 })
  }

  const request = sessionRoleRequests.find(r => r.address === address)
  
  if (!request) {
    return new Response(JSON.stringify({ 
      status: 'success', 
    }), { status: 200 })
  }

  return new Response(JSON.stringify({ 
    // status: 'success', 
    status: request.status 
  }), { status: 200 })
} 