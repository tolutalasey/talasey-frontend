import type { ReactNode } from 'react';
import { ProductGrid, type Range, rangePath } from '@/features/catalogue';
import { PageBreadcrumbs } from '@/features/layout';
import type { SearchRecord } from '@/features/search';
import type { BreadcrumbItem } from '@/lib/seo';
import type { BrandPage } from '../schemas';
import { Cards } from './Cards';
import styles from './Content.module.css';
import { FaqList } from './FaqList';

interface StoryPageProps {
  page: BrandPage;
  breadcrumbs: BreadcrumbItem[];
  ranges: Range[];
  products: SearchRecord[];
  productsHeading: string;
  pointsHeading: string;
  children?: ReactNode;
}

// The shared shape of brand and project pages: intro, story, figures, points, ranges, products.
export function StoryPage({
  page,
  breadcrumbs,
  ranges,
  products,
  productsHeading,
  pointsHeading,
  children,
}: StoryPageProps) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs items={breadcrumbs} />
      <header className={styles.header}>
        <h1>{page.h1}</h1>
        <p className={styles.intro}>{page.intro}</p>
      </header>
      {page.story.length > 0 && (
        <section aria-labelledby="story-title" className={styles.section}>
          <h2 id="story-title">The story</h2>
          {page.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}
      {children}
      {page.facts.length > 0 && (
        <section aria-labelledby="facts-title" className={styles.section}>
          <h2 id="facts-title">In figures</h2>
          <dl className={styles.facts}>
            {page.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {page.points.length > 0 && (
        <section aria-labelledby="points-title" className={styles.section}>
          <h2 id="points-title">{pointsHeading}</h2>
          <ul>
            {page.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      )}
      {ranges.length > 0 && (
        <section aria-labelledby="ranges-title" className={styles.wide}>
          <h2 id="ranges-title">Ranges</h2>
          <Cards
            label="Ranges"
            items={ranges.map((range) => ({
              href: rangePath(range),
              title: range.name,
              text: range.intro,
            }))}
          />
        </section>
      )}
      {products.length > 0 && (
        <section aria-labelledby="products-title" className={styles.wide}>
          <h2 id="products-title">{productsHeading}</h2>
          <ProductGrid products={products} label={productsHeading} />
        </section>
      )}
      <FaqList faqs={page.faqs} />
    </article>
  );
}
