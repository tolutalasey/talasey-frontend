import type { SearchRecord } from './record';
import { slugify } from './text';

export interface PriceBand {
  slug: string;
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_BANDS: PriceBand[] = [
  { slug: 'under-50', label: 'Under £50', min: 0, max: 50 },
  { slug: '50-to-100', label: '£50 to £100', min: 50, max: 100 },
  { slug: '100-to-250', label: '£100 to £250', min: 100, max: 250 },
  { slug: '250-to-500', label: '£250 to £500', min: 250, max: 500 },
  { slug: 'over-500', label: '£500 and over', min: 500, max: null },
];

const AVAILABILITY_LABELS: Record<string, string> = {
  'in-stock': 'In stock',
  'made-to-order': 'Made to order',
};

export interface Facet {
  id: string;
  label: string;
  // Product option titles that feed this facet, so Algolia can filter on the same attributes.
  options?: string[];
  valuesOf: (record: SearchRecord) => string[];
  labelFor?: (value: string) => string;
}

const fromOptions =
  (...titles: string[]) =>
  (record: SearchRecord) =>
    titles.flatMap((title) => record.options[title] ?? []);

function priceBandOf(record: SearchRecord): string[] {
  const price = record.priceFrom;
  if (price === null) return [];
  const band = PRICE_BANDS.find(({ min, max }) => price >= min && (max === null || price < max));
  return band ? [band.label] : [];
}

// PRD section 6 asks for colour, finish, size, thickness, slip rating, price per m², use and
// stock. Thickness, slip rating, use and coverage aren't in the product data yet, so those
// facets wait for it; a facet with no values is never shown.
export const FACETS: Facet[] = [
  { id: 'colour', label: 'Colour', options: ['Colour'], valuesOf: fromOptions('Colour') },
  { id: 'finish', label: 'Finish', options: ['Finish'], valuesOf: fromOptions('Finish') },
  {
    id: 'size',
    label: 'Size',
    options: ['Size', 'Diameter', 'Length'],
    valuesOf: fromOptions('Size', 'Diameter', 'Length'),
  },
  { id: 'brand', label: 'Brand', valuesOf: (record) => (record.brand ? [record.brand] : []) },
  { id: 'price', label: 'Price', valuesOf: priceBandOf },
  {
    id: 'stock',
    label: 'Availability',
    valuesOf: (record) => record.availability,
    labelFor: (value) => AVAILABILITY_LABELS[value] ?? value,
  },
];

export const facetById = new Map(FACETS.map((facet) => [facet.id, facet]));

export const valueSlug = slugify;
