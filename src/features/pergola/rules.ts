import { slugify } from '@/lib/slug';

// The pergola builders' rules, from the "Pergola builders" content in /content: which SKU each
// size, fixing and side takes, and what a build puts in the bag. Both builder designs use these.

export const LIGHTING_KIT = 'Optional kit for each size';
export const PANELS = 'Panels to mix';

export type Fixing = 'free-standing' | 'wall-mounted';
export type SideId = 'back' | 'left' | 'right' | 'front';
export type Slat = 'horizontal' | 'vertical';

export interface PergolaSize {
  label: string;
  width: number;
  depth: number;
  freeStandingSku: string;
  wallMountedSku: string;
  freeStandingSize: string | null;
  wallMountedSize: string | null;
  lightingKitSku: string | null;
}

export interface SideOption {
  name: string;
  kind: string;
  sku3m: string | null;
  sku4m: string | null;
  verticalSku3m: string | null;
  verticalSku4m: string | null;
  panels3m?: number | null;
  panels4m?: number | null;
}

export interface PergolaRules {
  slug: string;
  range: string;
  intro: string;
  roof: string;
  lighting: string;
  sizes: PergolaSize[];
  sides: SideOption[];
  heaterSku: string | null;
  messages: string[];
  details: { heading: string; text: string }[];
}

export interface CatalogueItem {
  variantId: string;
  name: string;
  pricePence: number;
}

// What is on the shop, by SKU. Parts whose SKU is not here are not offered.
export type Catalogue = Record<string, CatalogueItem>;

export interface SideChoice {
  option: string | null;
  slats: Slat[];
}

export interface Build {
  size: number | null;
  fixing: Fixing | null;
  sides: Record<SideId, SideChoice>;
  lighting: boolean;
  heaters: number;
}

export interface Side {
  id: SideId;
  name: string;
  length: number;
  onWall: boolean;
}

export interface SummaryItem {
  sku: string;
  variantId: string;
  name: string;
  quantity: number;
  pricePence: number;
}

export interface SummaryLine {
  step: string;
  detail: string;
  items: SummaryItem[];
}

export interface BuildPart {
  variantId: string;
  quantity: number;
  side?: string;
}

export interface BuildSummary {
  ready: boolean;
  lines: SummaryLine[];
  totalPence: number;
  parts: BuildPart[];
  exactSize: string | null;
}

const SIDE_ORDER: { id: SideId; name: string; along: 'width' | 'depth' }[] = [
  { id: 'back', name: 'Back', along: 'width' },
  { id: 'left', name: 'Left', along: 'depth' },
  { id: 'right', name: 'Right', along: 'depth' },
  { id: 'front', name: 'Front', along: 'width' },
];

export const emptyBuild = (): Build => ({
  size: null,
  fixing: null,
  sides: {
    back: { option: null, slats: [] },
    left: { option: null, slats: [] },
    right: { option: null, slats: [] },
    front: { option: null, slats: [] },
  },
  lighting: false,
  heaters: 0,
});

export const lightingIncluded = (rules: PergolaRules) => rules.lighting !== LIGHTING_KIT;

export const sizeOf = (rules: PergolaRules, build: Build) =>
  build.size === null ? null : (rules.sizes[build.size] ?? null);

// A wall-mounted pergola fixes its back (the width side) to the wall.
export function sidesOf(size: PergolaSize, fixing: Fixing | null): Side[] {
  return SIDE_ORDER.map(({ id, name, along }) => ({
    id,
    name,
    length: along === 'width' ? size.width : size.depth,
    onWall: fixing === 'wall-mounted' && id === 'back',
  }));
}

// A side longer than 4 m is built from 3 m bays, like the 6 m side of a 6 × 4 m pergola.
function baysOf(length: number): { bay: 3 | 4; count: number } | null {
  if (length === 3 || length === 4) return { bay: length, count: 1 };
  return length % 3 === 0 ? { bay: 3, count: length / 3 } : null;
}

export function panelCount(option: SideOption, length: number): number {
  const bays = baysOf(length);
  if (!bays) return 0;
  return ((bays.bay === 3 ? option.panels3m : option.panels4m) ?? 0) * bays.count;
}

const slatsFor = (slats: Slat[], count: number): Slat[] =>
  Array.from({ length: count }, (_, index) => slats[index] ?? 'horizontal');

