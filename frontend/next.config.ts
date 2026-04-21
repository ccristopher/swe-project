import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '**',
        protocol: 'https',
      },
      {
        hostname: '**',
        protocol: 'http',
      },
    ],
  },
  turbopack: {
    root: currentDir,
  },
};

export default nextConfig;
