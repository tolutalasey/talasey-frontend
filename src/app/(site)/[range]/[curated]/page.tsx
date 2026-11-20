import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  getRange,
  getRangeListing,
  hasListingParams,
  listingCanonical,
  listingRedirect,
  RangePage,
} from '@/features/catalogue';
import { getPergolaPage, PERGOLA_RANGE } from '@/features/pergola';
import { parseListingParams } from '@/features/search';
import { pageMetadata } from '@/lib/seo';

export const instant = false;

type Props = PageProps<'/[range]/[curated]'>;

// /pergolas/<builder>/ was a builder page of its own; each builder now sits on its pergola's
// product page, so old links go there.
async function moveToProduct({ params, searchParams }: Props) {
  const { range, curated } = await params;
  const page = range === PERGOLA_RANGE ? await getPergolaPage(curated) : null;
  if (!page) return;
  const { design } = await searchParams;
  permanentRedirect(design === 'tolu' ? `${page.path}?design=tolu` : page.path);
}

async function load({ params, searchParams }: Props) {
  const { range: rangeSlug, curated: curatedSlug } = await params;
  const range = await getRange(rangeSlug);
  const curated = range?.curated.find((page) => page.slug === curatedSlug);
  if (!range || !curated) notFound();
  const query = await searchParams;
  const listing = await getRangeListing(range, parseListingParams(query), curated);
  return { range, curated, query, listing };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  await moveToProduct(props);
  const { range, curated, query, listing } = await load(props);
  return pageMetadata({
    ...curated.seo,
    path: listingCanonical(range, curated),
    noindex: hasListingParams(query) || listing.result.total === 0,
  });
}

export default async function CuratedRange(props: Props) {
  await moveToProduct(props);
  const { range, curated, query, listing } = await load(props);
  const target = listingRedirect(range, query, curated);
  if (target) permanentRedirect(target);
  return (
    <RangePage
      range={range}
      curated={curated}
      listing={listing}
      params={parseListingParams(query)}
    />
  );
}
