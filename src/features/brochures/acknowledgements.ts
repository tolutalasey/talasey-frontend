import { ACKNOWLEDGEMENT_RANGES, type Acknowledgement } from './schemas';

export const PAGE_SIZE = 12;
export const ACKNOWLEDGEMENTS_PATH = '/brochure-acknowledgements/';

type Range = (typeof ACKNOWLEDGEMENT_RANGES)[number];

export interface ThanksFilters {
  range: Range | null;
  page: number;
}

type Params = Record<string, string | string[] | undefined>;
const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export function parseThanksFilters(params: Params): ThanksFilters {
  const page = Number.parseInt(one(params.page), 10);
  return {
    range: ACKNOWLEDGEMENT_RANGES.find((range) => range === one(params.range)) ?? null,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function thanksHref(filters: ThanksFilters, change: Partial<ThanksFilters> = {}) {
  const next = { ...filters, ...change };
  const params = new URLSearchParams();
  if (next.range) params.set('range', next.range);
  if (next.page > 1) params.set('page', String(next.page));
  const query = params.toString();
  return `${ACKNOWLEDGEMENTS_PATH}${query ? `?${query}` : ''}`;
}

export function filterThanks(entries: Acknowledgement[], filters: ThanksFilters) {
  const matching = entries.filter((entry) => !filters.range || entry.range === filters.range);
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  return {
    total: matching.length,
    page,
    pages,
    shown: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    counts: Object.fromEntries(
      ACKNOWLEDGEMENT_RANGES.map((range) => [
        range,
        entries.filter((entry) => entry.range === range).length,
      ]),
    ) as Record<Range, number>,
  };
}
