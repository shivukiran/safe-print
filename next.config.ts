import type { NextConfig } from "next";



import path from 'path';

// require(path.resolve(__dirname, '../project0.2/app/utils/cron'));

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: 1048576, // Example value in bytes (1mb)
      allowedOrigins: ["*"], // Example value
    },
  },
};

export default nextConfig;
