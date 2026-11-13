import { describe, expect, it } from 'vitest';
import { parseEnv } from './env';
import { paymentMode } from './payment';

describe('paymentMode', () => {
  it('takes the labelled test payment when no Stripe key is set', () => {
    expect(paymentMode(parseEnv({}))).toEqual({ kind: 'test' });
  });

  it('takes cards through Stripe once the publishable key is set', () => {
    expect(paymentMode(parseEnv({ STRIPE_PUBLISHABLE_KEY: 'pk_test_123' }))).toEqual({
      kind: 'card',
      publishableKey: 'pk_test_123',
    });
  });

  it('ignores a blank key', () => {
    expect(paymentMode(parseEnv({ STRIPE_PUBLISHABLE_KEY: '' })).kind).toBe('test');
  });

  it('rejects a secret key in the publishable key setting', () => {
    expect(() => parseEnv({ STRIPE_PUBLISHABLE_KEY: 'sk_test_123' })).toThrow(
      /STRIPE_PUBLISHABLE_KEY/,
    );
  });
});
