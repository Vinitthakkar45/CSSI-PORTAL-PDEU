// Runs once when the Next.js server starts (Node.js runtime only).
// Sets up Prometheus default metrics: CPU, memory, event loop lag, GC, etc.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { collectDefaultMetrics } = await import('prom-client');
    collectDefaultMetrics();
  }
}
