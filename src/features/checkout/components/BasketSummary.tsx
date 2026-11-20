import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import type { FormState } from '@/lib/form-feedback';
import { TrustStrip } from '@/ui/TrustStrip/TrustStrip';
import { trustPoints } from '@/lib/trust-points';
import { undoRemove } from '../actions';
import type { BasketView } from '../loaders.server';
import { BasketItems } from './BasketItems';
import { BasketSamples } from './BasketSamples';
import { FormMessage } from './FormMessage';
import { PromotionCodeForm } from './PromotionCodeForm';
import { Totals } from './Totals';
import styles from './Basket.module.css';

const BASKET_TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Your bag', path: '/basket/' },
];

interface Props {
  view: BasketView | null;
  promotionFeedback?: FormState;
  linesFeedback?: FormState;
}

export function RemovedNotice({ feedback }: { feedback?: FormState }) {
  if (!feedback?.notice) return null;
  const variantId = feedback.values?.variantId;
  return (
    <div className={styles.notice} role="status">
      <p>{feedback.notice}</p>
      {variantId && (
        <form action={undoRemove}>
          <input type="hidden" name="variantId" value={variantId} />
          <input type="hidden" name="quantity" value={feedback.values?.quantity ?? '1'} />
          <input type="hidden" name="title" value={feedback.values?.title ?? ''} />
          <button type="submit" className={styles.undo}>
            Undo
          </button>
        </form>
      )}
    </div>
  );
}

export function BasketSummary({ view, promotionFeedback, linesFeedback }: Props) {
  if (!view) {
    return (
      <div className={`container ${styles.page}`}>
        <PageBreadcrumbs items={BASKET_TRAIL} />
        <RemovedNotice feedback={linesFeedback} />
        <div className={styles.empty}>
          <p className="eyebrow">Basket</p>
          <h1>Your bag is empty</h1>
          <p>Have a look at our paving, or order free samples to see the colours at home first.</p>
          <p className={styles.emptyActions}>
            <NextLink href="/" className="button">
              Carry on shopping
            </NextLink>
            <NextLink href="/samples/" className="button-secondary">
              Order free samples
            </NextLink>
          </p>
        </div>
      </div>
    );
  }

  const { basket, stock, pictures } = view;
  const count = basket.lines.length + basket.samples.length;
  return (
    <>
      <div className={`container ${styles.page}`}>
        <PageBreadcrumbs items={BASKET_TRAIL} />
        <header className={styles.head}>
          <h1>Your bag</h1>
          <p className={styles.count}>
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </header>
        <div className={styles.layout}>
          <section className={styles.main} aria-label="Items">
            <RemovedNotice feedback={linesFeedback} />
            <FormMessage message={linesFeedback?.message} />
            <BasketItems lines={basket.lines} stock={stock} pictures={pictures} />
            <BasketSamples samples={basket.samples} />
            <NextLink href="/" className={styles.back}>
              Carry on shopping
            </NextLink>
          </section>
          <aside className={styles.summary} aria-labelledby="summary-title">
            <h2 id="summary-title" className={styles.summaryTitle}>
              Order summary
            </h2>
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
            <NextLink href="/checkout/" className={`button ${styles.checkout}`}>
              Go to checkout
            </NextLink>
            <PromotionCodeForm code={basket.promotionCode} feedback={promotionFeedback} />
            <p className={styles.note}>
              Heavy orders come on a pallet. You choose the delivery day at checkout.
            </p>
          </aside>
        </div>
      </div>
      <TrustStrip points={trustPoints} label="Why buy from Talasey" />
    </>
  );
}
