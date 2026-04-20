import { NextResponse } from 'next/server';

// Exposes Prometheus metrics for Prometheus to scrape.
// Restrict to internal network access via nginx if exposed publicly.
export async function GET() {
  const { register } = await import('prom-client');
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    headers: { 'Content-Type': register.contentType },
  });
}
