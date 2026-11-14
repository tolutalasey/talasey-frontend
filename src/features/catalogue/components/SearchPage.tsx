import NextLink from 'next/link';
import { type ListingParams, type SearchResult, withoutFilter } from '@/features/search';
import { PageBreadcrumbs } from '@/features/layout';
import { listingHref } from '@/lib/listing-href';
import { rangePath, type Range } from '../ranges';
import { ActiveFilters } from './ActiveFilters';
import { FilterForm } from './FilterForm';
import styles from './Listing.module.css';
import { Pagination } from './Pagination';
import { ProductGrid } from './ProductGrid';

interface SearchPageProps {
  query: string;
  result: SearchResult | null;
  params: ListingParams;
  suggestedRanges: Range[];
}

const PATH = '/search/';

const productCount = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;

function NoResults({ query, ranges }: { query: string; ranges: Range[] }) {
  return (
    <section aria-labelledby="none-title" className={`frame ${styles.empty}`}>
      <h2 id="none-title">No products match &ldquo;{query}&rdquo;</h2>
      <p>Check the spelling, try fewer or more general words, or browse a range:</p>
      <ul className={styles.rangeChips}>
        {ranges.map((range) => (
          <li key={range.slug}>
            <NextLink href={rangePath(range)} className="chip">
              {range.name}
            </NextLink>
          </li>
        ))}
      </ul>
      <p>
        Still stuck? <NextLink href="/help/">Visit the help centre</NextLink> or{' '}
        <NextLink href="/contact/">ask us</NextLink> and we&rsquo;ll find it for you.
      </p>
    </section>
  );
}

export function SearchPage({ query, result, params, suggestedRanges }: SearchPageProps) {
  const hrefWith = (change: Partial<ListingParams>) => {
    const href = listingHref(PATH, { ...params, ...change });
    return `${href}${href.includes('?') ? '&' : '?'}q=${encodeURIComponent(query)}`;
  };
  const heading = query ? `Search results for “${query}”` : 'Search';

  return (
    <article className={styles.rangePage}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Search', path: '/search/' },
        ]}
      />
      <header className={styles.searchHeader}>
        <h1>{heading}</h1>
        <form role="search" action={PATH} method="get" className={styles.bigSearch}>
          <label htmlFor="search-again" className={styles.visuallyHidden}>
            Search products
          </label>
          <input
            id="search-again"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Paving, decking, planters…"
            autoComplete="off"
          />
          <button type="submit" className="button">
            Search
          </button>
        </form>
        {result?.partialMatch && result.total > 0 && (
          <p className={styles.intro}>
            Nothing matched every word, so these products match some of them.
          </p>
        )}
      </header>
      {!query && <p className={styles.intro}>Type what you are looking for above.</p>}
      {query && result && result.total === 0 && (
        <NoResults query={query} ranges={suggestedRanges} />
      )}
      {query && result && result.total > 0 && (
        <div className={styles.layout}>
          <FilterForm
            action={PATH}
            facets={result.facets}
            sort={params.sort ?? 'relevance'}
            query={query}
            applied={result.facets.flatMap((f) => f.values.filter((v) => v.selected)).length}
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
                hrefWith({ filters: withoutFilter(params.filters, facet, slug), page: 1 })
              }
              clearHref={hrefWith({ filters: {}, page: 1 })}
            />
            <ProductGrid products={result.hits} label="Search results" eager={4} />
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              hrefFor={(page) => hrefWith({ page })}
            />
          </section>
        </div>
      )}
    </article>
  );
}
