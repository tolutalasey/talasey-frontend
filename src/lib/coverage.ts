// Whole packs to cover an area, after adding the allowance for cuts and breakages.
export function packsFor(areaM2: number, coverageM2: number, wastagePercent = 0): number {
  if (!(areaM2 > 0) || !(coverageM2 > 0)) return 0;
  const needed = (areaM2 * (100 + wastagePercent)) / 100;
  return Math.ceil(Math.round((needed / coverageM2) * 1e6) / 1e6);
}

export const WASTAGE_CHOICES = [
  { percent: 5, label: '5%', detail: 'Simple grid' },
  { percent: 10, label: '10%', detail: 'Most patios' },
  { percent: 15, label: '15%', detail: 'Curves and herringbone' },
] as const;

export const DEFAULT_WASTAGE = 10;
