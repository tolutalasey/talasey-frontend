export { SearchLauncher } from './components/SearchLauncher';
export { FACETS, PRICE_BANDS } from './facets';
export {
  hasFilters,
  listingHref,
  parseListingParams,
  sameFilters,
  withoutFilter,
  type ListingParams,
} from './filters';
export { getSearchRecords, searchProducts, suggestProducts } from './loaders.server';
export {
  SORTS,
  type FacetCount,
  type FilterValues,
  type SearchRequest,
  type SearchResult,
  type SearchScope,
  type Sort,
  type Suggestion,
} from './product-search';
export type { SearchRecord } from './record';
export { allowedTypos, alternativesFor, editDistance, words } from './text';
