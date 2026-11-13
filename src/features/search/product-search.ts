import type { FilterValues } from '@/lib/listing-href';
import type { SearchRecord } from './record';

export type { FilterValues };

export const SORTS = ['relevance', 'price-low', 'price-high', 'name'] as const;
export type Sort = (typeof SORTS)[number];

// Limits a search to part of the catalogue: a range page's categories, words in the
// product name, or a list of handles.
export interface SearchScope {
  categories?: string[];
  titleIncludes?: string[];
  handles?: string[];
}

export interface SearchRequest {
  query?: string;
  scope?: SearchScope;
  filters?: FilterValues;
  sort?: Sort;
  page?: number;
  pageSize?: number;
}

export interface FacetValueCount {
  value: string;
  slug: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface FacetCount {
  id: string;
  label: string;
  values: FacetValueCount[];
}

export interface SearchResult {
  hits: SearchRecord[];
  total: number;
  page: number;
  pageCount: number;
  facets: FacetCount[];
  // Lowest and highest "from" price across every result, not just this page.
  priceRange: { min: number; max: number } | null;
  // True when no product matched every word, so the results match some of them instead.
  partialMatch: boolean;
}

export interface Suggestion {
  handle: string;
  title: string;
  priceFrom: number | null;
  thumbnail: string | null;
}

export interface ProductSearch {
  readonly name: string;
  search(request: SearchRequest): Promise<SearchResult>;
  suggest(query: string, limit?: number): Promise<Suggestion[]>;
}

export const DEFAULT_PAGE_SIZE = 24;
