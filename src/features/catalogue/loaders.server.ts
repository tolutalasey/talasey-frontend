import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import {
  getSearchRecords,
  searchProducts,
  type FilterValues,
  type ListingParams,
  type SearchRecord,
  type SearchRequest,
  type SearchResult,
} from '@/features/search';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import {
  curatedPageSchema,
  fallbackRanges,
  rangeSchema,
  type CuratedPage,
  type Range,
} from './ranges';

const storedFilters = z
  .array(z.object({ facet: z.string(), value: z.string() }))
  .transform((filters) =>
    filters.reduce<FilterValues>(
      (all, { facet, value }) => ({ ...all, [facet]: [...(all[facet] ?? []), value] }),
      {},
    ),
  );

const storedRange = rangeSchema.extend({
  scope: z.object({
    categories: z
      .array(z.string())
      .nullish()
      .transform((value) => value ?? undefined),
    titleIncludes: z
      .array(z.string())
      .nullish()
      .transform((value) => value ?? undefined),
  }),
  buyingGuide: z
    .string()
    .nullish()
    .transform((text) => (text ? text.split(/\n\s*\n/).map((p) => p.trim()) : [])),
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .nullish()
    .transform((v) => v ?? []),
  curated: z.array(curatedPageSchema.extend({ filters: storedFilters })),
});

// A range page as the content team wrote it, read the same way the shop reads published ones.
export function rangeFromContent(data: unknown) {
  return storedRange.safeParse(data);
}

export async function getRanges(): Promise<Range[]> {
  'use cache';
  cacheTag(cacheTags.ranges);
  cacheLife('days');

  const ranges = (await publishedContent('range-page')).flatMap((entry) => {
    const parsed = storedRange.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
  const slugs = new Set(ranges.map((range) => range.slug));
  return [...ranges, ...fallbackRanges.filter((range) => !slugs.has(range.slug))];
}

export async function getRange(slug: string): Promise<Range | null> {
  return (await getRanges()).find((range) => range.slug === slug) ?? null;
}

export interface RangeListing {
  result: SearchResult;
  // Everything in the range before filters, for the intro's price line and empty states.
  inRange: number;
  priceRange: SearchResult['priceRange'];
}

export async function getRangeListing(
  range: Range,
  { filters, sort, page }: ListingParams,
  curated?: CuratedPage,
): Promise<RangeListing> {
  const [result, unfiltered] = await Promise.all([
    searchProducts({
      scope: range.scope,
      filters: { ...filters, ...curated?.filters },
      sort: sort ?? 'relevance',
      page,
    }),
    searchProducts({ scope: range.scope, pageSize: 1 }),
  ]);
  return { result, inRange: unfiltered.total, priceRange: unfiltered.priceRange };
}

// For product rows on content pages, which are built ahead of time: a build without the API
// leaves the row out instead of failing, and the products tag fills it in later.
export async function getProductRow(request: SearchRequest): Promise<SearchRecord[]> {
  try {
    return (await searchProducts(request)).hits;
  } catch {
    return [];
  }
}

export async function getProductsByHandle(handles: string[]): Promise<SearchRecord[]> {
  try {
    const records = new Map((await getSearchRecords()).map((record) => [record.handle, record]));
    return handles.flatMap((handle) => records.get(handle) ?? []);
  } catch {
    return [];
  }
}
