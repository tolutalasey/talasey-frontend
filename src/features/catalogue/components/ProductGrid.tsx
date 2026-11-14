import { ProductCard } from '@/ui/ProductCard/ProductCard';
import type { ReactNode } from 'react';
import type { SearchRecord } from '@/features/search';
import { productCard } from '../cards';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: SearchRecord[];
  label: string;
  // How many cards at the top load their photo straight away.
  eager?: number;
  // A wide card placed after this many products, such as the free samples offer.
  insert?: { after: number; content: ReactNode };
}

export function ProductGrid({ products, label, eager = 0, insert }: ProductGridProps) {
  const cards = products.map((product, index) => (
    <li key={product.id}>
      <ProductCard {...productCard(product)} loading={index < eager ? 'eager' : 'lazy'} />
    </li>
  ));
  if (insert && products.length > insert.after) {
    cards.splice(
      insert.after,
      0,
      <li key="insert" className={styles.wide}>
        {insert.content}
      </li>,
    );
  }
  return (
    <ul className={styles.grid} aria-label={label}>
      {cards}
    </ul>
  );
}
