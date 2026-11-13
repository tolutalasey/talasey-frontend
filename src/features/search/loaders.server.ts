import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { getCatalog, orEmpty } from '@/lib/commerce';
import { env } from '@/lib/env';
import { AlgoliaProductSearch } from './algolia-product-search';
import { LocalProductSearch } from './local-product-search';
import type { ProductSearch, SearchRequest, SearchResult, Suggestion } from './product-search';
import { toSearchRecord, type SearchRecord } from './record';

export async function getSearchRecords(): Promise<SearchRecord[]> {
  'use cache';
  cacheTag(cacheTags.products);
  cacheLife('hours');

  return (await orEmpty(() => getCatalog().listProducts())).map(toSearchRecord);
}

// Algolia when its keys are set; otherwise an in-memory index over the published products, so
// local runs and tests need no account (ADR 0026).
async function productSearch(): Promise<ProductSearch> {
  if (env.ALGOLIA_APP_ID && env.ALGOLIA_SEARCH_KEY) {
    return new AlgoliaProductSearch({
      appId: env.ALGOLIA_APP_ID,
      searchKey: env.ALGOLIA_SEARCH_KEY,
      indexName: env.ALGOLIA_PRODUCTS_INDEX,
    });
  }
  return new LocalProductSearch(await getSearchRecords());
}

export async function searchProducts(request: SearchRequest): Promise<SearchResult> {
  return (await productSearch()).search(request);
}

export async function suggestProducts(query: string, limit?: number): Promise<Suggestion[]> {
  return (await productSearch()).suggest(query, limit);
}
