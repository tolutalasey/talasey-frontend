import type { BasketClient, CheckoutResult } from '@/api-client';
import type { PaymentMode } from '@/lib/payment';

export type PaymentView =
  | { kind: 'test' }
  | {
      kind: 'card';
      publishableKey: string;
      returnUrl: string;
      session: CheckoutResult<{ clientSecret: string }>;
    };

export async function loadPaymentView(
  mode: PaymentMode,
  basketId: string,
  payments: Pick<BasketClient, 'startCardPayment'>,
  returnUrl: string,
): Promise<PaymentView> {
  if (mode.kind === 'test') return { kind: 'test' };
  return {
    kind: 'card',
    publishableKey: mode.publishableKey,
    returnUrl,
    session: await payments.startCardPayment(basketId),
  };
}
