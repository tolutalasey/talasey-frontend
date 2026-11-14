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
  // Search engines and link previews get the whole page at once, with title, description and
  // canonical in <head> and a real 404 for an unknown product. Shoppers get the fast shell first.
  htmlLimitedBots:
    /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot/i,
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
