import type { Metadata } from 'next';
import { BuilderResults, buildersFor, getBuilders } from '@/features/builders';
import { getRanges, SearchPage } from '@/features/catalogue';
import { parseListingParams, searchProducts } from '@/features/search';

// Results render on the server, so the first page of results arrives with the HTML.
export const instant = false;

export const metadata: Metadata = {
  title: { absolute: 'Search | Talasey' },
  robots: { index: false, follow: true },
};

type Props = PageProps<'/search'>;

const SUGGESTED = [
  'porcelain-paving',
  'garden-screens',
  'outdoor-lighting',
  'fire-pits',
  'composite-fencing',
];

export default async function Search({ searchParams }: Props) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim().slice(0, 100) ?? '';
  const listing = parseListingParams(params);
  const [result, ranges, builders] = await Promise.all([
    query
      ? searchProducts({ query, filters: listing.filters, sort: listing.sort, page: listing.page })
      : null,
    getRanges(),
    getBuilders(),
  ]);
  return (
    <SearchPage
      query={query}
      result={result}
      params={listing}
      suggestedRanges={ranges.filter((range) => SUGGESTED.includes(range.slug))}
      shortcuts={query && <BuilderResults builders={buildersFor(query, builders)} />}
    />
  );
}
