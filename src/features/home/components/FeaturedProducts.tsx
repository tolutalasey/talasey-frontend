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
    <section className={`container ${styles.section}`} aria-labelledby="featured-title">
      <div className={styles.heading}>
        <p className="eyebrow">From the shop</p>
        <h2 id="featured-title">{heading}</h2>
      </div>
      <ProductGrid products={products} label={heading} />
    </section>
  );
}
