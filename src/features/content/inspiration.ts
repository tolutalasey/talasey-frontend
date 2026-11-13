import { slugify } from '@/lib/slug';
import type { Inspiration } from './schemas';

export const INSPIRATION_FILTERS = [
  { id: 'product', label: 'Product', valuesOf: (item: Inspiration) => item.products },
  { id: 'colour', label: 'Colour', valuesOf: (item: Inspiration) => item.colours },
  {
    id: 'style',
    label: 'Style',
    valuesOf: (item: Inspiration) => (item.style ? [item.style] : []),
  },
  {
    id: 'space',
    label: 'Space',
    valuesOf: (item: Inspiration) => (item.space ? [item.space] : []),
  },
] as const;

export type InspirationFilters = Partial<
  Record<(typeof INSPIRATION_FILTERS)[number]['id'], string>
>;

export interface InspirationFacet {
  id: string;
  label: string;
  values: { slug: string; label: string; count: number; selected: boolean }[];
}

const matches = (item: Inspiration, filters: InspirationFilters) =>
  INSPIRATION_FILTERS.every(({ id, valuesOf }) => {
    const wanted = filters[id];
    return !wanted || valuesOf(item).some((value) => slugify(value) === wanted);
  });

// One value per filter, chosen with links; counts show what each choice would leave.
export function filterInspiration(items: Inspiration[], filters: InspirationFilters) {
  const shown = items.filter((item) => matches(item, filters));
  const facets: InspirationFacet[] = INSPIRATION_FILTERS.flatMap(({ id, label, valuesOf }) => {
    const counts = new Map<string, number>();
    for (const item of items.filter((candidate) =>
      matches(candidate, { ...filters, [id]: undefined }),
    )) {
      for (const value of new Set(valuesOf(item))) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    if (counts.size === 0) return [];
    return [
      {
        id,
        label,
        values: [...counts].map(([value, count]) => ({
          slug: slugify(value),
          label: value,
          count,
          selected: filters[id] === slugify(value),
        })),
      },
    ];
  });
  return { shown, facets };
}

export function parseInspirationFilters(
  params: Record<string, string | string[] | undefined>,
): InspirationFilters {
  return Object.fromEntries(
    INSPIRATION_FILTERS.flatMap(({ id }) => {
      const value = params[id];
      const one = Array.isArray(value) ? value[0] : value;
      return one ? [[id, one]] : [];
    }),
  );
}
