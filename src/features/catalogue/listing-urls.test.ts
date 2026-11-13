import { describe, expect, it } from 'vitest';
import { listingRedirect, normalisedListingHref } from './listing-urls';
import { fallbackRanges } from './ranges';

function find<T>(items: T[], match: (item: T) => boolean): T {
  const found = items.find(match);
  if (!found) throw new Error('Missing fixture');
  return found;
}

const screens = find(fallbackRanges, (range) => range.slug === 'garden-screens');
const powderCoated = find(screens.curated, (page) => page.slug === 'powder-coated');

describe('normalisedListingHref', () => {
  it('sends a curated filter state to its clean URL', () => {
    expect(normalisedListingHref(screens, { finish: 'powder-coated' })).toBe(
      '/garden-screens/powder-coated/',
    );
  });

  it('keeps other filter states on the range path, in a fixed order', () => {
    expect(normalisedListingHref(screens, { size: '1800-x-600-mm', finish: 'powder-coated' })).toBe(
      '/garden-screens/?finish=powder-coated&size=1800-x-600-mm',
    );
  });
});

describe('listingRedirect', () => {
  it('folds repeated form fields into one parameter', () => {
    expect(listingRedirect(screens, { finish: ['weathered-steel', 'powder-coated'] })).toBe(
      '/garden-screens/?finish=powder-coated,weathered-steel',
    );
  });

  it('drops the default sort a form sends', () => {
    expect(listingRedirect(screens, { sort: 'relevance' })).toBe('/garden-screens/');
  });

  it('leaves a request that is already right alone', () => {
    expect(listingRedirect(screens, { finish: 'galvanised-steel' })).toBeNull();
    expect(listingRedirect(screens, {}, powderCoated)).toBeNull();
    expect(listingRedirect(screens, { utm_source: 'mail' })).toBeNull();
  });

  it('keeps tracking parameters when it redirects', () => {
    expect(listingRedirect(screens, { finish: 'powder-coated', utm_source: 'mail' })).toBe(
      '/garden-screens/powder-coated/?utm_source=mail',
    );
  });

  it('moves extra filters on a curated page to the range path', () => {
    expect(listingRedirect(screens, { size: '1800-x-300-mm' }, powderCoated)).toBe(
      '/garden-screens/?finish=powder-coated&size=1800-x-300-mm',
    );
  });
});
