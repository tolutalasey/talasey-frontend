import { FACETS, PRICE_BANDS, valueSlug } from './facets';
import {
  DEFAULT_PAGE_SIZE,
  type FacetCount,
  type FilterValues,
  type ProductSearch,
  type SearchRequest,
  type SearchResult,
  type Suggestion,
} from './product-search';
import type { Availability, SearchRecord } from './record';

export interface AlgoliaSearchOptions {
  appId: string;
  searchKey: string;
  indexName: string;
  fetch?: typeof fetch;
}

// The record a product sync writes to the Algolia index.
interface AlgoliaHit {
  objectID: string;
  handle: string;
  title: string;
  description: string | null;
  brand: string | null;
  categories: string[];
  categoryHandles: string[];
  options: Record<string, string[]>;
  skus: string[];
  priceFrom: number | null;
  hasOptions: boolean;
  availability: Availability[];
  thumbnail: string | null;
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
  nbHits: number;
  nbPages: number;
  page: number;
  facets?: Record<string, Record<string, number>>;
  facets_stats?: Record<string, { min: number; max: number }>;
}

const attributeFor = (facetId: string, option?: string) => {
  if (option) return `options.${option}`;
  return facetId === 'stock' ? 'availability' : facetId;
};

const PRICE = 'priceFrom';

const facetAttributes = FACETS.filter((facet) => facet.id !== 'price').flatMap((facet) =>
  facet.options
    ? facet.options.map((option) => attributeFor(facet.id, option))
    : [attributeFor(facet.id)],
);

const toRecord = (hit: AlgoliaHit): SearchRecord => ({
  id: hit.objectID,
  handle: hit.handle,
  title: hit.title,
  description: hit.description,
  brand: hit.brand,
  categories: hit.categoryHandles,
  categoryNames: hit.categories,
  options: hit.options,
  skus: hit.skus,
  priceFrom: hit.priceFrom,
  hasOptions: hit.hasOptions,
  availability: hit.availability,
  thumbnail: hit.thumbnail,
  updatedAt: null,
  position: 0,
  colours: [],
});

// Algolia filters on raw values, so a slug from the URL is matched back to the value it came from
// using the values Algolia reported for that attribute.
function facetFilters(filters: FilterValues, known: Record<string, Record<string, number>>) {
  return FACETS.filter((facet) => facet.id !== 'price' && filters[facet.id]?.length).map(
    (facet) => {
      const attributes = facet.options?.map((option) => attributeFor(facet.id, option)) ?? [
        attributeFor(facet.id),
      ];
      return attributes.flatMap((attribute) =>
        Object.keys(known[attribute] ?? {})
          .filter((value) => filters[facet.id]?.includes(valueSlug(value)))
          .map((value) => `${attribute}:${value}`),
      );
    },
  );
}

function numericFilters(filters: FilterValues): string[][] {
  const bands = PRICE_BANDS.filter((band) => filters.price?.includes(valueSlug(band.label)));
  if (bands.length === 0) return [];
  return [
    bands.map(({ min, max }) =>
      max === null ? `priceFrom >= ${min}` : `priceFrom: ${min} TO ${max - 0.01}`,
    ),
  ];
}

function countFacets(
  facets: Record<string, Record<string, number>>,
  filters: FilterValues,
): FacetCount[] {
  return FACETS.flatMap((facet) => {
    if (facet.id === 'price') return [];
    const attributes = facet.options?.map((o) => attributeFor(facet.id, o)) ?? [
      attributeFor(facet.id),
    ];
    const values = attributes.flatMap((attribute) => Object.entries(facets[attribute] ?? {}));
    if (values.length === 0) return [];
    return [
      {
        id: facet.id,
        label: facet.label,
        values: values.map(([value, count]) => ({
          value,
          slug: valueSlug(value),
          label: facet.labelFor?.(value) ?? value,
          count,
          selected: filters[facet.id]?.includes(valueSlug(value)) ?? false,
        })),
      },
    ];
  });
}

// Ready for when an Algolia account exists (ADR 0024). It reads with a search-only key.
// Facet counts come from the same query as the results, so they narrow as filters are added.
export class AlgoliaProductSearch implements ProductSearch {
  readonly name = 'Algolia';
  private knownFacets: Record<string, Record<string, number>> = {};

  constructor(private readonly options: AlgoliaSearchOptions) {}

  async search({
    query = '',
    scope,
    filters = {},
    sort = 'relevance',
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  }: SearchRequest): Promise<SearchResult> {
    if (Object.keys(this.knownFacets).length === 0) {
      this.knownFacets =
        (await this.query({ query: '', hitsPerPage: 0, facets: facetAttributes })).facets ?? {};
    }
    const scopeFilters = [
      ...(scope?.categories?.length
        ? [scope.categories.map((handle) => `categoryHandles:${handle}`)]
        : []),
      ...(scope?.handles?.length ? [scope.handles.map((handle) => `handle:${handle}`)] : []),
    ];
    const titleOnly = !query && scope?.titleIncludes?.length && scopeFilters.length === 0;
    const response = await this.query({
      query: titleOnly ? (scope?.titleIncludes ?? []).map((text) => `"${text}"`).join(' ') : query,
      ...(titleOnly && { restrictSearchableAttributes: ['title'], advancedSyntax: true }),
      facets: [...facetAttributes, PRICE],
      facetFilters: [...scopeFilters, ...facetFilters(filters, this.knownFacets)],
      numericFilters: numericFilters(filters),
      page: page - 1,
      hitsPerPage: pageSize,
      ...(sort !== 'relevance' && { index: `${this.options.indexName}_${sort}` }),
    });
    return {
      hits: response.hits.map(toRecord),
      total: response.nbHits,
      page: response.page + 1,
      pageCount: Math.max(1, response.nbPages),
      facets: countFacets(response.facets ?? {}, filters),
      priceRange: response.facets_stats?.[PRICE] ?? null,
      partialMatch: false,
    };
  }

  async suggest(query: string, limit = 6): Promise<Suggestion[]> {
    if (query.trim().length < 2) return [];
    const { hits } = await this.query({ query, hitsPerPage: limit });
    return hits.map(({ handle, title, priceFrom, thumbnail }) => ({
      handle,
      title,
      priceFrom,
      thumbnail,
    }));
  }

  private async query({ index, ...params }: Record<string, unknown>): Promise<AlgoliaResponse> {
    const { appId, searchKey, indexName, fetch: send = fetch } = this.options;
    const target = typeof index === 'string' ? index : indexName;
    const response = await send(
      `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(target)}/query`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-algolia-application-id': appId,
          'x-algolia-api-key': searchKey,
        },
        body: JSON.stringify(params),
      },
    );
    if (!response.ok) {
      throw new Error(`Algolia search failed (${response.status}): ${await response.text()}`);
    }
    return (await response.json()) as AlgoliaResponse;
  }
}
