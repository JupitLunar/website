/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
    // Limit output file tracing to prevent stack overflow with many pages
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/**/*.md',
        'node_modules/**/*.txt',
        'node_modules/**/*.map',
        'scripts/**',
        'docs/**',
        'data/**',
        'cache/**',
        'reports/**',
        '*.md',
        '!README.md',
      ],
    },
  },
  images: {
    // Use domains to avoid micromatch recursion during builds with many pages.
    domains: ['localhost', 'www.momaiagent.com', 'momaiagent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  output: 'standalone',
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
    return [];
  },
  // Headers moved to middleware.ts to avoid micromatch stack overflow
  // The middleware handles security headers for all routes
};

module.exports = nextConfig;
