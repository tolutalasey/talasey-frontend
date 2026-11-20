import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import { plainPageSchema, type PlainPage } from './content';
import { fallbackPages } from './fallback-pages';

// Published pages, then the current site's pages copied in until they're published in /content.
export async function getPlainPages(): Promise<PlainPage[]> {
  'use cache';
  cacheTag(cacheTags.pages);
  cacheLife('days');
  const published = (await publishedContent('page')).flatMap((entry) => {
    const parsed = plainPageSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
  const slugs = new Set(published.map((page) => page.slug));
  const fallback = fallbackPages.flatMap((entry) => {
    const parsed = plainPageSchema.safeParse(entry);
    return parsed.success && !slugs.has(parsed.data.slug) ? [parsed.data] : [];
  });
  return [...published, ...fallback];
}

export async function getPlainPage(slug: string): Promise<PlainPage | null> {
  return (await getPlainPages()).find((page) => page.slug === slug) ?? null;
}
