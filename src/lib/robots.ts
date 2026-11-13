import type { MetadataRoute } from 'next';

// PRD section 14: search and AI search crawlers are welcome. Crawlers that only gather training
// data are a separate choice; blocking them doesn't stop us appearing in AI answers.
export const SEARCH_CRAWLERS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'DuckDuckBot',
];

export const TRAINING_CRAWLERS = [
  'GPTBot',
  'Google-Extended',
  'CCBot',
  'ClaudeBot',
  'Applebot-Extended',
  'meta-externalagent',
];

// Baskets, checkout, accounts, orders and search results are never worth crawling (PRD 13).
export const PRIVATE_PATHS = [
  '/api/',
  '/basket/',
  '/checkout/',
  '/account/',
  '/order/',
  '/search/',
  '/contact/thanks/',
];

export interface RobotsOptions {
  production: boolean;
  allowTraining: boolean;
  sitemap: string;
}

export function robotsRules({
  production,
  allowTraining,
  sitemap,
}: RobotsOptions): MetadataRoute.Robots {
  if (!production) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: [
      { userAgent: SEARCH_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS },
      allowTraining
        ? { userAgent: TRAINING_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS }
        : { userAgent: TRAINING_CRAWLERS, disallow: '/' },
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap,
  };
}
