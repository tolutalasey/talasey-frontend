import NextLink from 'next/link';
import type { SearchRecord } from '@/features/search';
import { ProductGrid } from './ProductGrid';
import styles from './Listing.module.css';

interface Props {
  heading: string;
  products: SearchRecord[];
  more?: { href: string; label: string };
}

// A row of products under a product page, such as others from the same range.
export function RelatedProducts({ heading, products, more }: Props) {
  if (products.length === 0) return null;
  return (
    <section className={styles.related} aria-labelledby="related-title">
      <div className={styles.relatedHead}>
        <h2 id="related-title">{heading}</h2>
        {more && (
          <NextLink href={more.href} className="chip">
            {more.label}
          </NextLink>
        )}
      </div>
      <ProductGrid products={products} label={heading} fill />
    </section>
  );
}
