import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'portal.zuplo.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.zuplo.com',
      },
    ],
  },
};

export default nextConfig;
