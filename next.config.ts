import type { NextConfig } from "next";



import path from 'path';

require(path.resolve(__dirname, '../project0.2/app/utils/cron'));

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb", // Example value
      allowedOrigins: ["*"], // Example value
    },
  },
};

export default nextConfig;
