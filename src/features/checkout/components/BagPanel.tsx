import NextLink from 'next/link';
import type { FormState } from '@/lib/form-feedback';
import { formatPrice } from '@/lib/format';
import { LockIcon } from '@/ui/icons';
import type { BasketView } from '../loaders.server';
import { BasketItems } from './BasketItems';
import { RemovedNotice } from './BasketSummary';
import { FormMessage } from './FormMessage';
import styles from './BagPanel.module.css';

interface Props {
  view: BasketView | null;
  feedback?: FormState;
}

export function BagPanelLoading() {
  return (
    <div className={styles.loading} role="status">
      <span className={styles.skeleton} />
      <span className={styles.skeleton} />
      <span className={styles.visuallyHidden}>Loading your bag</span>
    </div>
  );
}

// What the bag drawer shows: the lines, the running total and the way to checkout.
export function BagPanel({ view, feedback }: Props) {
  if (!view) {
    return (
      <div className={styles.empty}>
        <RemovedNotice feedback={feedback} />
        <p className={styles.emptyTitle}>Your bag is empty</p>
        <p className={styles.muted}>
          Have a look at our paving, or order free samples to see the colours at home first.
        </p>
        <NextLink href="/samples/" className="button-secondary">
          Order free samples
        </NextLink>
      </div>
    );
  }

  const { basket, stock, pictures } = view;
  const subtotal = {
    ...basket.itemTotal,
    amount: basket.itemTotal.amount - (basket.discount?.amount ?? 0),
  };
  const count = basket.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className={styles.panel}>
      <div className={styles.lines}>
        <RemovedNotice feedback={feedback} />
        <FormMessage message={feedback?.message} />
        <BasketItems lines={basket.lines} stock={stock} pictures={pictures} />
      </div>
      <footer className={styles.foot}>
        <dl className={styles.total}>
          <dt>
            Subtotal{' '}
            <span>
              ({count} {count === 1 ? 'item' : 'items'})
            </span>
          </dt>
          <dd>{formatPrice(subtotal)}</dd>
        </dl>
        {basket.discount && (
          <p className={styles.saving}>You save {formatPrice(basket.discount)}</p>
        )}
        <p className={styles.muted}>Delivery is worked out at checkout. Prices include VAT.</p>
        <NextLink href="/checkout/" className={`button ${styles.checkout}`}>
          <LockIcon width={18} height={18} />
          Go to checkout
        </NextLink>
        {/* A full page load, so the whole bag page opens rather than this drawer again. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/basket/" className={styles.full}>
          View bag and add a discount code
        </a>
      </footer>
    </div>
  );
}
