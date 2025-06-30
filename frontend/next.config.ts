import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    // Add ESLint configuration
    dirs: ['src/**/*', 'app/**/*', 'components/**/*', 'lib/**/*'],
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "res.cloudinary.com"
      },
      {
        protocol: 'https',
        hostname: "i.imgur.com"
      },
      {
        protocol: 'https',
        hostname: "ext.same-assets.com"
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'sbxcars.com'
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;
