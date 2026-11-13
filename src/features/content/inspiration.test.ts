import { describe, expect, it } from 'vitest';
import { filterInspiration, parseInspirationFilters } from './inspiration';
import type { Inspiration } from './schemas';

const item = (slug: string, extra: Partial<Inspiration>): Inspiration => ({
  slug,
  title: slug,
  colours: [],
  products: [],
  photo: { src: `/${slug}.jpg`, alt: slug, width: 800, height: 600 },
  ...extra,
});

const items = [
  item('salford-patio', {
    style: 'Contemporary',
    space: 'Patio',
    colours: ['Grey'],
    products: ['silver-grey-porcelain-paving'],
  }),
  item('bolton-path', { style: 'Cottage', space: 'Path', colours: ['Buff'] }),
  item('wigan-patio', { style: 'Cottage', space: 'Patio', colours: ['Grey'] }),
];

describe('filterInspiration', () => {
  it('filters by space and style together', () => {
    const { shown } = filterInspiration(items, { space: 'patio', style: 'cottage' });
    expect(shown.map((i) => i.slug)).toEqual(['wigan-patio']);
  });

  it('counts each filter against the others', () => {
    const { facets } = filterInspiration(items, { space: 'patio' });
    const styles = facets.find((facet) => facet.id === 'style');
    expect(styles?.values).toEqual([
      { slug: 'contemporary', label: 'Contemporary', count: 1, selected: false },
      { slug: 'cottage', label: 'Cottage', count: 1, selected: false },
    ]);
    const space = facets.find((facet) => facet.id === 'space');
    expect(space?.values.map((v) => [v.label, v.count, v.selected])).toEqual([
      ['Patio', 2, true],
      ['Path', 1, false],
    ]);
  });

  it('shows everything with no filters, and nothing for an empty gallery', () => {
    expect(filterInspiration(items, {}).shown).toHaveLength(3);
    expect(filterInspiration([], {})).toEqual({ shown: [], facets: [] });
  });
});

describe('parseInspirationFilters', () => {
  it('keeps one value per known filter', () => {
    expect(parseInspirationFilters({ space: ['patio', 'path'], utm_source: 'x' })).toEqual({
      space: 'patio',
    });
  });
});
