import Image from 'next/image';
import NextLink from 'next/link';
import { Pagination } from '@/features/catalogue';
import { PageBreadcrumbs } from '@/features/layout';
import {
  ACKNOWLEDGEMENTS_PATH,
  filterThanks,
  thanksHref,
  type ThanksFilters,
} from '../acknowledgements';
import { ACKNOWLEDGEMENT_RANGES, type Acknowledgement } from '../schemas';
import styles from './Brochures.module.css';

interface Props {
  entries: Acknowledgement[];
  filters: ThanksFilters;
}

// Paging and filters keep the scroll position, so the list never jumps back to the top.
export function AcknowledgementsPage({ entries, filters }: Props) {
  const result = filterThanks(entries, filters);
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Brochures', path: '/brochures/' },
          { name: 'Acknowledgements', path: ACKNOWLEDGEMENTS_PATH },
        ]}
      />
      <header className={styles.header}>
        <h1>Brochure acknowledgements</h1>
        <p className={styles.intro}>
          Our sincere thanks to the landscaping professionals whose photos brought our brochures to
          life.
        </p>
      </header>
      <section className={styles.panel} aria-labelledby="thanks-title">
        <div className={styles.headRow}>
          <h2 id="thanks-title">Installers</h2>
          <p className={styles.muted} aria-live="polite">
            {result.total} {result.total === 1 ? 'company' : 'companies'}
          </p>
        </div>
        <div className={styles.filterGroup}>
          <p id="thanks-range">Product range</p>
          <ul className={styles.chips} aria-labelledby="thanks-range">
            {ACKNOWLEDGEMENT_RANGES.filter((range) => result.counts[range] > 0).map((range) => (
              <li key={range}>
                <NextLink
                  href={thanksHref(filters, {
                    range: filters.range === range ? null : range,
                    page: 1,
                  })}
                  aria-current={filters.range === range ? 'true' : undefined}
                  scroll={false}
                >
                  {range} ({result.counts[range]})
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
        <ul className={styles.thanks}>
          {result.shown.map((entry) => {
            const [first, ...more] = entry.photos;
            return (
              <li key={entry.slug} className={styles.card}>
                <div className={styles.cover}>
                  {first && (
                    <Image
                      src={first.src}
                      alt={first.alt}
                      width={first.width}
                      height={first.height}
                      sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
                    />
                  )}
                </div>
                <p className={styles.kind}>
                  {entry.page ? `Page ${entry.page} · ` : ''}
                  {entry.product}
                </p>
                <h3 className={styles.cardTitle}>{entry.company}</h3>
                {entry.about && <p className={styles.muted}>{entry.about}</p>}
                {more.length > 0 && (
                  <ul className={styles.thumbs} aria-label={`More photos by ${entry.company}`}>
                    {more.slice(0, 5).map((photo) => (
                      <li key={photo.src}>
                        <a href={photo.src} target="_blank" rel="noreferrer">
                          <Image src={photo.src} alt={photo.alt} width={96} height={96} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <Pagination
          page={result.page}
          pageCount={result.pages}
          hrefFor={(page) => thanksHref(filters, { page })}
          keepScroll
        />
      </section>
    </article>
  );
}
