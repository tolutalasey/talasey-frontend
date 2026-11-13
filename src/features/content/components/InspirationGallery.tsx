import Image from 'next/image';
import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import type { InspirationFacet, InspirationFilters } from '../inspiration';
import type { Inspiration } from '../schemas';
import styles from './Content.module.css';

interface InspirationGalleryProps {
  shown: Inspiration[];
  facets: InspirationFacet[];
  filters: InspirationFilters;
}

const hrefFor = (filters: InspirationFilters, id: string, slug: string | undefined) => {
  const query = new URLSearchParams(
    Object.entries({ ...filters, [id]: slug }).flatMap(([key, value]) =>
      value ? [[key, value]] : [],
    ),
  );
  const search = query.toString();
  return search ? `/inspiration/?${search}` : '/inspiration/';
};

export function InspirationGallery({ shown, facets, filters }: InspirationGalleryProps) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Inspiration', path: '/inspiration/' },
        ]}
      />
      <header className={styles.header}>
        <h1>Garden inspiration</h1>
        <p className={styles.intro}>
          Real gardens laid with our products, photographed by our customers and installers.
        </p>
      </header>
      {facets.length > 0 && (
        <nav aria-label="Filter the gallery" className={styles.filters}>
          {facets.map((facet) => (
            <div key={facet.id} className={styles.filterGroup}>
              <p id={`filter-${facet.id}`}>{facet.label}</p>
              <ul aria-labelledby={`filter-${facet.id}`}>
                {facet.values.map((value) => (
                  <li key={value.slug}>
                    <NextLink
                      href={hrefFor(filters, facet.id, value.selected ? undefined : value.slug)}
                      aria-current={value.selected ? 'true' : undefined}
                      scroll={false}
                    >
                      {value.label} ({value.count})
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
      {shown.length === 0 ? (
        <p className={styles.note}>
          We&rsquo;re gathering photos of finished gardens. If you&rsquo;ve used our products,{' '}
          <NextLink href="/contact/?topic=photos">send us yours</NextLink>.
        </p>
      ) : (
        <ul className={styles.gallery}>
          {shown.map((item) => (
            <li key={item.slug}>
              <figure>
                <Image {...item.photo} sizes="(min-width: 64rem) 33vw, 100vw" />
                <figcaption>
                  {item.title}
                  {item.town && `, ${item.town}`}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
