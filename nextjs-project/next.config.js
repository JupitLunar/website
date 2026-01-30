/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  images: {
    // Use domains to avoid micromatch recursion during builds with many pages.
    domains: ['localhost', 'www.momaiagent.com', 'momaiagent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Temporarily disable standalone to avoid collect-build-traces stack overflow
  // output: 'standalone',
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/insight',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/insight/:slug',
        permanent: true,
      },
      {
        source: '/articles/:slug',
        destination: '/insight/:slug',
        permanent: true,
      },
      // Non-www to www redirect - commented out to avoid micromatch stack overflow
      // Configure this at the CDN/Vercel domain level instead
      // {
      //   source: '/:path*',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'momaiagent.com',
      //     },
      //   ],
      //   destination: 'https://www.momaiagent.com/:path*',
      //   permanent: true,
      // },
    ];
  },
  async rewrites() {
    return [
      // TikTok URL properties verification: avoid 301/302 when trailing slash is used
      {
        source: '/complete/tiktokEwh2iNpVtFm2pBHesG8d4YJWz7J1A2Ne.txt/',
        destination: '/complete/tiktokEwh2iNpVtFm2pBHesG8d4YJWz7J1A2Ne.txt',
      },

      // TikTok may request the signature file under the chosen URL prefix path.
      // Map it to /complete/<signature-file> where we store it.
      {
        source: '/complete/tiktokEwh2iNpVtFm2pBHesG8d4YJWz7J1A2Ne.txt/:sig',
        destination: '/complete/:sig',
      },
    ];
  },
  // Headers moved to middleware.ts to avoid micromatch stack overflow
  // The middleware handles security headers for all routes
};

module.exports = nextConfig;