// The SKUs and quantities one side option needs on a side of this length, or null when it
// can't go there.
export function partsForSide(
  option: SideOption,
  length: number,
  slats: Slat[] = [],
): { sku: string; quantity: number }[] | null {
  const bays = baysOf(length);
  if (!bays) return null;
  const sku = bays.bay === 3 ? option.sku3m : option.sku4m;
  if (!sku) return null;
  if (option.kind !== PANELS) return [{ sku, quantity: bays.count }];

  const count = panelCount(option, length);
  if (count === 0) return null;
  const vertical = bays.bay === 3 ? option.verticalSku3m : option.verticalSku4m;
  const chosen = slatsFor(slats, count);
  const upright = vertical ? chosen.filter((slat) => slat === 'vertical').length : 0;
  return [
    { sku, quantity: count - upright },
    ...(vertical ? [{ sku: vertical, quantity: upright }] : []),
  ].filter((part) => part.quantity > 0);
}

export const canMixSlats = (option: SideOption, length: number) => {
  const bays = baysOf(length);
  return Boolean(bays && (bays.bay === 3 ? option.verticalSku3m : option.verticalSku4m));
};

// The side options that can go on a side of this length with what is on the shop now.
export function optionsFor(rules: PergolaRules, catalogue: Catalogue, length: number) {
  return rules.sides.filter((option) => {
    const parts = partsForSide(option, length);
    return parts !== null && parts.every((part) => catalogue[part.sku]);
  });
}

const item = (catalogue: Catalogue, sku: string, quantity: number): SummaryItem | null => {
  const found = catalogue[sku];
  return found
    ? { sku, variantId: found.variantId, name: found.name, quantity, pricePence: found.pricePence }
    : null;
};

const present = <T>(value: T | null): value is T => value !== null;

// Everything the build puts in the bag, step by step, including the steps left as "Not required".
export function summarise(rules: PergolaRules, catalogue: Catalogue, build: Build): BuildSummary {
  const size = sizeOf(rules, build);
  if (!size || !build.fixing) {
    return { ready: false, lines: [], totalPence: 0, parts: [], exactSize: null };
  }
  const wall = build.fixing === 'wall-mounted';
  const baseSku = wall ? size.wallMountedSku : size.freeStandingSku;
  const lines: SummaryLine[] = [];
  const parts: BuildPart[] = [];
  const add = (
    step: string,
    detail: string,
    wanted: { sku: string; quantity: number }[],
    side?: string,
  ) => {
    const items = wanted.map((part) => item(catalogue, part.sku, part.quantity)).filter(present);
    lines.push({ step, detail, items });
    for (const found of items) {
      parts.push({
        variantId: found.variantId,
        quantity: found.quantity,
        ...(side && { side }),
      });
    }
  };

  add('Pergola', `${rules.range}, ${size.label}, ${wall ? 'wall-mounted' : 'free-standing'}`, [
    { sku: baseSku, quantity: 1 },
  ]);

  for (const side of sidesOf(size, build.fixing)) {
    const step = `${side.name} side (${side.length} m)`;
    if (side.onWall) {
      lines.push({ step, detail: 'Fixed to the wall', items: [] });
      continue;
    }
    const choice = build.sides[side.id];
    const option = rules.sides.find((candidate) => candidate.name === choice.option);
    const wanted = option ? partsForSide(option, side.length, choice.slats) : null;
    if (!option || !wanted) {
      lines.push({ step, detail: 'Not required', items: [] });
      continue;
    }
    add(step, option.name, wanted, side.name.toLowerCase());
  }

  if (lightingIncluded(rules)) {
    lines.push({ step: 'Lighting', detail: 'LED lighting included as standard', items: [] });
  } else if (build.lighting && size.lightingKitSku) {
    add('Lighting', 'LED lighting kit', [{ sku: size.lightingKitSku, quantity: 1 }]);
  } else {
    lines.push({ step: 'Lighting', detail: 'Not required', items: [] });
  }

  if (build.heaters > 0 && rules.heaterSku) {
    add('Heating', `${build.heaters} × 3kW heater`, [
      { sku: rules.heaterSku, quantity: build.heaters },
    ]);
  } else {
    lines.push({ step: 'Heating', detail: 'Not required', items: [] });
  }

  const totalPence = lines
    .flatMap((line) => line.items)
    .reduce((sum, found) => sum + found.pricePence * found.quantity, 0);
  return {
    ready: Boolean(catalogue[baseSku]),
    lines,
    totalPence,
    parts,
    exactSize: wall ? size.wallMountedSize : size.freeStandingSize,
  };
}

