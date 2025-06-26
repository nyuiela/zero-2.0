import formidable from 'formidable'
import { Readable } from 'stream'

// In-memory session fallback (not persistent)
let sessionCars: any[] = []

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  // Parse multipart form data using formidable
  const form = new formidable.IncomingForm()
  // formidable expects a Node.js IncomingMessage, so we need to adapt the Request
  const buffers = []
  const reader = req.body?.getReader()
  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffers.push(value)
    }
  }
  // Adapt the request body to a Node.js Readable stream for formidable
  // formidable expects a Node.js IncomingMessage, but we don't have access to it in the edge runtime.
  // Instead, we create a minimal compatible object.
  const nodeReq = Readable.from(Buffer.concat(buffers)) as any
  nodeReq.headers = Object.fromEntries(req.headers.entries())

  return new Promise((resolve) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ status: 'error', message: 'Failed to parse form data' }), { status: 500 }))
        return
      }
      sessionCars.push({ ...fields, files })
      resolve(new Response(JSON.stringify({ status: 'success', message: 'Car registered (session fallback)' }), { status: 200 }))
    })
  })
}

export async function GET() {
  return new Response(JSON.stringify({ status: 'success', cars: sessionCars }), { status: 200 })
} 