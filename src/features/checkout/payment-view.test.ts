import { describe, expect, it, vi } from 'vitest';
import { loadPaymentView } from './payment-view';

const returnUrl = 'http://localhost:3000/checkout/paid/';

describe('loadPaymentView', () => {
  it('keeps the test payment button when Stripe is not set up', async () => {
    const startCardPayment = vi.fn();
    const view = await loadPaymentView({ kind: 'test' }, 'cart_1', { startCardPayment }, returnUrl);
    expect(view).toEqual({ kind: 'test' });
    expect(startCardPayment).not.toHaveBeenCalled();
  });

  it('opens a card payment for the basket when Stripe is set up', async () => {
    const startCardPayment = vi.fn(async () => ({
      ok: true as const,
      value: { clientSecret: 'pi_1_secret_1' },
    }));
    const view = await loadPaymentView(
      { kind: 'card', publishableKey: 'pk_test_1' },
      'cart_1',
      { startCardPayment },
      returnUrl,
    );
    expect(startCardPayment).toHaveBeenCalledWith('cart_1');
    expect(view).toEqual({
      kind: 'card',
      publishableKey: 'pk_test_1',
      returnUrl,
      session: { ok: true, value: { clientSecret: 'pi_1_secret_1' } },
    });
  });

  it('passes on why a card payment could not start', async () => {
    const view = await loadPaymentView(
      { kind: 'card', publishableKey: 'pk_test_1' },
      'cart_1',
      { startCardPayment: async () => ({ ok: false, message: 'Stripe is down' }) },
      returnUrl,
    );
    expect(view).toMatchObject({ session: { ok: false, message: 'Stripe is down' } });
  });
});
