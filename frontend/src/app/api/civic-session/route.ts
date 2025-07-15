import { NextRequest, NextResponse } from 'next/server';

const CIVIC_SESSION_COOKIE = 'civic_session';

// POST: Store Civic session info in a secure, httpOnly cookie
export async function POST(req: NextRequest) {
  const data = await req.json();
  // Expecting { username, address, authenticated }
  const { username, address, authenticated } = data;
  if (!username || !address || !authenticated) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const cookieValue = JSON.stringify({ username, address, authenticated });
  const response = NextResponse.json({ success: true });
  response.cookies.set(CIVIC_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

// GET: Retrieve Civic session info from cookie
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(CIVIC_SESSION_COOKIE);
  if (!cookie) {
    return NextResponse.json({ authenticated: false });
  }
  try {
    const session = JSON.parse(cookie.value);
    return NextResponse.json({ ...session });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
} 