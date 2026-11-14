import NextLink from 'next/link';
import { ProductGrid } from '@/features/catalogue';
import type { SearchRecord } from '@/features/search';
import styles from './HomeSections.module.css';

export function FeaturedProducts({
  heading,
  products,
}: {
  heading: string;
  products: SearchRecord[];
}) {
  if (products.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <div className={styles.headRow}>
        <div className={styles.head}>
          <p className="eyebrow">From the shop</p>
          <h2 id="featured-title">{heading}</h2>
        </div>
        <NextLink href="/porcelain-paving/" className="chip">
          Shop all paving
        </NextLink>
      </div>
      <ProductGrid products={products} label={heading} />
    </section>
  );
}
