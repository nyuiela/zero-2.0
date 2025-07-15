import { authMiddleware } from "@civic/auth-web3/nextjs/middleware"

export default authMiddleware();

export const config = {
  matcher: [
    // Exclude _next, favicon, images, AND /login
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif|login).*)',
  ],
} 