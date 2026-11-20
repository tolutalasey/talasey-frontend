import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import type { PlacedOrder } from '@/api-client';
import { formatDay } from '@/lib/format';
import { CheckIcon } from '@/ui/icons';
import { BasketLines } from './BasketLines';
import styles from './Checkout.module.css';
import { Totals } from './Totals';

const vehicleLabels = {
  articulated: 'Articulated lorry',
  rigid: 'Rigid lorry',
  small: 'Small van only',
} as const;

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

export function OrderConfirmation({ order }: { order: PlacedOrder }) {
  const { day, access, name } = order.delivery;
  const steps = [
    { title: 'Order placed', text: 'Today', done: true },
    {
      title: day ? 'Day booked' : 'Being packed',
      text: day ? formatDay(day.date) : 'We email when it leaves',
      done: Boolean(day),
    },
    { title: 'We call ahead', text: 'Before we come', done: false },
    { title: 'Delivered', text: name ?? 'To your door', done: false },
  ];

  return (
    <div className={styles.confirm}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Order confirmation', path: `/order/${order.id}/` },
        ]}
      />
      <div className={styles.confirmTop}>
        <section className={`frame ${styles.confirmMain}`} aria-labelledby="placed-title">
          <span className={styles.tick} aria-hidden="true">
            <CheckIcon width={30} height={30} strokeWidth={2.4} />
          </span>
          <p className="eyebrow">Order {order.displayId}</p>
          <h1 id="placed-title">Thank you, your order is placed</h1>
          <p className={styles.confirmText}>
            Your order number is <strong>{order.displayId}</strong>. Quote it if you need to call us
            about your order.
          </p>
          <ol className={styles.timeline} aria-label="What happens next">
            {steps.map((step) => (
              <li key={step.title} data-done={step.done || undefined}>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
          <p className={styles.confirmActions}>
            <NextLink href="/" className="button">
              Back to the shop
            </NextLink>
            <NextLink href="/guides/" className="chip">
              Read our guides
            </NextLink>
          </p>
        </section>

        <section aria-labelledby="delivery" className={styles.confirmAside}>
          <h2 id="delivery">Delivery</h2>
          <dl className={styles.facts}>
            {name && (
              <>
                <dt>Method</dt>
                <dd>{name}</dd>
              </>
            )}
            {day && (
              <>
                <dt>Day</dt>
                <dd>
                  {formatDay(day.date)}
                  {day.status === 'needs-rebooking' && ' (we will call you to confirm the day)'}
                </dd>
              </>
            )}
            {access && (
              <>
                <dt>Largest vehicle</dt>
                <dd>{vehicleLabels[access.vehicleAccess]}</dd>
                <dt>Hard standing</dt>
                <dd>{yesNo(access.hardStanding)}</dd>
                <dt>Kerbside drop OK</dt>
                <dd>{yesNo(access.kerbsideOk)}</dd>
              </>
            )}
          </dl>
        </section>
      </div>

      <section className={`frame ${styles.confirmItems}`} aria-labelledby="items-title">
        <h2 id="items-title">Your order</h2>
        <BasketLines lines={order.lines} samples={order.samples} />
        <Totals
          itemTotal={order.itemTotal}
          deliveryTotal={order.deliveryTotal}
          discount={order.discount}
          promotions={order.promotions}
          total={order.total}
        />
      </section>
    </div>
  );
}
