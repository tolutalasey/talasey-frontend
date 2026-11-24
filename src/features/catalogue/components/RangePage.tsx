import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import type { SampleOffer } from '@/api-client';
import { DetailsForm } from '@/features/contact';
import { PageBreadcrumbs } from '@/features/layout';
import { hasFilters, withoutFilter, type ListingParams } from '@/features/search';
import { formatPrice } from '@/lib/format';
import { JsonLd } from '@/lib/JsonLd';
import { listingTarget } from '@/lib/listing-href';
import { collectionPageJsonLd } from '@/lib/seo';
import { productPath } from '@/lib/urls/keyword-map';
import { leadOrder } from '../lead-order';
import { curatedTargets } from '../listing-urls';
import type { RangeListing } from '../loaders.server';
import { offersSamples, rangeGallery, rangePhoto } from '../range-photos';
import { curatedPath, rangePath, type CuratedPage, type Range } from '../ranges';
import { ActiveFilters } from './ActiveFilters';
import { FilterForm } from './FilterForm';
import styles from './Listing.module.css';
import { Pagination } from './Pagination';
import { ProductGrid } from './ProductGrid';
import { RangeAfterword } from './RangeAfterword';
import { RangeGallery } from './RangeGallery';
import { RangeSlides } from './RangeSlides';
import { SamplesCard } from './SamplesCard';

interface RangePageProps {
  range: Range;
  curated?: CuratedPage;
  listing: RangeListing;
  params: ListingParams;
  // Shown under the header, before the products, like the pergola builders on /pergolas/.
  lead?: ReactNode;
  // The samples on offer, for each card's Order sample button.
  samples?: SampleOffer[];
}

const gbp = (amount: number) => formatPrice({ amount, currencyCode: 'GBP' });

function priceLine({ priceRange }: RangeListing): string | null {
  if (!priceRange) return null;
  if (priceRange.min === priceRange.max) return `Prices: ${gbp(priceRange.min)} inc. VAT`;
  return `Prices from ${gbp(priceRange.min)} to ${gbp(priceRange.max)} inc. VAT`;
}

const paragraphsOf = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const productCount = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;

export function RangePage({ range, curated, listing, params, lead, samples = [] }: RangePageProps) {
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
  const filtered = hasFilters(current.filters) || (params.sort ?? 'relevance') !== 'relevance';
  const ordered = leadOrder(result.hits, filtered ? [] : range.leadWith);
  const restHeading = range.restHeading && ordered.exact > 0 ? range.restHeading : null;
  const applied = result.facets.flatMap((facet) => facet.values.filter((v) => v.selected)).length;
  const photo = range.photo ?? { ...rangePhoto(range.slug), alt: '' };
  const gallery = (range.gallery.length > 0 ? range.gallery : rangeGallery(range.slug)).filter(
    (item) => item.photo.src !== photo.src,
  );

  return (
    <article className={styles.rangePage}>
      <PageBreadcrumbs items={crumbs} />
      <header className={styles.rangeHeader}>
        <div className={`frame ${styles.headerText}`}>
          {curated && <p className="eyebrow">{range.name}</p>}
          <h1>{curated?.h1 ?? range.h1}</h1>
          {paragraphsOf(curated?.intro ?? range.description ?? range.intro).map((paragraph) => (
            <p key={paragraph} className={styles.intro}>
              {paragraph}
            </p>
          ))}
          {price && <p className={styles.priceLine}>{price}</p>}
          <p className={styles.headerActions}>
            {inRange > 0 && (
              <a href="#results-title" className="button">
                View all products
              </a>
            )}
            {offersSamples(range.slug) && (
              <NextLink href="/samples/" className="button-secondary">
                Order free samples
              </NextLink>
            )}
          </p>
        </div>
        <div className={styles.headerPhoto}>
          {range.slides?.length ? (
            <RangeSlides name={range.name} photos={range.slides} />
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 64rem) 55vw, 100vw"
              priority
            />
          )}
        </div>
      </header>
      {lead}
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
        <RangeGallery
          name={range.name}
          items={gallery}
          withEnquiry
          samples={offersSamples(range.slug)}
        />
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
                products={ordered.hits}
                label={curated?.h1 ?? range.h1}
                eager={4}
                byColour={{ offers: samples }}
                fit={range.cardPhotos}
                insert={
                  restHeading
                    ? {
                        after: ordered.exact,
                        content: <h3 className={styles.restHeading}>{restHeading}</h3>,
                      }
                    : offersSamples(range.slug)
                      ? { after: 4, content: <SamplesCard /> }
                      : undefined
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

      {inRange > 0 && range.gallery.length > 0 && (
        <RangeGallery name={range.name} items={range.gallery} withEnquiry={false} samples={false} />
      )}
      <RangeAfterword range={range} />
      <section className={`frame ${styles.message}`} aria-label="Send us a message">
        {range.closing && (
          <div className={styles.bespoke}>
            <p className="eyebrow">Made to order</p>
            {paragraphsOf(range.closing).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        <DetailsForm id="contact" />
      </section>
      <JsonLd
        data={collectionPageJsonLd(
          { name: curated?.h1 ?? range.h1, path: crumbs.at(-1)?.path ?? base },
          result.hits.map((hit) => ({ name: hit.title, path: productPath(hit.handle) })),
        )}
      />
    </article>
  );
}
