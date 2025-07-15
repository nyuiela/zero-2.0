// src/app/api/user/profile/route.ts
import { getCivicUser } from '@/lib/auth-middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const user = await getCivicUser(request);
  if (!user) {
    return NextResponse.json({
      greeting: 'Hello, guest!',
      user: null,
    });
  }
  return NextResponse.json({
    greeting: `Hello, ${user.name || user.email || 'user'}!`,
    user,
  });
} 