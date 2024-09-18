import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres'; // Using Vercel's Postgres package
import { generateSessionToken } from '@/app/lib/session'; // JWT session handling
import axios from 'axios';

// Exchange authorization code for access token
async function exchangeCodeForToken(code: string) {
  const redirectUri = process.env.CLEVER_REDIRECT_URI;
  const clientId = process.env.CLEVER_ID;
  const clientSecret = process.env.CLEVER_SECRET;

  if (!redirectUri || !clientId || !clientSecret) {
    throw new Error("Environment variables for Clever integration are missing.");
  }

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  console.log("Exchanging code for token...");
  
  const response = await axios.post(
    'https://clever.com/oauth/tokens',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  console.log("Received access token:", response.data.access_token);

  return response.data.access_token;
}

// Check if user exists, and insert new user if they don't
async function provisionUser(token: string) {
  try {
    console.log("Provisioning user...");

    // Get the user's ID from Clever's /me API
    const meResponse = await axios.get('https://api.clever.com/v3.0/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cleverUserId = meResponse.data.data.id;
    console.log("Clever User ID:", cleverUserId);

    // Connect to the PostgreSQL database using Vercel's Postgres client
    const client = await db.connect();

    // Check if the user exists in the database
    const { rows } = await client.sql`
      SELECT * FROM users WHERE clever_id = ${cleverUserId};
    `;

    let user;

    if (rows.length === 0) {
      // If user doesn't exist, fetch more details and create a new user
      const userResponse = await axios.get(`https://api.clever.com/v3.0/users/${cleverUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userResponse.data.data;

      // Insert the user into the PostgreSQL database
      const { rows: newUserRows } = await client.sql`
        INSERT INTO users (clever_id, name, email, password)
        VALUES (${userData.id}, ${userData.name.first + ' ' + userData.name.last}, ${userData.email}, 'password123')
        RETURNING *;
      `;

      user = newUserRows[0]; // Newly created user
    } else {
      user = rows[0]; // Existing user
    }

    console.log("Provisioned user:", user);

    // Release the database connection
    // await client.end();

    return user;
  } catch (error: any) {
    console.error('Error provisioning user:', error.response?.data || error.message);
    throw new Error('Failed to provision user');
  }
}

// Auth route handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/');
  }

  try {
    console.log("Step 1: Exchanging code for token...");
    const token = await exchangeCodeForToken(code);

    console.log("Step 2: Provisioning user...");
    const user = await provisionUser(token);

    console.log("Step 3: Generating session token...");
    const sessionToken = generateSessionToken(user);

    // Get the origin (protocol + host) from the request URL
    const origin = request.headers.get('origin') || 'http://localhost:3000'; // Fallback to localhost if not set
    
    // Construct the full URL for the dashboard
    const dashboardUrl = `${origin}/dashboard`;

    console.log("Step 4: Setting session cookie and redirecting to dashboard...");
    const response = NextResponse.redirect(dashboardUrl);
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error:any) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'Authentication failed', details: error.message }, { status: 500 });
  }
}
