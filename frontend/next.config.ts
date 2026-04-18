import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

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
    // Keep the repo root as Turbopack's root so frontend code can still resolve shared/backend files.
    root: path.resolve(currentDir, '..'),
  },
};

export default nextConfig;
