import NextLink from 'next/link';
import { ProductGrid } from '@/features/catalogue';
import { PageBreadcrumbs } from '@/features/layout';
import type { SearchRecord } from '@/features/search';
import { formatDay } from '@/lib/format';
import { JsonLd } from '@/lib/JsonLd';
import { articleJsonLd } from '@/lib/seo';
import { guidePath } from '../paths';
import type { Guide } from '../schemas';
import styles from './Content.module.css';
import { FaqList } from './FaqList';

// PRD section 6: the short answer first, then the steps, the products used, questions, the
// author and the date.
export function GuidePage({ guide, products }: { guide: Guide; products: SearchRecord[] }) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides/' },
          { name: guide.title, path: guidePath(guide) },
        ]}
      />
      <header className={styles.header}>
        <h1>{guide.title}</h1>
        <p className={styles.byline}>
          By {guide.author.name}
          {guide.author.role && `, ${guide.author.role}`} · Published{' '}
          <time dateTime={guide.publishedOn}>{formatDay(guide.publishedOn)}</time>
          {guide.reviewedOn && (
            <>
              {' '}
              · Checked <time dateTime={guide.reviewedOn}>{formatDay(guide.reviewedOn)}</time>
            </>
          )}
        </p>
        <p className={styles.answer}>{guide.answer}</p>
      </header>
      {guide.steps.length > 0 && (
        <section aria-labelledby="steps-title" className={styles.section}>
          <h2 id="steps-title">Step by step</h2>
          <ol className={styles.steps}>
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}
      {guide.body.length > 0 && (
        <section className={styles.section}>
          {guide.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}
      {products.length > 0 && (
        <section aria-labelledby="used-title" className={styles.wide}>
          <h2 id="used-title">Products in this guide</h2>
          <ProductGrid products={products} label="Products in this guide" />
        </section>
      )}
      <FaqList faqs={guide.faqs} />
      <JsonLd
        data={articleJsonLd({
          headline: guide.title,
          description: guide.seo.description,
          path: guidePath(guide),
          author: guide.author,
          datePublished: guide.publishedOn,
          dateModified: guide.reviewedOn,
        })}
      />
      {guide.mainPage && (
        <p className={styles.section}>
          <NextLink href={guide.mainPage}>See the full range</NextLink>
        </p>
      )}
    </article>
  );
}
