import type { ReactNode } from 'react';
import { StockStatus, type StockStatusProps } from '../StockStatus/StockStatus';
import styles from './ProductCard.module.css';

export interface ProductCardImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductCardProps {
  href: string;
  name: string;
  image: ProductCardImage;
  price: string | null;
  priceNote?: string;
  stock?: StockStatusProps;
  badge?: string;
  // Cards in the first row of a listing load straight away; they are often the largest paint.
  loading?: 'eager' | 'lazy';
  // Buttons under the card, such as order a sample or share, as on the current site.
  actions?: ReactNode;
}

// The whole card is one link, named by the product. Price and stock sit outside the link text so
// the link name stays short.
export function ProductCard({
  href,
  name,
  image,
  price,
  priceNote,
  stock,
  badge,
  loading = 'lazy',
  actions,
}: ProductCardProps) {
  return (
    <article className={styles.card} data-actions={actions ? '' : undefined}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={loading}
          decoding="async"
        />
        {badge && <p className={styles.badge}>{badge}</p>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>
          <a className={styles.link} href={href}>
            {name}
          </a>
        </h3>
        <p className={styles.price}>
          {price ?? 'Price on request'}
          {price && priceNote && <span className={styles.priceNote}> {priceNote}</span>}
        </p>
        {stock && <StockStatus {...stock} />}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
      <span className={styles.go} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </article>
  );
}
