import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/dms/image/**',
      },
    ],
    // Define allowed quality values for image optimization
    qualities: [50, 75, 95],
  },
};

export default nextConfig;
