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
import { FENCING_RANGE, FenceBuilderLinks, getFenceBuilders } from '@/features/fencing';
import { BuilderLinks, getPergolaBuilders, PERGOLA_RANGE } from '@/features/pergola';
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

// The kit builders a range is bought through, shown above its products.
async function builderLinksFor(slug: string) {
  if (slug === PERGOLA_RANGE) {
    const builders = await getPergolaBuilders();
    return builders.length > 0 && <BuilderLinks builders={builders} />;
  }
  if (slug === FENCING_RANGE) return <FenceBuilderLinks builders={await getFenceBuilders()} />;
  return null;
}

export default async function Range(props: Props) {
  const { range, query, listing } = await load(props);
  const target = listingRedirect(range, query);
  if (target) permanentRedirect(target);
  return (
    <RangePage
      range={range}
      listing={listing}
      params={parseListingParams(query)}
      lead={await builderLinksFor(range.slug)}
    />
  );
}
