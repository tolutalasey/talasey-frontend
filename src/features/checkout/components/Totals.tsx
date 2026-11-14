import type { Price } from '@/api-client';
import { formatPrice } from '@/lib/format';
import styles from './Checkout.module.css';

interface Props {
  itemTotal: Price;
  deliveryTotal: Price | null;
  discount?: Price | null;
  promotions?: string[];
  total: Price;
}

export function Totals({ itemTotal, deliveryTotal, discount, promotions = [], total }: Props) {
  return (
    <dl className={styles.totals}>
      <dt>Items</dt>
      <dd>{formatPrice(itemTotal)}</dd>
      {discount && (
        <>
          <dt>Discount{promotions.length > 0 && `: ${promotions.join(', ')}`}</dt>
          <dd>−{formatPrice(discount)}</dd>
        </>
      )}
      <dt>Delivery</dt>
      <dd>
        {deliveryTotal
          ? deliveryTotal.amount === 0
            ? 'Free'
            : formatPrice(deliveryTotal)
          : 'Worked out at checkout'}
      </dd>
      <dt className={styles.grand}>Total inc. VAT</dt>
      <dd className={styles.grand}>{formatPrice(total)}</dd>
    </dl>
  );
}
