import { PageBreadcrumbs } from '@/features/layout';
import type { Basket } from '@/api-client';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { formatDay, formatPrice } from '@/lib/format';
import type { CheckoutView } from '../loaders.server';
import { AccessForm } from './AccessForm';
import { BasketLines } from './BasketLines';
import styles from './Checkout.module.css';
import { DeliveryDayForm } from './DeliveryDayForm';
import { DeliveryDetailsForm } from './DeliveryDetailsForm';
import { DeliveryOptionForm } from './DeliveryOptionForm';
import { PaymentStep } from './PaymentStep';

const CHECKOUT_TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Basket', path: '/basket/' },
  { name: 'Checkout', path: '/checkout/' },
];
import { Totals } from './Totals';

function Step({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={styles.step}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

function DeliveryDays({ view }: { view: CheckoutView }) {
  const { days, basket } = view;
  if (!days) return null;
  if (!days.ok)
    return (
      <p role="alert" className={styles.alert}>
        {days.message}
      </p>
    );
  return (
    <DeliveryDayForm
      chosen={basket.delivery.day?.date ?? null}
      initialState={view.feedback.day}
      days={days.value.map((day) => ({ ...day, label: formatDay(day.date) }))}
    />
  );
}

function OrderSummary({ basket }: { basket: Basket }) {
  return (
    <aside aria-labelledby="summary" className={styles.summary}>
      <h2 id="summary">Your order</h2>
      <BasketLines lines={basket.lines} />
      <Totals
        itemTotal={basket.itemTotal}
        deliveryTotal={basket.deliveryTotal}
        discount={basket.discount}
        promotions={basket.promotions}
        total={basket.total}
      />
    </aside>
  );
}

export function CheckoutFlow({ view }: { view: CheckoutView | null }) {
  if (!view) {
    return (
      <div className={`container ${styles.page}`}>
        <PageBreadcrumbs items={CHECKOUT_TRAIL} />
        <h1>Checkout</h1>
        <p>Your basket is empty.</p>
        <NextLink href="/">Carry on shopping</NextLink>
      </div>
    );
  }

  const { basket, options, payment, feedback } = view;
  const pallet = basket.delivery.shipment === 'pallet';

  return (
    <div className={`container ${styles.page} ${styles.checkout}`}>
      <PageBreadcrumbs items={CHECKOUT_TRAIL} />
      <h1>Checkout</h1>
      <div className={styles.steps}>
        <Step id="details" title="1. Delivery address">
          <DeliveryDetailsForm
            email={basket.email}
            address={basket.address}
            initialState={feedback.details}
          />
        </Step>

        {options && (
          <Step id="delivery" title="2. Delivery">
            <DeliveryOptionForm
              chosen={basket.delivery.shipment}
              initialState={feedback.delivery}
              options={options.map((option) => ({
                ...option,
                price: option.price && formatPrice(option.price),
              }))}
            />
          </Step>
        )}

        {pallet && (
          <Step id="day" title="3. Delivery day">
            <DeliveryDays view={view} />
          </Step>
        )}

        {pallet && basket.delivery.day && (
          <Step id="access" title="4. Access for the lorry">
            <AccessForm answers={basket.delivery.access} initialState={feedback.access} />
          </Step>
        )}

        {payment && (
          <Step id="payment" title={pallet ? '5. Payment' : '3. Payment'}>
            <PaymentStep
              payment={payment}
              total={formatPrice(basket.total)}
              initialState={feedback.order}
            />
          </Step>
        )}
      </div>
      <OrderSummary basket={basket} />
    </div>
  );
}
