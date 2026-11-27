import type { SearchRecord } from './record';
import { colourFamily } from './colour-families';
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
  available: 'Available to order',
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

// What a product is, read from its name, so a range can be split into kinds such as porcelain and
// natural stone. A product can be more than one kind.
const KINDS: { kind: string; words: RegExp }[] = [
  { kind: 'Porcelain', words: /\bporcelain\b/i },
  {
    kind: 'Natural stone',
    words: /\b(sandstone|limestone|granite|slate|basalt|yorkstone|natural stone)\b/i,
  },
  { kind: 'Walling', words: /\b(walling|copings?)\b/i },
  { kind: 'Porcelain cladding', words: /\bporcelain\b.*\bcladding\b/i },
  { kind: 'Composite cladding', words: /^(?!.*\bporcelain\b).*\bcladding\b/i },
  { kind: 'Cleaners', words: /\b(cleaners?|cleanser|remover|eraser|green[- ]off)\b/i },
  { kind: 'Sealers', words: /\b(sealers?|protector|back to black)\b/i },
  { kind: 'Fencing', words: /\b(fenc(e|ing)|trellis)\b/i },
  { kind: 'Gates', words: /\bgates?\b/i },
  { kind: 'Balustrades', words: /\bbalustrades?\b/i },
  { kind: 'Stone fire pits', words: /\bstone\b.*\bfire pit\b/i },
  { kind: 'Steel fire pits', words: /\b(sphere|steel)\b.*\bfire pit\b/i },
  { kind: 'Fire pit accessories', words: /\b(liner|deflector)\b/i },
  { kind: 'Lighting kits', words: /\b(kit|starter)\b/i },
  { kind: 'Jointing', words: /\bjointing compound\b/i },
  {
    kind: 'Risers',
    words:
      /\b(risers?|adjustable rise|top plate|aluminium profile|edge plate|slope corrector|rivets)\b/i,
  },
  { kind: 'Priming & bonding', words: /\b(primer|priming|slurry|bonding)\b/i },
  { kind: 'Tools', words: /\b(holesaw|tools?|trowel|spacers|cutter|blade)\b/i },
  {
    kind: 'Artificial grass',
    words: /^(?!.*\b(adhesive|tape|pins|membrane|cleanser|cleaner)\b).*\bartificial grass\b/i,
  },
  { kind: 'Artificial grass cleaners', words: /\bartificial grass\b.*\b(cleanser|cleaner)\b/i },
  {
    kind: 'Artificial grass installation',
    words: /\bartificial grass\b.*\b(adhesive|tape|pins|membrane)\b/i,
  },
];

const kindsOf = (record: SearchRecord) =>
  KINDS.filter(({ words }) => words.test(record.title)).map(({ kind }) => kind);

// PRD section 6 asks for colour, finish, size, thickness, slip rating, price per m², use and
// stock. Range and brand names are left out, as Amy asked: filters stay generic. Thickness, slip rating, use and coverage aren't in the product data yet, so those
// facets wait for it; a facet with no values is never shown.
export const FACETS: Facet[] = [
  { id: 'type', label: 'Type', valuesOf: kindsOf },
  {
    id: 'colour',
    label: 'Colour',
    valuesOf: (record) => [
      ...new Set(fromOptions('Colour')(record).flatMap((colour) => colourFamily(colour) ?? [])),
    ],
  },
  { id: 'finish', label: 'Finish', options: ['Finish'], valuesOf: fromOptions('Finish') },
  {
    id: 'size',
    label: 'Size',
    options: ['Size', 'Diameter', 'Length'],
    valuesOf: fromOptions('Size', 'Diameter', 'Length'),
  },
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
