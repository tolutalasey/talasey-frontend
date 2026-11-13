import { FACETS, parseListingParams } from '@/features/search';
import { listingTarget, type CuratedTarget } from '@/lib/listing-href';
import { curatedPath, rangePath, type CuratedPage, type Range } from './ranges';

type Params = Record<string, string | string[] | undefined>;

const LISTING_KEYS = new Set([...FACETS.map((facet) => facet.id), 'sort', 'page']);

// The one URL for a filter state: a curated page's clean path when the filters are exactly
// that page's, otherwise the range path with its filters in a fixed order.
export function normalisedListingHref(range: Range, params: Params, curated?: CuratedPage): string {
  const parsed = parseListingParams(params);
  const filters = { ...parsed.filters, ...curated?.filters };
  return listingTarget(rangePath(range), { ...parsed, filters }, curatedTargets(range));
}

export const curatedTargets = (range: Range): CuratedTarget[] =>
  range.curated.map((page) => ({ href: curatedPath(range, page), filters: page.filters }));

function requestedHref(path: string, params: Params): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!LISTING_KEYS.has(key)) continue;
    for (const item of Array.isArray(value) ? value : value ? [value] : []) query.append(key, item);
  }
  const search = query.toString().replace(/%2C/g, ',');
  return search ? `${path}?${search}` : path;
}

// Where to send a request whose filters are written another way, such as a form's
// ?finish=a&finish=b or a curated page's filters on the range path. Null when it is already right.
export function listingRedirect(
  range: Range,
  params: Params,
  curated?: CuratedPage,
): string | null {
  const here = curated ? curatedPath(range, curated) : rangePath(range);
  const target = normalisedListingHref(range, params, curated);
  if (requestedHref(here, params) === target) return null;
  const others = Object.entries(params).flatMap(([key, value]) =>
    LISTING_KEYS.has(key)
      ? []
      : (Array.isArray(value) ? value : value ? [value] : []).map((v) => [key, v]),
  );
  if (others.length === 0) return target;
  return `${target}${target.includes('?') ? '&' : '?'}${new URLSearchParams(others)}`;
}

// Only a range or curated page with no filters of its own is indexed (PRD section 13).
export const listingCanonical = (range: Range, curated?: CuratedPage) =>
  curated ? curatedPath(range, curated) : rangePath(range);

export const hasListingParams = (params: Params) =>
  Object.keys(params).some((key) => LISTING_KEYS.has(key));
