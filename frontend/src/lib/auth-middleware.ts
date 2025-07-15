// lib/auth-middleware.ts
import { getUser } from "@civic/auth/nextjs";
import { NextRequest } from "next/server";

/**
 * getCivicUser - Helper to get the Civic-authenticated user (if any) in API routes or server components.
 * Does NOT enforce authentication—returns user if present, or null if not.
 * Usage: const user = await getCivicUser(request);
 */
export async function getCivicUser(request: NextRequest) {
  return await getUser(); // Returns user object or null
} 