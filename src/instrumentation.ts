export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('dns');
    dns.setDefaultResultOrder('ipv4first');

    const { collectDefaultMetrics } = await import('prom-client');
    collectDefaultMetrics();
  }
}
