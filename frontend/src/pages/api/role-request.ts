import type { NextApiRequest, NextApiResponse } from 'next'

// In-memory session fallback (not persistent)
let sessionRoleRequests: Record<string, 'pending' | 'approved' | 'rejected'> = {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address } = req.body
    if (!address) {
      return res.status(400).json({ status: 'error', message: 'Missing address' })
    }
    // Simulate backend: always set to pending
    sessionRoleRequests[address] = 'pending'
    return res.status(200).json({ status: 'success', message: 'Request submitted', roleRequestStatus: 'pending' })
  }
  if (req.method === 'GET') {
    const { address } = req.query
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Missing address' })
    }
    const status = sessionRoleRequests[address] || 'none'
    return res.status(200).json({ status: 'success', roleRequestStatus: status })
  }
  res.status(405).json({ status: 'error', message: 'Method not allowed' })
} 