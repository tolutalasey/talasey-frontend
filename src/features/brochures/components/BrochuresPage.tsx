import Image from 'next/image';
import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import type { Brochure } from '../schemas';
import styles from './Brochures.module.css';

export function BrochuresPage({ brochures }: { brochures: Brochure[] }) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Brochures', path: '/brochures/' },
        ]}
      />
      <header className={styles.header}>
        <p className="eyebrow">Free to view and download</p>
        <h1>Our brochures</h1>
        <p className={styles.intro}>
          Browse the full collection online, from paving and composite decking to pergolas, lighting
          and finishing touches.
        </p>
      </header>
      <section className={styles.panel} aria-labelledby="collection-title">
        <h2 id="collection-title">Browse the full collection</h2>
        <ul className={styles.documents}>
          {brochures.map((brochure) => (
            <li key={brochure.slug} className={styles.card}>
              <div className={styles.cover}>
                {brochure.cover && (
                  <Image
                    src={brochure.cover.src}
                    alt=""
                    width={brochure.cover.width}
                    height={brochure.cover.height}
                    sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 33vw, 100vw"
                  />
                )}
              </div>
              <p className={styles.kind}>Edition {String(brochure.edition).padStart(2, '0')}</p>
              <h3 className={styles.cardTitle}>
                {brochure.link ? (
                  <a
                    href={brochure.link}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {brochure.title}
                  </a>
                ) : (
                  brochure.title
                )}
              </h3>
              <p className={styles.muted}>{brochure.summary}</p>
              <p className={styles.action} aria-hidden="true">
                {brochure.link ? 'View and download' : 'Coming soon'}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.panel} aria-labelledby="thanks-title">
        <h2 id="thanks-title">Brochure acknowledgements</h2>
        <p className={styles.muted}>
          Our sincere thanks to the landscaping professionals whose photos brought this collection
          to life.
        </p>
        <p>
          <NextLink href="/brochure-acknowledgements/" className="chip">
            See who we&apos;d like to thank
          </NextLink>
        </p>
      </section>
    </article>
  );
}
