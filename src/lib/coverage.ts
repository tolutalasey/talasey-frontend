// Whole packs to cover an area, after adding the allowance for cuts and breakages.
export function packsFor(areaM2: number, coverageM2: number, wastagePercent = 0): number {
  if (!(areaM2 > 0) || !(coverageM2 > 0)) return 0;
  const needed = (areaM2 * (100 + wastagePercent)) / 100;
  return Math.ceil(Math.round((needed / coverageM2) * 1e6) / 1e6);
}

export interface WastageChoice {
  percent: number;
  label: string;
  detail: string;
}

export const WASTAGE_CHOICES: readonly WastageChoice[] = [
  { percent: 5, label: '5%', detail: 'Simple grid' },
  { percent: 10, label: '10%', detail: 'Most patios' },
  { percent: 15, label: '15%', detail: 'Curves and herringbone' },
];

// The allowance for cuts as sent with the form, kept to what any calculator offers.
export const wastageFrom = (value: unknown) => {
  const percent = Number(value);
  return Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 25) : 0;
};

export const DEFAULT_WASTAGE = 10;

const MAX_AREA_M2 = 10_000;

// An area from a link such as ?area=24.5: a positive number of m², to one decimal place.
export function areaFrom(value: unknown): number | null {
  const area = Number(String(value ?? '').replace(',', '.'));
  if (!Number.isFinite(area) || area <= 0) return null;
  return Math.min(Math.round(area * 10) / 10, MAX_AREA_M2);
}
