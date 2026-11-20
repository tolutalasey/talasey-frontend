import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { getGuides, guidePath } from '@/features/content';
import { publishedContent } from '@/lib/content';
import type { NewsItem } from './components/LatestNews';
import { fallbackHomeContent, homeContentSchema, type HomeContent } from './content';

export async function getHomeContent(): Promise<HomeContent> {
  'use cache';
  cacheTag(cacheTags.home);
  cacheLife('days');

  const [published] = await publishedContent('home');
  const parsed = homeContentSchema.safeParse(published);
  return parsed.success ? parsed.data : fallbackHomeContent;
}

export async function getLatestNews(): Promise<NewsItem[]> {
  const guides = await getGuides();
  return guides.slice(0, 3).map((guide) => ({
    title: guide.title,
    topic: guide.topic,
    summary: guide.answer,
    href: guidePath(guide),
  }));
}
