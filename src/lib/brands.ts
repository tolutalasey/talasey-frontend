// PRD section 6: the five brands with their own pages. Other makers we stock are named on
// their products but have no brand page.
export interface Brand {
  name: string;
  slug: string;
}

export const brandsWithPages: Brand[] = [
  { name: 'Vitripiazza', slug: 'vitripiazza' },
  { name: 'Natural Paving', slug: 'natural-paving' },
  { name: 'Piranha', slug: 'piranha' },
  { name: 'Pavetuf', slug: 'pavetuf' },
  { name: 'Luxigraze', slug: 'luxigraze' },
];

const otherBrands = ['Dellaora Lighting'];

const knownBrands = [...brandsWithPages.map((brand) => brand.name), ...otherBrands];

export const brandPath = (slug: string) => `/brands/${slug}/`;

// Products imported from the sheet have no brand yet, so the brand comes from the start of the name.
export function brandOf(title: string, brand: string | null): string | null {
  if (brand) return brand;
  const lower = title.toLowerCase();
  return knownBrands.find((name) => lower.startsWith(name.toLowerCase())) ?? null;
}
