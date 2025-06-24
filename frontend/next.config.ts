import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ]
  }
};

export default nextConfig;
