import type { ReactNode } from 'react';
import type { SampleOffer } from '@/api-client';
import { ProductGrid } from '@/features/catalogue';
import { PageBreadcrumbs } from '@/features/layout';
import { toSearchRecord } from '@/features/search';
import type { ProductView } from '../view.server';
import { ProductIntro } from './ProductIntro';
import { ProductPhotos } from './ProductPhotos';
import styles from './ProductPage.module.css';

interface Props {
  view: ProductView;
  offers: SampleOffer[];
  resources?: ReactNode;
}

// A product sold in several colours, as the current site's range pages show it: what it is, then a
// card for each colour leading to that colour's own page.
export function ColourChoicesPage({ view, offers, resources }: Props) {
  const { product, breadcrumbs, photos } = view;
  const range = breadcrumbs.length > 2 ? breadcrumbs[1]?.name : null;
  const record = toSearchRecord(product);
  const sizes = product.options.find((option) => option.title === 'Size')?.values ?? [];
  return (
    <article className={styles.product}>
      <PageBreadcrumbs items={breadcrumbs} />
      <div className={styles.top}>
        <div className={`frame ${styles.media}`}>
          <ProductPhotos photos={photos} name={product.title} />
        </div>
        <div className={`frame ${styles.buy}`}>
          {range && <p className="eyebrow">{range}</p>}
          <h1>{product.title}</h1>
          {product.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}
          <ProductIntro
            description={product.description}
            sizes={sizes}
            tags={[`${record.colours.length} colours`]}
          />
          <p>
            <a href="#colours" className="button">
              View all colours
            </a>
          </p>
        </div>
      </div>
      <section id="colours" className={styles.colours} aria-labelledby="colours-title">
        <h2 id="colours-title">Choose your colour</h2>
        <ProductGrid
          products={[record]}
          label={`${product.title} colours`}
          eager={4}
          byColour={{ offers }}
        />
      </section>
      {resources}
    </article>
  );
}
