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
      <h2 id="featured-title">{heading}</h2>
      <ProductGrid products={products} label={heading} />
    </section>
  );
}
