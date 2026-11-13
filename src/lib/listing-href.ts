// Filters as they appear in the URL: facet id to value slugs, e.g. { finish: ['powder-coated'] }.
export type FilterValues = Record<string, string[]>;

export interface ListingState {
  filters?: FilterValues;
  sort?: string;
  page?: number;
}

// One URL per filter state: keys and values in a fixed order, values joined by commas.
export function listingHref(path: string, { filters, sort, page }: ListingState): string {
  const query = new URLSearchParams();
  for (const [key, values] of Object.entries(filters ?? {}).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (values.length > 0) query.set(key, [...values].sort().join(','));
  }
  if (sort && sort !== 'relevance') query.set('sort', sort);
  if (page && page > 1) query.set('page', String(page));
  const search = query.toString();
  return search ? `${path}?${search.replace(/%2C/g, ',')}` : path;
}

export function sameFilters(a: FilterValues, b: FilterValues): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every(
    (key) => [...(a[key] ?? [])].sort().join(',') === [...(b[key] ?? [])].sort().join(','),
  );
}

export interface CuratedTarget {
  href: string;
  filters: FilterValues;
}

// A filter state that is exactly a curated page's, with no sort or page, goes to its clean URL.
export function listingTarget(path: string, state: ListingState, curated: CuratedTarget[]): string {
  const plain = (!state.sort || state.sort === 'relevance') && (state.page ?? 1) === 1;
  const match = plain && curated.find((page) => sameFilters(page.filters, state.filters ?? {}));
  return match ? match.href : listingHref(path, state);
}
