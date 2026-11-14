import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  getRange,
  getRangeListing,
  hasListingParams,
  listingCanonical,
  listingRedirect,
  RangePage,
  rangePhoto,
} from '@/features/catalogue';
import { parseListingParams } from '@/features/search';
import { pageMetadata } from '@/lib/seo';

// Filters and sort come from the query string, so the page renders per request and in full
// before it is sent: filtering works without JavaScript.
export const instant = false;

type Props = PageProps<'/[range]'>;

async function load({ params, searchParams }: Props) {
  const range = await getRange((await params).range);
  if (!range) notFound();
  const query = await searchParams;
  const listing = await getRangeListing(range, parseListingParams(query));
  return { range, query, listing };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { range, query, listing } = await load(props);
  return pageMetadata({
    ...range.seo,
    path: listingCanonical(range),
    noindex: hasListingParams(query) || listing.inRange === 0,
    image: rangePhoto(range.slug).src,
  });
}

export default async function Range(props: Props) {
  const { range, query, listing } = await load(props);
  const target = listingRedirect(range, query);
  if (target) permanentRedirect(target);
  return <RangePage range={range} listing={listing} params={parseListingParams(query)} />;
}
