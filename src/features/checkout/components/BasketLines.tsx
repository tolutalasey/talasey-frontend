import type { BasketLine } from '@/api-client';
import { formatPrice } from '@/lib/format';
import styles from './Checkout.module.css';

interface Props {
  lines: BasketLine[];
  stock?: Record<string, string>;
}

export function BasketLines({ lines, stock }: Props) {
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
      </tbody>
    </table>
  );
}
