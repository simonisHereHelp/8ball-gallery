import type { NextConfig } from "next";
//To allow images from Google to display, you must whitelist the Google domain. Open next.config.ts (or .js):

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
