import { DEFAULT_WASTAGE, WASTAGE_CHOICES, type WastageChoice } from './coverage';

// How a product is sold, which sets the words on its page and how its calculator works.
export const SOLD_AS = ['paving', 'decking', 'cladding', 'jointing', 'cleaner', 'single'] as const;
export type SoldAs = (typeof SOLD_AS)[number];

export interface SalesProfile {
  unit: { one: string; many: string };
  calculatorTitle: string;
  areaLabel: string;
  dimensionLabels: readonly [string, string];
  // The extra allowed for cuts; none for products that are not cut, like jointing or cleaners.
  wastage: readonly WastageChoice[];
  defaultWastage: number;
}

const PROFILES: Record<SoldAs, SalesProfile> = {
  paving: {
    unit: { one: 'pack', many: 'packs' },
    calculatorTitle: 'How much do you need?',
    areaLabel: 'Area to cover (m²)',
    dimensionLabels: ['Length (m)', 'Width (m)'],
    wastage: WASTAGE_CHOICES,
    defaultWastage: DEFAULT_WASTAGE,
  },
  decking: {
    unit: { one: 'board', many: 'boards' },
    calculatorTitle: 'How many boards?',
    areaLabel: 'Deck area (m²)',
    dimensionLabels: ['Deck length (m)', 'Deck width (m)'],
    wastage: [
      { percent: 5, label: '5%', detail: 'Straight runs' },
      { percent: 10, label: '10%', detail: 'Most decks' },
      { percent: 15, label: '15%', detail: 'Angled or picture frame' },
    ],
    defaultWastage: DEFAULT_WASTAGE,
  },
  cladding: {
    unit: { one: 'board', many: 'boards' },
    calculatorTitle: 'How many boards?',
    areaLabel: 'Wall area to clad (m²)',
    dimensionLabels: ['Wall length (m)', 'Wall height (m)'],
    wastage: [
      { percent: 5, label: '5%', detail: 'Plain wall' },
      { percent: 10, label: '10%', detail: 'Windows and doors' },
      { percent: 15, label: '15%', detail: 'Many corners' },
    ],
    defaultWastage: DEFAULT_WASTAGE,
  },
  jointing: {
    unit: { one: 'tub', many: 'tubs' },
    calculatorTitle: 'How many tubs?',
    areaLabel: 'Area to point (m²)',
    dimensionLabels: ['Length (m)', 'Width (m)'],
    wastage: [],
    defaultWastage: 0,
  },
  cleaner: {
    unit: { one: 'bottle', many: 'bottles' },
    calculatorTitle: 'How many do you need?',
    areaLabel: 'Area to treat (m²)',
    dimensionLabels: ['Length (m)', 'Width (m)'],
    wastage: [],
    defaultWastage: 0,
  },
  single: {
    unit: { one: 'item', many: 'items' },
    calculatorTitle: 'How many do you need?',
    areaLabel: 'Area (m²)',
    dimensionLabels: ['Length (m)', 'Width (m)'],
    wastage: [],
    defaultWastage: 0,
  },
};

const isSoldAs = (value: unknown): value is SoldAs => SOLD_AS.includes(value as SoldAs);

// The setting from /content when there is one; otherwise a guess from the product's category
// and name, so pages read right before anyone sets it.
export function soldAsFor(
  chosen: string | null | undefined,
  product: { handle: string; categories: { handle: string }[] },
): SoldAs {
  if (isSoldAs(chosen)) return chosen;
  const words = [product.handle, ...product.categories.map((category) => category.handle)].join(
    ' ',
  );
  if (/decking/.test(words)) return 'decking';
  if (/cladding/.test(words)) return 'cladding';
  if (/jointing/.test(words)) return 'jointing';
  if (/cleaner|sealer/.test(words)) return 'cleaner';
  return 'paving';
}

export const salesProfile = (soldAs: SoldAs): SalesProfile => PROFILES[soldAs];

export const countOf = (count: number, unit: SalesProfile['unit']) =>
  `${count} ${count === 1 ? unit.one : unit.many}`;
