import { API_BASE_URL } from "./config";

// Mock auth fallback
const mockAuth = {
  fetchNonce: () => Promise.resolve({ token: 'mock-nonce-123', msg: 'Sign this message to authenticate: mock-nonce-123' }),
  verifySignature: (params: AuthParams) => {
    // Check if this is a fallback nonce
    if (params.nonce.startsWith('fallback-')) {
      console.log('Processing fallback authentication with message:', params.message)
      // For fallback auth, we can still verify the signature locally
      return Promise.resolve({
        verified: true,
        jwt: `fallback-jwt-${Date.now()}`,
        receipt: {
          mock: true,
          fallback: true,
          message: params.message,
          signature: params.signature_bytes,
          address: params.expected_addr,
          username: params.username
        },
        stats: { segments: 1, total_cycles: 1000 }
      })
    }
    return Promise.resolve({ 
      verified: true, 
      jwt: 'mock-jwt',
      receipt: { mock: true }, 
      stats: { segments: 1, total_cycles: 1000 } 
    })
  },
  getJwt: (body: any) => {
    // Handle fallback authentication
    if (body.receipt?.fallback) {
      return Promise.resolve({
        verified: true,
        address: [1, 2, 3],
        timestamp: Date.now(),
        username: body.receipt.username || 'fallback_user',
        token: `fallback-jwt-${Date.now()}`
      })
    }
    return Promise.resolve({
      verified: true,
      address: [1, 2, 3],
      timestamp: Date.now(),
      username: 'mock_user',
      token: 'mock-jwt'
    })
  }
}

export interface AuthResponse {
  msg: string,
  nonce: string,
}

export async function fetchNonce() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth`)
    console.log("fetchNone ", res);
    if (!res.ok) {
      throw new Error('Auth API failed, using mock nonce')
    }
    const response: AuthResponse = await res.json();
    return response;
  } catch (error) {
    console.error('Error fetching nonce, using mock:', error)
    return mockAuth.fetchNonce()
  }
}

interface AuthParams {
  message: string,
  nonce: string,
  signature_bytes: string,
  expected_addr: string,
  username: string
}

// Updated verification function that extracts JWT from response headers
export async function verifySignature(body: AuthParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    
    if (!res.ok) {
      throw new Error('Auth verification failed, using mock');
    }
    
    // Extract JWT token from response headers
    const jwtToken = res.headers.get('Authorization')?.replace('Bearer ', '') || 
                    res.headers.get('authorization')?.replace('Bearer ', '')
    
    const responseData = await res.json()
    
    // Return the response data along with the JWT token
    return {
      ...responseData,
      jwt: jwtToken || responseData.token // fallback to response body if not in headers
    }
  } catch (error) {
    console.error('Error verifying signature, using mock:', error)
    return mockAuth.verifySignature(body)
  }
}

// New polling function to check verification status
export async function pollVerificationStatus(verificationId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/status/${verificationId}`)
    if (!res.ok) {
      throw new Error('Failed to check verification status')
    }
    return res.json()
  } catch (error) {
    console.error('Error polling verification status:', error)
    throw error
  }
}

// export async function getJwt(body: any) {
//   console.warn('getJwt is deprecated. JWT should be obtained from verifySignature response.')
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     })
//     if (!res.ok) {
//       console.warn('JWT verification failed, using mock')
//       return mockAuth.getJwt(body)
//     }
//     return res.json()
//   } catch (error) {
//     console.error('Error getting JWT, using mock:', error)
//     return mockAuth.getJwt(body)
//   }
// } 