import type { BasketLine, BasketSample } from '@/api-client';
import { formatPrice } from '@/lib/format';
import styles from './Checkout.module.css';

interface Props {
  lines: BasketLine[];
  samples?: BasketSample[];
  stock?: Record<string, string>;
}

export function BasketLines({ lines, samples = [], stock }: Props) {
  return (
    <table className={styles.lines}>
      <caption className={styles.caption}>Items</caption>
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Qty</th>
          <th scope="col">Price inc. VAT</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={line.id}>
            <th scope="row">
              {line.title}
              {line.variantTitle && <span className={styles.muted}> · {line.variantTitle}</span>}
              {line.colour && <span className={styles.muted}> · {line.colour}</span>}
              {stock?.[line.id] && <span className={styles.stock}>{stock[line.id]}</span>}
            </th>
            <td>{line.quantity}</td>
            <td>{formatPrice(line.total)}</td>
          </tr>
        ))}
        {samples.map((sample) => (
          <tr key={sample.offerId}>
            <th scope="row">
              {sample.productTitle}
              <span className={styles.muted}> · Sample · {sample.label}</span>
            </th>
            <td>1</td>
            <td>{sample.price.amount === 0 ? 'Free' : formatPrice(sample.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
