import NextLink from 'next/link';
import type { ReactNode } from 'react';
import type { Basket } from '@/api-client';
import { PageBreadcrumbs } from '@/features/layout';
import { formatDay, formatPrice } from '@/lib/format';
import { hasFeedback } from '@/lib/form-feedback';
import { trustPoints } from '@/lib/trust-points';
import { CheckIcon, LockIcon, TruckIcon } from '@/ui/icons';
import type { CheckoutView } from '../loaders.server';
import { AccessForm } from './AccessForm';
import { BasketLines } from './BasketLines';
import { DeliveryDayForm } from './DeliveryDayForm';
import { DeliveryDetailsForm } from './DeliveryDetailsForm';
import { DeliveryOptionForm } from './DeliveryOptionForm';
import { PaymentStep } from './PaymentStep';
import { Totals } from './Totals';
import styles from './Checkout.module.css';

const CHECKOUT_TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Your bag', path: '/basket/' },
  { name: 'Checkout', path: '/checkout/' },
];

interface StepProps {
  id: string;
  number: number;
  title: string;
  // What was chosen, once the step is done. A done step folds away behind it.
  done?: string | null;
  // A done step opens again when its form came back with something to fix.
  open?: boolean;
  children: ReactNode;
}

function Step({ id, number, title, done, open, children }: StepProps) {
  const heading = (
    <span className={styles.stepHead}>
      <span className={styles.number} aria-hidden="true">
        {done ? <CheckIcon /> : number}
      </span>
      <span className={styles.stepTitle}>
        <VisuallyNumbered number={number} />
        {title}
      </span>
    </span>
  );
  if (!done) {
    return (
      <section aria-labelledby={id} className={`${styles.step} ${styles.current}`}>
        <h2 id={id}>{heading}</h2>
        <div className={styles.stepBody}>{children}</div>
      </section>
    );
  }
  return (
    <section aria-labelledby={id} className={styles.step}>
      <details className={styles.done} open={open}>
        <summary>
          <h2 id={id}>{heading}</h2>
          <span className={styles.chosen}>{done}</span>
          <span className={styles.change}>Change</span>
        </summary>
        <div className={styles.stepBody}>{children}</div>
      </details>
    </section>
  );
}

const VisuallyNumbered = ({ number }: { number: number }) => (
  <span className={styles.hiddenNumber}>Step {number}: </span>
);

interface Stage {
  title: string;
  done: boolean;
}

// The steps across the top, so shoppers see how far they have to go.
function Progress({ stages }: { stages: Stage[] }) {
  const current = stages.findIndex((stage) => !stage.done);
  return (
    <ol className={styles.progress} aria-label="Checkout steps">
      {stages.map((stage, index) => (
        <li
          key={stage.title}
          data-state={stage.done ? 'done' : index === current ? 'current' : 'next'}
          aria-current={index === current ? 'step' : undefined}
        >
          <span className={styles.progressDot} aria-hidden="true">
            {stage.done ? <CheckIcon /> : index + 1}
          </span>
          <span className={styles.progressName}>{stage.title}</span>
        </li>
      ))}
    </ol>
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
      <div className={styles.summaryHead}>
        <h2 id="summary">Your order</h2>
        <NextLink href="/basket/">Edit bag</NextLink>
      </div>
      <BasketLines lines={basket.lines} />
      <Totals
        itemTotal={basket.itemTotal}
        deliveryTotal={basket.deliveryTotal}
        discount={basket.discount}
        promotions={basket.promotions}
        total={basket.total}
      />
      <ul className={styles.reassure}>
        <li>
          <LockIcon />
          Card payments are taken securely by Stripe.
        </li>
        <li>
          <TruckIcon />
          {trustPoints[0].title}. {trustPoints[0].text}
        </li>
      </ul>
    </aside>
  );
}

const addressLine = (basket: Basket) =>
  basket.address &&
  [
    `${basket.address.firstName} ${basket.address.lastName}`,
    basket.address.address1,
    basket.address.city,
    basket.address.postcode,
  ].join(', ');

export function CheckoutFlow({ view }: { view: CheckoutView | null }) {
  if (!view) {
    return (
      <div className={`container ${styles.page}`}>
        <PageBreadcrumbs items={CHECKOUT_TRAIL} />
        <h1>Checkout</h1>
        <p>Your bag is empty.</p>
        <NextLink href="/" className="button">
          Carry on shopping
        </NextLink>
      </div>
    );
  }

  const { basket, options, payment, feedback } = view;
  const { delivery } = basket;
  const pallet = delivery.shipment === 'pallet';
  const option = options?.find((choice) => choice.shipment === delivery.shipment);
  const deliveryDone =
    option && (option.price ? `${option.name}, ${formatPrice(option.price)}` : option.name);
  const dayDone = pallet && delivery.day ? `Held for you: ${formatDay(delivery.day.date)}` : null;
  const accessDone = pallet && delivery.access ? 'Answered' : null;

  const stages: Stage[] = [
    { title: 'Address', done: !!basket.address },
    { title: 'Delivery', done: !!deliveryDone && !!basket.address },
    ...(pallet ? [{ title: 'Day', done: !!dayDone }] : []),
    ...(pallet && delivery.day ? [{ title: 'Access', done: !!accessDone }] : []),
    { title: 'Payment', done: false },
  ];

  return (
    <div className={`container ${styles.page} ${styles.checkout}`}>
      <PageBreadcrumbs items={CHECKOUT_TRAIL} />
      <header className={styles.top}>
        <h1>Checkout</h1>
        <Progress stages={stages} />
      </header>
      <ol className={styles.steps}>
        <li>
          <Step
            id="details"
            number={1}
            title="Delivery address"
            done={addressLine(basket)}
            open={hasFeedback(feedback.details ?? {})}
          >
            <DeliveryDetailsForm
              email={basket.email}
              address={basket.address}
              initialState={feedback.details}
            />
          </Step>
        </li>

        {options && (
          <li>
            <Step
              id="delivery"
              number={2}
              title="Delivery"
              done={deliveryDone}
              open={hasFeedback(feedback.delivery ?? {})}
            >
              <DeliveryOptionForm
                chosen={delivery.shipment}
                initialState={feedback.delivery}
                options={options.map((choice) => ({
                  ...choice,
                  price: choice.price && formatPrice(choice.price),
                }))}
              />
            </Step>
          </li>
        )}

        {pallet && (
          <li>
            <Step
              id="day"
              number={3}
              title="Delivery day"
              done={dayDone}
              open={hasFeedback(feedback.day ?? {})}
            >
              <DeliveryDays view={view} />
            </Step>
          </li>
        )}

        {pallet && delivery.day && (
          <li>
            <Step
              id="access"
              number={4}
              title="Access for the lorry"
              done={accessDone}
              open={hasFeedback(feedback.access ?? {})}
            >
              <AccessForm answers={delivery.access} initialState={feedback.access} />
            </Step>
          </li>
        )}

        {payment && (
          <li>
            <Step id="payment" number={pallet ? 5 : 3} title="Payment">
              <PaymentStep
                payment={payment}
                total={formatPrice(basket.total)}
                initialState={feedback.order}
              />
            </Step>
          </li>
        )}
      </ol>
      <OrderSummary basket={basket} />
    </div>
  );
}
