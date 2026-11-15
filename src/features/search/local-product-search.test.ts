import { describe, expect, it } from 'vitest';
import { LocalProductSearch } from './local-product-search';
import { catalogue, searchRecord } from './test-records';

const search = new LocalProductSearch(catalogue);
const titles = async (query: string) =>
  (await search.search({ query })).hits.map((hit) => hit.title);

describe('LocalProductSearch: words', () => {
  it('finds a product by a word in its name', async () => {
    expect(await titles('sphere')).toEqual(['Sphere fire pit with stand']);
  });

  it('matches the start of the last word as people type', async () => {
    expect(await titles('palm fr')).toEqual(['Palm frond decorative screen']);
  });

  it('forgives a typo', async () => {
    expect(await titles('porcelian')).toEqual(['Silver grey porcelain paving']);
    expect(await titles('sceen')).toHaveLength(2);
  });

  it('understands the words people use for the same thing', async () => {
    expect(await titles('patio slabs')).toEqual(['Silver grey porcelain paving']);
    expect(await titles('grout')).toEqual(['Pavetuf jointing compound']);
    expect(await titles('corten screen')).toEqual(['Baroque emblem decorative screen']);
    expect(await titles('firepit')).toEqual(['Sphere fire pit with stand']);
  });

  it('forgives a typo only in the word typed, and only when it is not found as typed', async () => {
    const nearby = new LocalProductSearch([
      searchRecord({ title: 'Pavetuf jointing compound' }),
      searchRecord({ title: 'Mounting bracket' }),
      searchRecord({ title: 'Wall light' }),
      searchRecord({ title: 'Eight way connector' }),
    ]);
    const found = async (query: string) =>
      (await nearby.search({ query })).hits.map((hit) => hit.title);
    expect(await found('grout')).toEqual(['Pavetuf jointing compound']);
    expect(await found('light')).toEqual(['Wall light']);
    expect(await found('ligth')).toEqual(['Wall light']);
  });

  it('finds a product by its SKU', async () => {
    expect(await titles('SCRBE1800-300C')).toEqual(['Baroque emblem decorative screen']);
  });

  it('falls back to any word when no product matches them all', async () => {
    const result = await search.search({ query: 'pergola screen' });
    expect(result.partialMatch).toBe(true);
    expect(result.total).toBe(2);
  });

  it('returns nothing for a word nothing is close to', async () => {
    const result = await search.search({ query: 'trampoline' });
    expect(result.total).toBe(0);
  });
});

describe('LocalProductSearch: ranges and filters', () => {
  const screens = { categories: ['architectural-steelwork-screens'] };

  it('limits results to a range by category or by words in the name', async () => {
    expect((await search.search({ scope: screens })).total).toBe(2);
    const porcelain = await search.search({ scope: { titleIncludes: ['porcelain paving'] } });
    expect(porcelain.hits.map((hit) => hit.handle)).toEqual(['silver-grey-porcelain-paving']);
  });

  it('filters by facet values from the URL', async () => {
    const result = await search.search({
      scope: screens,
      filters: { finish: ['weathered-steel'] },
    });
    expect(result.hits.map((hit) => hit.title)).toEqual(['Baroque emblem decorative screen']);
  });

  it('counts each facet as if its own filter were not applied', async () => {
    const result = await search.search({
      scope: screens,
      filters: { finish: ['weathered-steel'] },
    });
    const finish = result.facets.find((facet) => facet.id === 'finish');
    expect(finish?.values).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'Powder Coated', count: 2, selected: false }),
        expect.objectContaining({ value: 'Weathered Steel', count: 1, selected: true }),
      ]),
    );
    const size = result.facets.find((facet) => facet.id === 'size');
    expect(size?.values.map((value) => [value.value, value.count])).toEqual([
      ['1800 × 300 mm', 1],
      ['1800 × 600 mm', 1],
    ]);
  });

  it('filters by price band and availability', async () => {
    const cheap = await search.search({ filters: { price: ['under-50'] } });
    expect(cheap.hits.map((hit) => hit.title)).toEqual(['Pavetuf jointing compound']);
    const stocked = await search.search({ filters: { stock: ['in-stock'] } });
    expect(stocked.hits.map((hit) => hit.title)).toEqual(['Silver grey porcelain paving']);
  });

  it('leaves out facets no product has a value for', async () => {
    const result = await search.search({ scope: screens });
    expect(result.facets.map((facet) => facet.id)).not.toContain('colour');
  });

  it('sorts by price with unpriced products last, and pages', async () => {
    const result = await search.search({ sort: 'price-low', pageSize: 2, page: 3 });
    expect(result.pageCount).toBe(3);
    expect(result.hits.map((hit) => hit.title)).toEqual([
      'Sphere fire pit with stand',
      'Dellaora Lighting - Smart plug',
    ]);
  });
});

describe('LocalProductSearch: suggestions', () => {
  it('suggests products as soon as two letters are typed', async () => {
    expect((await search.suggest('pa')).map((s) => s.handle)).toContain(
      'palm-frond-decorative-screen',
    );
    expect(await search.suggest('p')).toEqual([]);
  });
});

describe('LocalProductSearch: price range', () => {
  it('spans every result, not just the page shown', async () => {
    const result = await search.search({ pageSize: 1 });
    expect(result.priceRange).toEqual({ min: 39.99, max: 1200 });
  });
});
