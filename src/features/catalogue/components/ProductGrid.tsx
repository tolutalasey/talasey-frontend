import { ProductCard } from '@/ui/ProductCard/ProductCard';
import type { SearchRecord } from '@/features/search';
import { productCard } from '../cards';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: SearchRecord[];
  label: string;
  // How many cards at the top load their photo straight away.
  eager?: number;
}

export function ProductGrid({ products, label, eager = 0 }: ProductGridProps) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard {...productCard(product)} loading={index < eager ? 'eager' : 'lazy'} />
        </li>
      ))}
    </ul>
  );
}
