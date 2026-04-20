import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for Docker standalone deployment
  output: 'standalone',
  images: {
    // MinIO is proxied through nginx at /media/; use the public domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cssi.pdpu.ac.in',
        pathname: '/media/**',
      },
      // Local development (docker compose) — nginx proxies /media → MinIO
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/media/**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // Existing optimizations (good)
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  staticPageGenerationTimeout: 120,
  // Add caching and performance optimizations
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
  // Increase memory limit for builds
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
