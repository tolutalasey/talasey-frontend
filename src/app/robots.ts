import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { robotsRules } from '@/lib/robots';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return robotsRules({
    production: env.APP_ENV === 'production',
    allowTraining: env.AI_TRAINING_CRAWLERS === 'allow',
    sitemap: absoluteUrl('/sitemap.xml'),
  });
}
