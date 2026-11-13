import { PageBreadcrumbs } from '@/features/layout';
import type { PlacedOrder } from '@/api-client';
import { formatDay } from '@/lib/format';
import { BasketLines } from './BasketLines';
import styles from './Checkout.module.css';

const vehicleLabels = {
  articulated: 'Articulated lorry',
  rigid: 'Rigid lorry',
  small: 'Small van only',
} as const;

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

export function OrderConfirmation({ order }: { order: PlacedOrder }) {
  const { day, access, name } = order.delivery;

  return (
    <div className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Order confirmation', path: `/order/${order.id}/` },
        ]}
      />
      <h1>Thank you, your order is placed</h1>
      <p>
        Your order number is <strong>{order.displayId}</strong>. Quote it if you need to call us
        about your order.
      </p>

      <section aria-labelledby="delivery" className={styles.step}>
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

      <BasketLines lines={order.lines} />
    </div>
  );
}
