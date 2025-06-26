import type { NextApiRequest, NextApiResponse } from 'next'

// In-memory session fallback (not persistent)
let sessionCars: any[] = []

export const config = {
  api: {
    bodyParser: false,
  },
}

import formidable from 'formidable'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Parse multipart form data
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Failed to parse form data' })
      }
      // Store in session (in-memory)
      sessionCars.push({ ...fields, files })
      return res.status(200).json({ status: 'success', message: 'Car registered (session fallback)' })
    })
    return
  }
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'success', cars: sessionCars })
  }
  res.status(405).json({ status: 'error', message: 'Method not allowed' })
} 