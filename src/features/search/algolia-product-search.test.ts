import { describe, expect, it, vi } from 'vitest';
import { AlgoliaProductSearch } from './algolia-product-search';

const hit = {
  objectID: 'prod_1',
  handle: 'baroque-emblem-decorative-screen',
  title: 'Baroque emblem decorative screen',
  description: null,
  brand: null,
  categories: ['Screens'],
  categoryHandles: ['architectural-steelwork-screens'],
  options: { Finish: ['Powder Coated'] },
  skus: ['SCRBE1800-300PC'],
  priceFrom: 120,
  hasOptions: true,
  availability: ['made-to-order'],
  thumbnail: null,
};

function fakeAlgolia() {
  return vi.fn<typeof fetch>(async () =>
    Response.json({
      hits: [hit],
      nbHits: 1,
      nbPages: 1,
      page: 0,
      facets: { 'options.Finish': { 'Powder Coated': 1, 'Weathered Steel': 3 } },
    }),
  );
}

const bodyOf = (send: ReturnType<typeof fakeAlgolia>, call: number) =>
  JSON.parse(String(send.mock.calls[call]?.[1]?.body)) as Record<string, unknown>;

describe('AlgoliaProductSearch', () => {
  it('queries with the search-only key and maps hits to search records', async () => {
    const send = fakeAlgolia();
    const search = new AlgoliaProductSearch({
      appId: 'APP',
      searchKey: 'search-key',
      indexName: 'products',
      fetch: send,
    });

    const result = await search.search({
      query: 'screen',
      scope: { categories: ['architectural-steelwork-screens'] },
      filters: { finish: ['powder-coated'], price: ['100-to-250'] },
      page: 1,
    });

    expect(result.hits[0]).toMatchObject({
      id: 'prod_1',
      categories: ['architectural-steelwork-screens'],
    });
    expect(result.facets[0]?.values).toContainEqual(
      expect.objectContaining({ value: 'Powder Coated', selected: true }),
    );

    const [url, init] = send.mock.calls[1] ?? [];
    expect(url).toBe('https://APP-dsn.algolia.net/1/indexes/products/query');
    expect(new Headers(init?.headers).get('x-algolia-api-key')).toBe('search-key');
    expect(bodyOf(send, 1)).toMatchObject({
      query: 'screen',
      page: 0,
      facetFilters: [
        ['categoryHandles:architectural-steelwork-screens'],
        ['options.Finish:Powder Coated'],
      ],
      numericFilters: [['priceFrom: 100 TO 249.99']],
    });
  });

  it('throws with Algolia’s message when it refuses', async () => {
    const search = new AlgoliaProductSearch({
      appId: 'APP',
      searchKey: 'k',
      indexName: 'products',
      fetch: async () => new Response('Invalid API key', { status: 403 }),
    });
    await expect(search.suggest('screen')).rejects.toThrow('Invalid API key');
  });
});
