import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import { fallbackHomeContent, homeContentSchema, type HomeContent } from './content';

export async function getHomeContent(): Promise<HomeContent> {
  'use cache';
  cacheTag(cacheTags.home);
  cacheLife('days');

  const [published] = await publishedContent('home');
  const parsed = homeContentSchema.safeParse(published);
  return parsed.success ? parsed.data : fallbackHomeContent;
}
