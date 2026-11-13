import { StockStatus, type StockStatusProps } from '@/ui';
import { formatPrice } from '@/lib/format';
import type { PackPricing } from '../pricing';
import styles from './ProductPage.module.css';

export function PriceSummary({
  pricing,
  stock,
}: {
  pricing: PackPricing | null;
  stock: StockStatusProps;
}) {
  return (
    <div className={styles.priceSummary}>
      {pricing ? (
        <p className={styles.price} data-testid="product-price">
          {formatPrice(pricing.perPack)}
          {pricing.coverageM2 && <span className={styles.unit}> per pack</span>}{' '}
          <span className={styles.vat}>inc. VAT</span>
        </p>
      ) : (
        <p className={styles.price} data-testid="product-price">
          Price on request
        </p>
      )}
      {pricing?.perM2 && (
        <p className={styles.perM2} data-testid="price-per-m2">
          {formatPrice(pricing.perM2)} per m² inc. VAT · each pack covers {pricing.coverageM2} m²
        </p>
      )}
      <StockStatus {...stock} />
    </div>
  );
}
