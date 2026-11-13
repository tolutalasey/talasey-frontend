import type { FilterValues } from '@/lib/listing-href';
import { facetById } from './facets';
import { SORTS, type Sort } from './product-search';

export { listingHref, sameFilters } from '@/lib/listing-href';

type Params = Record<string, string | string[] | undefined>;

const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? value.split(',') : []).filter(Boolean);

export interface ListingParams {
  filters: FilterValues;
  sort: Sort | undefined;
  page: number;
}

// Reads facet filters, sort and page from the query string; anything unknown is ignored.
export function parseListingParams(params: Params): ListingParams {
  const filters: FilterValues = {};
  for (const [key, value] of Object.entries(params)) {
    if (facetById.has(key)) {
      const values = [...new Set(list(value))].sort();
      if (values.length > 0) filters[key] = values;
    }
  }
  const sort = list(params.sort)[0];
  const page = Number(list(params.page)[0] ?? 1);
  return {
    filters,
    sort: SORTS.find((known) => known === sort),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export const hasFilters = (filters: FilterValues) =>
  Object.values(filters).some((values) => values.length > 0);

export function withoutFilter(filters: FilterValues, facet: string, slug: string): FilterValues {
  return { ...filters, [facet]: (filters[facet] ?? []).filter((value) => value !== slug) };
}
