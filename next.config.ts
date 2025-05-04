import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    // Add image optimization settings
    minimumCacheTTL: 60, // Cache optimized images for at least 60 seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimize device size breakpoints
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
    // Add memory optimization
    optimizeCss: true,
  },
};

export default nextConfig;
