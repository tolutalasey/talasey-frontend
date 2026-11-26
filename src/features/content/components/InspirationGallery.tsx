import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import type { InspirationFacet, InspirationFilters } from '../inspiration';
import type { Inspiration } from '../schemas';
import type { GalleryPhoto } from '../views.server';
import { GALLERY_CATEGORIES, type GalleryCategory } from '../gallery-categories';
import { InspirationGrid } from './InspirationGrid';
import styles from './Content.module.css';

interface InspirationGalleryProps {
  shown: GalleryPhoto[];
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

const inCategory = (item: Inspiration, category: GalleryCategory) =>
  item.categories.some((name) => name.toLowerCase() === category.name.toLowerCase());

const PLACEHOLDERS = 4;

function PhotosComing() {
  return (
    <ul className={styles.gallery} aria-label="Photos coming soon">
      {Array.from({ length: PLACEHOLDERS }, (_, at) => (
        <li key={at}>
          <div className={styles.photoPlaceholder}>
            <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" />
              <circle cx="9" cy="10" r="1.5" fill="currentColor" />
              <path d="M4 17l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" />
            </svg>
            <span>Photo coming soon</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Section({ category, items }: { category: GalleryCategory; items: GalleryPhoto[] }) {
  return (
    <section className={styles.gallerySection} aria-labelledby={`gallery-${category.slug}`}>
      <h2 id={`gallery-${category.slug}`}>{category.name}</h2>
      <p className={styles.intro}>{category.intro}</p>
      {items.length > 0 ? (
        <InspirationGrid items={items} />
      ) : (
        <PhotosComing />
      )}
    </section>
  );
}

// The gallery in Amy's sections: tabs for each, then every section with its words and photos,
// or just the one chosen. Photos and their sections are set in /content (Inspiration).
export function InspirationGallery({ shown, facets, filters }: InspirationGalleryProps) {
  const chosen = GALLERY_CATEGORIES.find((category) => category.slug === filters.category);
  const otherFacets = facets.filter((facet) => facet.id !== 'category');
  const sections = (chosen ? [chosen] : GALLERY_CATEGORIES).map((category) => ({
    category,
    items: shown.filter((item) => inCategory(item, category)),
  }));
  const unsorted = chosen
    ? []
    : shown.filter((item) => !GALLERY_CATEGORIES.some((category) => inCategory(item, category)));
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
      <nav aria-label="Gallery sections" className={styles.galleryTabs}>
        <ul>
          <li>
            <NextLink
              href={hrefFor(filters, 'category', undefined)}
              aria-current={chosen ? undefined : 'true'}
              scroll={false}
            >
              All
            </NextLink>
          </li>
          {GALLERY_CATEGORIES.map((category) => (
            <li key={category.slug}>
              <NextLink
                href={hrefFor(filters, 'category', category.slug)}
                aria-current={category === chosen ? 'true' : undefined}
                scroll={false}
              >
                {category.name}
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>
      {otherFacets.length > 0 && (
        <nav aria-label="Filter the gallery" className={styles.filters}>
          {otherFacets.map((facet) => (
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
      {sections.map(({ category, items }) => (
        <Section key={category.slug} category={category} items={items} />
      ))}
      {unsorted.length > 0 && (
        <section className={styles.gallerySection} aria-labelledby="gallery-more">
          <h2 id="gallery-more">More gardens</h2>
          <InspirationGrid items={unsorted} />
        </section>
      )}
    </article>
  );
}
