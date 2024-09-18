// src/app/lib/session.ts

import jwt from 'jsonwebtoken';

// Generate a JWT session token for a user
export function generateSessionToken(user: any) {
  const secret = process.env.JWT_SECRET || 'default_secret';

  // Create a token with the user info, signed with a secret
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    secret,
    { expiresIn: '1d' } // Token expires in 1 day
  );
}

// Verify the JWT session token
export function verifySessionToken(token: string) {
  const secret = process.env.JWT_SECRET || 'default_secret';

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
