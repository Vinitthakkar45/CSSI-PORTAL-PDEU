import { NextResponse } from 'next/server';

// Used by Docker healthcheck: wget -qO- http://localhost:3000/api/health
// Returns 200 as soon as the Next.js server is accepting requests.
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
