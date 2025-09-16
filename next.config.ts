import type { NextConfig } from "next";

// @ts-expect-error - next-pwa types are not fully compatible with Next.js 15
import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting for animations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        animations: {
          name: 'animations',
          test: /[\\/]lib[\\/]animations\.ts$/,
          chunks: 'all',
          priority: 20,
        },
        framerMotion: {
          name: 'framer-motion',
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          chunks: 'all',
          priority: 15,
        },
      };
    }
    return config;
  },
  // Allow mobile access from local network
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '127.0.2.2',
    '192.168.1.0/24',
    '10.0.0.0/8',
    '172.16.0.0/12',
  ],
};

export default withPWAConfig(nextConfig);