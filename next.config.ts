import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Experimental features
  experimental: {
    // Server Actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // HTTP agent options for better connection management
  httpAgentOptions: {
    keepAlive: true,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      {
        // SSE endpoints - prevent buffering
        source: '/api/v1/:path*/updates',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-transform'
          },
          {
            key: 'X-Accel-Buffering',
            value: 'no'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
