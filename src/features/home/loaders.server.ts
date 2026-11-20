import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import { getNewsPosts, newsPostPath } from '@/features/news';
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
  const posts = await getNewsPosts();
  return posts.slice(0, 3).map((post) => ({
    title: post.title,
    topic: post.categories[0] ?? 'News',
    summary: post.excerpt,
    href: newsPostPath(post),
  }));
}
