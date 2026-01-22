/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // WARNING: This allows production builds to succeed even with TS errors.
    // Prefer fixing TS errors long-term.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
