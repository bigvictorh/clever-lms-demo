import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/app/lib/session';
import { JwtPayload } from 'jsonwebtoken'; // Import the JwtPayload type

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No session token found' }, { status: 401 });
  }

  try {
    // Verify the session token
    const decoded = verifySessionToken(token);

    // Type guard to ensure decoded is a JwtPayload and not a string
    if (typeof decoded !== 'string' && (decoded as JwtPayload).id) {
      const user = {
        id: (decoded as JwtPayload).id,
        name: (decoded as JwtPayload).name,
        email: (decoded as JwtPayload).email,
      };
      
      // Return the user info
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
