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
    qualities: [25, 50, 75, 80, 90, 100],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
    // Optimize bundle splitting for better performance
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Core UI components
        ui: {
          name: 'ui',
          test: /[\\/]components[\\/]ui[\\/]/,
          chunks: 'all',
          priority: 30,
          minSize: 0,
        },
        // Admin components (separate chunk)
        admin: {
          name: 'admin',
          test: /[\\/]components[\\/]admin[\\/]/,
          chunks: 'all',
          priority: 25,
          minSize: 0,
        },
        // Feature components
        features: {
          name: 'features',
          test: /[\\/]components[\\/]features[\\/]/,
          chunks: 'all',
          priority: 20,
          minSize: 0,
        },
        // Animations
        animations: {
          name: 'animations',
          test: /[\\/]lib[\\/]animations\.ts$/,
          chunks: 'all',
          priority: 20,
        },
        // Framer Motion
        framerMotion: {
          name: 'framer-motion',
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          chunks: 'all',
          priority: 15,
        },
        // Lucide React icons
        icons: {
          name: 'icons',
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          chunks: 'all',
          priority: 15,
        },
        // React Hot Toast
        toast: {
          name: 'toast',
          test: /[\\/]node_modules[\\/]react-hot-toast[\\/]/,
          chunks: 'all',
          priority: 10,
        },
        // Common vendor libraries
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 5,
          minSize: 0,
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