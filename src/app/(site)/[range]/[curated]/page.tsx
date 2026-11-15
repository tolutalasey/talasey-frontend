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
import {
  getPergolaBuilder,
  getPergolaBuilders,
  getPergolaCatalogue,
  PERGOLA_RANGE,
  PergolaBuilderPage,
} from '@/features/pergola';
import { parseListingParams } from '@/features/search';
import { pageMetadata } from '@/lib/seo';

export const instant = false;

type Props = PageProps<'/[range]/[curated]'>;

// /pergolas/<builder>/ is a pergola builder (page type 4) rather than a curated listing.
async function builderFor({ params }: Props) {
  const { range, curated } = await params;
  return range === PERGOLA_RANGE ? getPergolaBuilder(curated) : null;
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
  const builder = await builderFor(props);
  if (builder) {
    return pageMetadata({
      ...builder.seo,
      path: `/${PERGOLA_RANGE}/${builder.slug}/`,
      noindex: Object.keys(await props.searchParams).length > 0,
    });
  }
  const { range, curated, query, listing } = await load(props);
  return pageMetadata({
    ...curated.seo,
    path: listingCanonical(range, curated),
    noindex: hasListingParams(query) || listing.result.total === 0,
  });
}

export default async function CuratedRange(props: Props) {
  const builder = await builderFor(props);
  if (builder) {
    const [catalogue, all, query] = await Promise.all([
      getPergolaCatalogue(),
      getPergolaBuilders(),
      props.searchParams,
    ]);
    const others = all
      .filter((other) => other.slug !== builder.slug)
      .map((other) => {
        const biggest = [...other.sizes].sort((a, b) => b.width * b.depth - a.width * a.depth)[0];
        return {
          slug: other.slug,
          range: other.range,
          biggest: biggest?.label ?? '',
          area: biggest ? biggest.width * biggest.depth : 0,
        };
      });
    return (
      <PergolaBuilderPage
        builder={builder}
        catalogue={catalogue}
        others={others}
        design={query.design === 'tolu' ? 'tolu' : 'amy'}
        path={`/${PERGOLA_RANGE}/${builder.slug}/`}
      />
    );
  }
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
