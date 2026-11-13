import type { FormState } from '../forms';
import type { PaymentView } from '../payment-view';
import { CardPaymentForm } from './CardPaymentForm';
import styles from './Checkout.module.css';
import { PlaceOrderForm } from './PlaceOrderForm';

interface Props {
  payment: PaymentView;
  total: string;
  initialState?: FormState;
}

export function PaymentStep({ payment, total, initialState }: Props) {
  if (payment.kind === 'test') {
    return (
      <>
        <p className={styles.muted}>
          <strong>Test payment.</strong> Card payments are not switched on here, so no money is
          taken. The order is placed and marked as a test payment.
        </p>
        <PlaceOrderForm total={total} initialState={initialState} />
      </>
    );
  }

  if (!payment.session.ok) {
    return (
      <p role="alert" className={styles.alert}>
        {payment.session.message}
      </p>
    );
  }

  return (
    <CardPaymentForm
      publishableKey={payment.publishableKey}
      clientSecret={payment.session.value.clientSecret}
      returnUrl={payment.returnUrl}
      total={total}
    />
  );
}
