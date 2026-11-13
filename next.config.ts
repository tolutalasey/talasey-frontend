import type { NextConfig } from 'next';

const apiUrl = process.env.API_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  trailingSlash: true,
  // Room for the contact form's photos (up to five of 5 MB each), through the proxy too.
  experimental: {
    serverActions: { bodySizeLimit: '26mb' },
    proxyClientMaxBodySize: '26mb',
  },
  // Resolve metadata before the shell is sent: every client gets title, description and canonical
  // in <head>, and an unknown product returns a real 404 instead of a streamed one.
  htmlLimitedBots: /.*/,
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/uploads/**' }, { pathname: '/images/**' }],
  },
  // Photos uploaded in the admin are stored by the API and served through the site's own domain.
  async rewrites() {
    return [{ source: '/uploads/:name', destination: `${apiUrl}/uploads/:name` }];
  },
};

export default nextConfig;
