import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { JwtPayload } from 'jsonwebtoken'; 
import { verifySessionToken } from '@/app/lib/session';

export function getUserFromToken(token: string) {
  try {
    const decoded = verifySessionToken(token);

    if (typeof decoded !== 'string' && (decoded as JwtPayload).id) {
      return {
        id: (decoded as JwtPayload).id,
        name: (decoded as JwtPayload).name,
        email: (decoded as JwtPayload).email,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No session token found' }, { status: 401 });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({ user });
}

