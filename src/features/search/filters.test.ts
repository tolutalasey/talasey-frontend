import { describe, expect, it } from 'vitest';
import { listingHref, parseListingParams, sameFilters, withoutFilter } from './filters';

describe('parseListingParams', () => {
  it('reads known facets, sort and page, and ignores the rest', () => {
    expect(
      parseListingParams({
        finish: 'powder-coated,weathered-steel',
        size: ['1800-x-600-mm'],
        utm_source: 'mail',
        sort: 'price-low',
        page: '2',
      }),
    ).toEqual({
      filters: { finish: ['powder-coated', 'weathered-steel'], size: ['1800-x-600-mm'] },
      sort: 'price-low',
      page: 2,
    });
  });

  it('falls back to page 1 and no sort for nonsense', () => {
    expect(parseListingParams({ sort: 'cheapest', page: '-3' })).toEqual({
      filters: {},
      sort: undefined,
      page: 1,
    });
  });
});

describe('listingHref', () => {
  it('writes filters in a fixed order so each filter state has one URL', () => {
    expect(
      listingHref('/garden-screens/', {
        filters: { size: ['b', 'a'], finish: ['powder-coated'] },
        page: 2,
      }),
    ).toBe('/garden-screens/?finish=powder-coated&size=a,b&page=2');
  });

  it('is the clean path with no filters', () => {
    expect(listingHref('/garden-screens/', { filters: { finish: [] }, sort: 'relevance' })).toBe(
      '/garden-screens/',
    );
  });
});

describe('filter helpers', () => {
  it('removes one value', () => {
    expect(withoutFilter({ finish: ['a', 'b'] }, 'finish', 'a')).toEqual({ finish: ['b'] });
  });

  it('compares filter states regardless of order', () => {
    expect(sameFilters({ finish: ['a', 'b'] }, { finish: ['b', 'a'], size: [] })).toBe(true);
    expect(sameFilters({ finish: ['a'] }, {})).toBe(false);
  });
});
