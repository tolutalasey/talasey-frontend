import { describe, expect, it } from 'vitest';
import { keywordMap } from '@/lib/urls/keyword-map';
import { pathProblems } from '@/lib/urls/url-rules';
import { curatedPath, fallbackRanges, rangeForProduct, rangePath, rangeSchema } from './ranges';

const paths = fallbackRanges.flatMap((range) => [
  rangePath(range),
  ...range.curated.map((page) => curatedPath(range, page)),
]);

describe('fallback ranges', () => {
  it.each(fallbackRanges.map((range) => [range.slug, range]))(
    '%s passes the content rules',
    (_, range) => {
      expect(rangeSchema.safeParse(range).success).toBe(true);
    },
  );

  it('gives every PRD keyword its main page', () => {
    const rangePaths = new Set(paths);
    for (const { path } of keywordMap) expect(rangePaths).toContain(path);
  });

  it('follows the URL rules', () => {
    for (const path of paths) expect(pathProblems(path)).toEqual([]);
  });

  it('never repeats a title or description', () => {
    const seo = fallbackRanges.flatMap((range) => [range.seo, ...range.curated.map((p) => p.seo)]);
    expect(new Set(seo.map((s) => s.title)).size).toBe(seo.length);
    expect(new Set(seo.map((s) => s.description)).size).toBe(seo.length);
  });

  it('only gives a clean URL to filters a range actually has', () => {
    for (const range of fallbackRanges) {
      for (const page of range.curated) expect(Object.keys(page.filters).length).toBeGreaterThan(0);
    }
  });
});

describe('rangeForProduct', () => {
  it('finds a product’s range by category, preferring keyword ranges', () => {
    const range = rangeForProduct(fallbackRanges, {
      title: 'Sphere Fire Pit with Stand',
      categories: [{ handle: 'outdoor-living-fire-pits' }],
    });
    expect(range?.slug).toBe('fire-pits');
  });

  it('finds products not yet in a category by their name', () => {
    expect(
      rangeForProduct(fallbackRanges, { title: 'Silver grey porcelain paving', categories: [] })
        ?.slug,
    ).toBe('porcelain-paving');
  });

  it('is null for a product in no range', () => {
    expect(rangeForProduct(fallbackRanges, { title: 'Gift card', categories: [] })).toBeNull();
  });
});
