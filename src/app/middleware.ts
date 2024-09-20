// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/app/lib/session'; // Import your session token verification function

// Middleware function to handle incoming requests
export function middleware(req: NextRequest) {
  // Get the session token from the request cookies
  const token = req.cookies.get('session_token')?.value;

  // If there's no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verify the session token (you can customize the logic in verifySessionToken)
  const isValidToken = verifySessionToken(token);

  // If the token is invalid, redirect to the login page
  if (!isValidToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow the request to continue if the token is valid
  return NextResponse.next();
}

// Specify the routes where this middleware should apply
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // Protect all routes under /dashboard and /profile
};
