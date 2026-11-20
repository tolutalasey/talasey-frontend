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
import { BuilderLinks, getPergolaPages, PERGOLA_RANGE } from '@/features/pergola';
import { getPlainPage, plainPagePath, PlainPageView } from '@/features/pages';
import { parseListingParams } from '@/features/search';
import { pageMetadata } from '@/lib/seo';

// A range or category page, or else a plain page from /content at the same address (About,
// the policies and so on keep their current addresses). Filters and sort come from the query
// string, so the page renders per request and in full before it is sent: filtering works
// without JavaScript.
export const instant = false;

type Props = PageProps<'/[range]'>;

async function load({ params, searchParams }: Props) {
  const range = await getRange((await params).range);
  if (!range) return null;
  const query = await searchParams;
  const listing = await getRangeListing(range, parseListingParams(query));
  return { range, query, listing };
}

async function plainPage({ params }: Props) {
  const page = await getPlainPage((await params).range);
  if (!page) notFound();
  return page;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const loaded = await load(props);
  if (!loaded) {
    const page = await plainPage(props);
    return pageMetadata({ ...page.seo, path: plainPagePath(page), noindex: page.placeholder });
  }
  const { range, query, listing } = loaded;
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
    const pages = await getPergolaPages();
    return pages.length > 0 && <BuilderLinks pages={pages} />;
  }
  if (slug === FENCING_RANGE) return <FenceBuilderLinks builders={await getFenceBuilders()} />;
  return null;
}

export default async function Range(props: Props) {
  const loaded = await load(props);
  if (!loaded) return <PlainPageView page={await plainPage(props)} />;
  const { range, query, listing } = loaded;
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
