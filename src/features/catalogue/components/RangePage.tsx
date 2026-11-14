import Image from 'next/image';
import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import { hasFilters, withoutFilter, type ListingParams } from '@/features/search';
import { formatPrice } from '@/lib/format';
import { JsonLd } from '@/lib/JsonLd';
import { listingTarget } from '@/lib/listing-href';
import { collectionPageJsonLd } from '@/lib/seo';
import { productPath } from '@/lib/urls/keyword-map';
import { curatedTargets } from '../listing-urls';
import type { RangeListing } from '../loaders.server';
import { offersSamples, rangePhoto } from '../range-photos';
import { curatedPath, rangePath, type CuratedPage, type Range } from '../ranges';
import { ActiveFilters } from './ActiveFilters';
import { FilterForm } from './FilterForm';
import styles from './Listing.module.css';
import { Pagination } from './Pagination';
import { ProductGrid } from './ProductGrid';
import { RangeAfterword } from './RangeAfterword';
import { SamplesCard } from './SamplesCard';

interface RangePageProps {
  range: Range;
  curated?: CuratedPage;
  listing: RangeListing;
  params: ListingParams;
}

const gbp = (amount: number) => formatPrice({ amount, currencyCode: 'GBP' });

function priceLine({ priceRange }: RangeListing): string | null {
  if (!priceRange) return null;
  if (priceRange.min === priceRange.max) return `Prices: ${gbp(priceRange.min)} inc. VAT`;
  return `Prices from ${gbp(priceRange.min)} to ${gbp(priceRange.max)} inc. VAT`;
}

const productCount = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;

export function RangePage({ range, curated, listing, params }: RangePageProps) {
  const { result, inRange } = listing;
  const base = rangePath(range);
  const current = { ...params, filters: { ...params.filters, ...curated?.filters } };
  const targets = curatedTargets(range);
  const hrefWith = (change: Partial<ListingParams>) =>
    listingTarget(base, { ...current, ...change }, targets);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: range.name, path: base },
    ...(curated ? [{ name: curated.name, path: curatedPath(range, curated) }] : []),
  ];
  const price = priceLine(listing);
  const applied = result.facets.flatMap((facet) => facet.values.filter((v) => v.selected)).length;
  const photo = rangePhoto(range.slug);

  return (
    <article className={styles.rangePage}>
      <PageBreadcrumbs items={crumbs} />
      <header className={styles.rangeHeader}>
        <div className={`frame ${styles.headerText}`}>
          {curated && <p className="eyebrow">{range.name}</p>}
          <h1>{curated?.h1 ?? range.h1}</h1>
          <p className={styles.intro}>{curated?.intro ?? range.intro}</p>
          {price && <p className={styles.priceLine}>{price}</p>}
          {offersSamples(range.slug) && (
            <p className={styles.headerActions}>
              <NextLink href="/samples/" className="button">
                Order free samples
              </NextLink>
            </p>
          )}
        </div>
        <div className={styles.headerPhoto}>
          <Image
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 64rem) 55vw, 100vw"
            priority
          />
        </div>
      </header>
      {range.curated.length > 0 && (
        <nav aria-label={`More ${range.name.toLowerCase()}`} className={styles.curated}>
          <ul>
            <li>
              <NextLink href={base} aria-current={curated ? undefined : 'page'}>
                All {range.name.toLowerCase()}
              </NextLink>
            </li>
            {range.curated.map((page) => (
              <li key={page.slug}>
                <NextLink
                  href={curatedPath(range, page)}
                  aria-current={page.slug === curated?.slug ? 'page' : undefined}
                >
                  {page.name}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {inRange === 0 ? (
        <section className={`frame ${styles.empty}`} aria-labelledby="coming-title">
          <h2 id="coming-title">Coming to the new site soon</h2>
          <p>
            We&rsquo;re still adding {range.name.toLowerCase()} to the online shop. For prices,
            samples or advice, get in touch and we&rsquo;ll help.
          </p>
          <p className={styles.headerActions}>
            <NextLink href="/contact/" className="button">
              Contact us
            </NextLink>
            <NextLink href="/samples/" className="chip">
              Free samples
            </NextLink>
          </p>
        </section>
      ) : (
        <div className={styles.layout}>
          <FilterForm
            action={base}
            facets={result.facets}
            sort={params.sort ?? 'relevance'}
            applied={applied}
            curated={targets}
          />
          <section aria-labelledby="results-title" className={styles.results}>
            <div className={styles.resultsBar}>
              <h2 id="results-title" className={styles.resultsTitle}>
                Products
              </h2>
              <p role="status" className={styles.total}>
                {productCount(result.total)}
              </p>
            </div>
            <ActiveFilters
              facets={result.facets}
              removeHref={(facet, slug) =>
                hrefWith({ filters: withoutFilter(current.filters, facet, slug), page: 1 })
              }
              clearHref={base}
            />
            {result.total === 0 ? (
              <p className={`frame ${styles.noMatch}`}>
                No products match {hasFilters(current.filters) ? 'these filters' : 'yet'}.{' '}
                <NextLink href={base}>Clear filters</NextLink>
              </p>
            ) : (
              <ProductGrid
                products={result.hits}
                label={curated?.h1 ?? range.h1}
                eager={4}
                insert={
                  offersSamples(range.slug) ? { after: 4, content: <SamplesCard /> } : undefined
                }
              />
            )}
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              hrefFor={(page) => hrefWith({ page })}
            />
          </section>
        </div>
      )}

      <RangeAfterword range={range} />
      <JsonLd
        data={collectionPageJsonLd(
          { name: curated?.h1 ?? range.h1, path: crumbs.at(-1)?.path ?? base },
          result.hits.map((hit) => ({ name: hit.title, path: productPath(hit.handle) })),
        )}
      />
    </article>
  );
}
