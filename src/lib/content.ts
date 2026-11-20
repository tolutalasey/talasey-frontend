import 'server-only';
import type { z } from 'zod';
import { getContentClient, keepBriefly } from './commerce';

// What the content team has published in /content. While the API is down the pages fall back to
// their built-in copy rather than failing.
export async function publishedContent(type: string): Promise<unknown[]> {
  try {
    return await getContentClient().published(type);
  } catch {
    keepBriefly();
    return [];
  }
}

// Published entries, with the built-in copy for anything not published yet: a published entry
// replaces the built-in one with the same key.
export async function contentOr<T>(
  type: string,
  schema: z.ZodType<T>,
  fallback: T[],
  keyOf: (entry: T) => string,
  keep: (entry: T) => boolean = () => true,
): Promise<T[]> {
  const published = (await publishedContent(type)).flatMap((entry) => {
    const parsed = schema.safeParse(entry);
    return parsed.success && keep(parsed.data) ? [parsed.data] : [];
  });
  const keys = new Set(published.map(keyOf));
  return [...published, ...fallback.filter((entry) => !keys.has(keyOf(entry)))];
}

export const bySlug = (entry: { slug: string }) => entry.slug;
