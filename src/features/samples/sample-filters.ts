import type { SampleOffer } from '@/api-client';
import { colourFamily } from '@/features/search';

export const SAMPLE_FILTERS = [
  { id: 'material', label: 'Material' },
  { id: 'colour', label: 'Colour' },
  { id: 'finish', label: 'Finish' },
] as const;

export type SampleFilterId = (typeof SAMPLE_FILTERS)[number]['id'];
export type SampleFilters = Partial<Record<SampleFilterId, string>>;

const MATERIALS: { name: string; words: RegExp }[] = [
  { name: 'Porcelain', words: /\bporcelain\b/i },
  {
    name: 'Natural stone',
    words: /\b(sandstone|limestone|granite|slate|basalt|yorkstone|natural stone)\b/i,
  },
  {
    name: 'Composite',
    words: /\b(composite|decking|cladding|fencing|piranha|hunter|terrafuzion)\b/i,
  },
  { name: 'Artificial grass', words: /\b(artificial grass|luxigraze)\b/i },
  { name: 'Steel', words: /\b(steel|corten|aluminium|powder[- ]coated)\b/i },
];

const FINISHES =
  /\b(matt|textured|polished|honed|flamed|riven|sawn|brushed|tumbled|structured|lappato|grip)\b/i;

const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

// What a sample is made of, its colour group and its finish, read from its product and label.
export function sampleFacets(offer: SampleOffer): Record<SampleFilterId, string | null> {
  const text = `${offer.productTitle} ${offer.label}`;
  const finish = FINISHES.exec(text)?.[1];
  return {
    material: MATERIALS.find(({ words }) => words.test(text))?.name ?? null,
    colour: colourFamily(offer.label) ?? colourFamily(offer.productTitle),
    finish: finish ? capital(finish) : null,
  };
}

export function parseSampleFilters(query: Record<string, string | string[] | undefined>) {
  return Object.fromEntries(
    SAMPLE_FILTERS.flatMap(({ id }) => {
      const value = query[id];
      const one = Array.isArray(value) ? value[0] : value;
      return one ? [[id, one]] : [];
    }),
  ) as SampleFilters;
}

export function filterSamples(offers: SampleOffer[], filters: SampleFilters) {
  return offers.filter((offer) => {
    const facets = sampleFacets(offer);
    return SAMPLE_FILTERS.every(({ id }) => !filters[id] || facets[id] === filters[id]);
  });
}

// Each filter with the values the samples have, so an empty choice is never offered.
export function sampleFilterOptions(offers: SampleOffer[]) {
  return SAMPLE_FILTERS.map(({ id, label }) => ({
    id,
    label,
    values: [...new Set(offers.flatMap((offer) => sampleFacets(offer)[id] ?? []))].sort(),
  })).filter((filter) => filter.values.length > 0);
}
