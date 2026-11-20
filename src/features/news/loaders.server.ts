import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { bySlug, contentOr } from '@/lib/content';
import fallbackPosts from './fallback-posts.json';
import { relatedPosts } from './news';
import { newsPostSchema, type NewsPost } from './schemas';

const fallback: NewsPost[] = newsPostSchema.array().parse(fallbackPosts);

export async function getNewsPosts(): Promise<NewsPost[]> {
  'use cache';
  cacheTag(cacheTags.news);
  cacheLife('days');
  const posts = await contentOr('news-post', newsPostSchema, fallback, bySlug);
  return [...posts].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export async function getNewsPostView(slug: string) {
  const posts = await getNewsPosts();
  const post = posts.find((candidate) => candidate.slug === slug);
  return post ? { post, related: relatedPosts(post, posts) } : null;
}
