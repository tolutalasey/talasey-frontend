import type { Price } from '@/api-client';
import { formatPrice } from '@/lib/format';
import styles from './Checkout.module.css';

interface Props {
  itemTotal: Price;
  deliveryTotal: Price | null;
  total: Price;
}

export function Totals({ itemTotal, deliveryTotal, total }: Props) {
  return (
    <dl className={styles.totals}>
      <dt>Items</dt>
      <dd>{formatPrice(itemTotal)}</dd>
      <dt>Delivery</dt>
      <dd>{deliveryTotal ? formatPrice(deliveryTotal) : 'Worked out at checkout'}</dd>
      <dt className={styles.grand}>Total inc. VAT</dt>
      <dd className={styles.grand}>{formatPrice(total)}</dd>
    </dl>
  );
}
