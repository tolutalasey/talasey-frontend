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
}: ProductCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding="async"
      />
      <div className={styles.body}>
        {badge && <p className={styles.badge}>{badge}</p>}
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
    </article>
  );
}
