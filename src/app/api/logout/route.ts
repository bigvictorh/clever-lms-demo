// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Clear any session data, cookies, etc.
  const response = NextResponse.json({ message: 'Logout successful' });
  
  // Removing the session cookie
  response.cookies.set('session_token', '', {
    maxAge: -1,
    path: '/',
  });

  return response;
}
