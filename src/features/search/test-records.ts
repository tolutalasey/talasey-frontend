import type { SearchRecord } from './record';

export function searchRecord(overrides: Partial<SearchRecord> & { title: string }): SearchRecord {
  const handle = overrides.handle ?? overrides.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `prod_${handle}`,
    handle,
    description: null,
    brand: null,
    categories: [],
    categoryNames: [],
    options: {},
    skus: [],
    priceFrom: null,
    hasOptions: false,
    availability: ['made-to-order'],
    thumbnail: null,
    updatedAt: null,
    ...overrides,
  };
}

export const catalogue: SearchRecord[] = [
  searchRecord({
    title: 'Baroque emblem decorative screen',
    categories: ['architectural-steelwork-screens'],
    categoryNames: ['Screens'],
    options: {
      Size: ['1800 × 300 mm', '1800 × 600 mm'],
      Finish: ['Weathered Steel', 'Powder Coated'],
    },
    skus: ['SCRBE1800-300C'],
    priceFrom: 120,
    hasOptions: true,
  }),
  searchRecord({
    title: 'Palm frond decorative screen',
    categories: ['architectural-steelwork-screens'],
    categoryNames: ['Screens'],
    options: { Size: ['1800 × 600 mm'], Finish: ['Galvanised Steel', 'Powder Coated'] },
    priceFrom: 180,
    hasOptions: true,
  }),
  searchRecord({
    title: 'Sphere fire pit with stand',
    categories: ['outdoor-living-fire-pits'],
    categoryNames: ['Fire Pits'],
    options: { Diameter: ['700 mm', '900 mm'] },
    priceFrom: 1200,
    hasOptions: true,
  }),
  searchRecord({
    title: 'Silver grey porcelain paving',
    options: { Size: ['600 × 600 mm'] },
    priceFrom: 59.99,
    availability: ['in-stock'],
  }),
  searchRecord({ title: 'Pavetuf jointing compound', brand: 'Pavetuf', priceFrom: 39.99 }),
  searchRecord({ title: 'Dellaora Lighting - Smart plug', brand: 'Dellaora Lighting' }),
];
