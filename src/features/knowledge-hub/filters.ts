import { DOCUMENT_KINDS, DOCUMENT_RANGES, type HubDocument } from './schemas';

export const PAGE_SIZE = 12;

export interface HubFilters {
  range: (typeof DOCUMENT_RANGES)[number] | null;
  kind: (typeof DOCUMENT_KINDS)[number] | null;
  query: string;
  page: number;
}

type Params = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? '';

const oneOf = <T extends string>(options: readonly T[], value: string): T | null =>
  options.find((option) => option === value) ?? null;

export function parseHubFilters(params: Params): HubFilters {
  const page = Number.parseInt(one(params.page), 10);
  return {
    range: oneOf(DOCUMENT_RANGES, one(params.range)),
    kind: oneOf(DOCUMENT_KINDS, one(params.type)),
    query: one(params.q).slice(0, 100),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

const words = (text: string) => text.toLowerCase().split(/\s+/).filter(Boolean);

export function filterDocuments(documents: HubDocument[], filters: HubFilters) {
  const wanted = words(filters.query);
  const matching = documents.filter(
    (entry) =>
      (!filters.range || entry.ranges.includes(filters.range)) &&
      (!filters.kind || entry.kind === filters.kind) &&
      wanted.every((word) => entry.title.toLowerCase().includes(word)),
  );
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  return {
    total: matching.length,
    page,
    pages,
    documents: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  };
}

// The hub's address with these filters, for links that keep the rest of the choice.
export function hubHref(filters: HubFilters, change: Partial<HubFilters> = {}) {
  const next = { ...filters, ...change };
  const params = new URLSearchParams();
  if (next.range) params.set('range', next.range);
  if (next.kind) params.set('type', next.kind);
  if (next.query) params.set('q', next.query);
  if (next.page > 1) params.set('page', String(next.page));
  const query = params.toString();
  return `/knowledge-hub/${query ? `?${query}` : ''}`;
}
