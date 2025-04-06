import type { NextConfig } from "next";
// import './utils/cron'; // Import the cron job so it starts

// import '../project0.2/app/utils/cron'

import path from 'path';

require(path.resolve(__dirname, '../project0.2/app/utils/cron'));

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
