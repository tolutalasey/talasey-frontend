import { PageBreadcrumbs } from '@/features/layout';
import NextLink from 'next/link';
import type { FormState } from '@/lib/form-feedback';
import type { BasketView } from '../loaders.server';
import { BasketLines } from './BasketLines';
import styles from './Checkout.module.css';

const BASKET_TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Basket', path: '/basket/' },
];
import { PromotionCodeForm } from './PromotionCodeForm';
import { Totals } from './Totals';

interface Props {
  view: BasketView | null;
  promotionFeedback?: FormState;
}

export function BasketSummary({ view, promotionFeedback }: Props) {
  if (!view) {
    return (
      <div className={`container ${styles.page}`}>
        <PageBreadcrumbs items={BASKET_TRAIL} />
        <h1>Your basket</h1>
        <p>Your basket is empty.</p>
        <NextLink href="/">Carry on shopping</NextLink>
      </div>
    );
  }

  const { basket, stock } = view;
  return (
    <div className={`container ${styles.page}`}>
      <h1>Your basket</h1>
      <BasketLines lines={basket.lines} stock={stock} />
      <Totals
        itemTotal={basket.itemTotal}
        deliveryTotal={null}
        discount={basket.discount}
        promotions={basket.promotions}
        total={{
          ...basket.itemTotal,
          amount: basket.itemTotal.amount - (basket.discount?.amount ?? 0),
        }}
      />
      <PromotionCodeForm code={basket.promotionCode} feedback={promotionFeedback} />
      <NextLink href="/checkout/" className={styles.next}>
        Go to checkout
      </NextLink>
    </div>
  );
}