// Applies a change and keeps the build valid: a side on the wall can't take an option, and a
// side's panels follow its length.
export function updateBuild(rules: PergolaRules, build: Build, change: Partial<Build>): Build {
  const next = { ...build, ...change, sides: { ...build.sides, ...change.sides } };
  const size = sizeOf(rules, next);
  if (!size) return next;
  for (const side of sidesOf(size, next.fixing)) {
    const choice = next.sides[side.id];
    const option = rules.sides.find((candidate) => candidate.name === choice.option);
    if (side.onWall || !option || !partsForSide(option, side.length)) {
      next.sides[side.id] = { option: null, slats: [] };
      continue;
    }
    next.sides[side.id] = {
      option: option.name,
      slats: slatsFor(choice.slats, panelCount(option, side.length)),
    };
  }
  if (lightingIncluded(rules) || !size.lightingKitSku) next.lighting = false;
  return next;
}

// The size and fixing a structure SKU stands for, to open the builder on that choice.
export function startFromSku(rules: PergolaRules, sku: string | null | undefined): Partial<Build> {
  const size = rules.sizes.findIndex(
    (option) => option.freeStandingSku === sku || option.wallMountedSku === sku,
  );
  if (!sku || size < 0) return {};
  return {
    size,
    fixing: rules.sizes[size]?.wallMountedSku === sku ? 'wall-mounted' : 'free-standing',
  };
}

const SIDE_IDS: SideId[] = ['back', 'left', 'right', 'front'];
const FIXINGS: Fixing[] = ['free-standing', 'wall-mounted'];

type Query = Record<string, string | string[] | undefined>;
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// A build described in the address, like ?size=4x3&fixing=wall-mounted&front=wind-screen, so a
// link from the chat or an email opens the builder ready chosen. Anything not recognised is
// left for the visitor to choose.
export function startFromQuery(rules: PergolaRules, query: Query): Partial<Build> | undefined {
  const wanted = one(query.size)?.toLowerCase().replace(/\s|m/g, '');
  const size = rules.sizes.findIndex((option) => `${option.width}x${option.depth}` === wanted);
  const fixing = FIXINGS.find((value) => value === one(query.fixing));
  if (size < 0 && !fixing) return undefined;
  const sides = emptyBuild().sides;
  for (const id of SIDE_IDS) {
    const option = rules.sides.find((candidate) => slugify(candidate.name) === one(query[id]));
    sides[id] = { option: option?.name ?? null, slats: [] };
  }
  const heaters = Number(one(query.heaters));
  return {
    ...(size >= 0 && { size }),
    ...(fixing && { fixing }),
    sides,
    lighting: one(query.lighting) === 'yes',
    heaters: Number.isInteger(heaters) && heaters > 0 && heaters <= 4 ? heaters : 0,
  };
}

// The words the assistant gets about one builder: what can be chosen, what the structure costs
// and how to write a link that opens it ready chosen.
export function builderGuide(rules: PergolaRules, catalogue: Catalogue, path: string): string {
  const price = (sku: string | null) => {
    const found = sku ? catalogue[sku] : undefined;
    return found
      ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
          found.pricePence / 100,
        )
      : null;
  };
  const sizes = rules.sizes.map((size) => {
    const free = price(size.freeStandingSku);
    const wall = price(size.wallMountedSku);
    return `  - size=${size.width}x${size.depth} (${size.label}): free-standing ${free ?? 'not sold online'}, wall-mounted ${wall ?? 'not sold online'}`;
  });
  const sides = rules.sides.map((option) => {
    const lengths = [3, 4].filter((length) => partsForSide(option, length));
    if (lengths.length === 0) {
      return `  - ${option.name}: not sold online yet, so pass it to the team for a quote`;
    }
    const each = lengths.map((length) => {
      const sku = length === 3 ? option.sku3m : option.sku4m;
      return option.kind === PANELS
        ? `${length} m side ${panelCount(option, length)} panels at ${price(sku) ?? '-'} each`
        : `${length} m side ${price(sku) ?? '-'}`;
    });
    return `  - ${slugify(option.name)} (${option.name}): ${each.join(', ')}`;
  });
  return [
    `## ${rules.range} pergola builder: ${path}`,
    rules.intro,
    `Roof: ${rules.roof}. Lighting: ${lightingIncluded(rules) ? 'LED lighting included' : 'optional LED kit (lighting=yes)'}.${rules.heaterSku ? ` Heaters: 3kW, ${price(rules.heaterSku) ?? ''} each (heaters=1 to 4).` : ''}`,
    'Sizes (width x depth; a 6 m side is two 3 m bays) and structure prices:',
    ...sizes,
    'Fixing: fixing=free-standing or fixing=wall-mounted (wall-mounted fixes the back to the house, so the back takes no side).',
    'Sides: back, left, right and front can each take one of these (left and right run along the depth):',
    ...sides,
    `Link that opens the builder ready chosen: ${path}?size=4x3&fixing=wall-mounted&front=<side>&left=<side>&lighting=yes&heaters=1 (leave out anything not chosen). The builder shows the full price and has Add to bag.`,
  ].join('\n');
}
