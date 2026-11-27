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
import { withCurrentSiteWords } from './old-range-pages';
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
  curated: z
    .array(curatedPageSchema.extend({ filters: storedFilters }))
    .nullish()
    .transform((v) => v ?? []),
  slides: z
    .array(
      z.object({
        photo: z.object({
          src: z.string(),
          alt: z
            .string()
            .nullish()
            .transform((v) => v ?? ''),
          width: z.number(),
          height: z.number(),
        }),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).map((slide) => slide.photo)),
  gallery: z
    .array(
      z.object({
        photo: z.object({
          src: z.string(),
          alt: z
            .string()
            .nullish()
            .transform((v) => v ?? ''),
          width: z.number(),
          height: z.number(),
        }),
        caption: z.string().nullish(),
      }),
    )
    .nullish()
    .transform((v) => v ?? []),
});

// A range page as the content team wrote it, read the same way the shop reads published ones.
export function rangeFromContent(data: unknown) {
  return storedRange.safeParse(data);
}

// Published pages come back in address order; the menu keeps the order of the ranges in the brief,
// with new ranges after them.
const menuOrder = (slug: string) => {
  const index = fallbackRanges.findIndex((range) => range.slug === slug);
  return index === -1 ? fallbackRanges.length : index;
};

export async function getRanges(): Promise<Range[]> {
  'use cache';
  cacheTag(cacheTags.ranges);
  cacheLife('days');

  const ranges = (await publishedContent('range-page')).flatMap((entry) => {
    const parsed = storedRange.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
  const slugs = new Set(ranges.map((range) => range.slug));
  return [
    ...ranges.map(withCodeSettings),
    ...fallbackRanges.filter((range) => !slugs.has(range.slug)),
  ]
    .map(withCurrentSiteWords)
    .sort((a, b) => menuOrder(a.slug) - menuOrder(b.slug));
}

const unique = (values: string[]) => (values.length > 0 ? [...new Set(values)] : undefined);

// The admin edits a range's words and photos; how its cards look and lead, and its sub-pages,
// still come from the code unless the admin has set them. Its categories and name words add to
// the admin's.
function withCodeSettings(range: Range): Range {
  const code = fallbackRanges.find(({ slug }) => slug === range.slug);
  if (!code) return range;
  const stored = new Set(range.curated.map(({ slug }) => slug));
  return {
    ...range,
    cardPhotos: range.cardPhotos ?? code.cardPhotos,
    leadWith: range.leadWith ?? code.leadWith,
    restHeading: range.restHeading ?? code.restHeading,
    headerAction: range.headerAction ?? code.headerAction,
    bespoke: range.bespoke ?? code.bespoke,
    alsoNeed: range.alsoNeed?.length ? range.alsoNeed : code.alsoNeed,
    curated: [...range.curated, ...code.curated.filter(({ slug }) => !stored.has(slug))],
    scope: {
      ...range.scope,
      categories: unique([...(range.scope.categories ?? []), ...(code.scope.categories ?? [])]),
      titleIncludes: unique([
        ...(range.scope.titleIncludes ?? []),
        ...(code.scope.titleIncludes ?? []),
      ]),
    },
  };
}

export async function getRange(slug: string): Promise<Range | null> {
  return (await getRanges()).find((range) => range.slug === slug) ?? null;
}

export interface RangeListing {
  result: SearchResult;
  // Everything in the range before filters, for the intro's price line and empty states.
  inRange: number;
  priceRange: SearchResult['priceRange'];
  // The range's own pages that have products, so a button never leads to an empty page.
  stocked: CuratedPage[];
}

function withProducts(pages: CuratedPage[], facets: SearchResult['facets']): CuratedPage[] {
  const counts = new Map(
    facets.flatMap((facet) =>
      facet.values.map((value) => [`${facet.id}:${value.slug}`, value.count]),
    ),
  );
  return pages.filter((page) =>
    Object.entries(page.filters).every(([facet, values]) =>
      values.some((value) => (counts.get(`${facet}:${value}`) ?? 0) > 0),
    ),
  );
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
  return {
    result,
    inRange: unfiltered.total,
    priceRange: unfiltered.priceRange,
    stocked: withProducts(range.curated, unfiltered.facets),
  };
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

const FEATURED_COUNT = 4;

const newestFirst = (a: SearchRecord, b: SearchRecord) =>
  (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');

// The products staff picked for the homepage, topped up with the newest products that have a
// photo and a price, so what is added in the admin shows straight away.
export async function getFeaturedProducts(picked: string[]): Promise<SearchRecord[]> {
  try {
    const records = await getSearchRecords();
    const byHandle = new Map(records.map((record) => [record.handle, record]));
    const chosen = picked.flatMap((handle) => byHandle.get(handle) ?? []);
    const newest = records
      .filter(
        (record) =>
          record.thumbnail && record.priceFrom !== null && !picked.includes(record.handle),
      )
      .sort(newestFirst);
    return [...chosen, ...newest].slice(0, Math.max(FEATURED_COUNT, chosen.length));
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
