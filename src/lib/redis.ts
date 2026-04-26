import Redis from 'ioredis';

// REDIS_URL=redis://redis:6379 (Docker service name)
export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('error', (err) => console.error('[redis]', err.message));
