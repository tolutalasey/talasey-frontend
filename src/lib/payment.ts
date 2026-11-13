import type { Env } from './env';

export type PaymentMode = { kind: 'card'; publishableKey: string } | { kind: 'test' };

// Card payments switch on with the Stripe publishable key; the backend holds the secret key. Without
// it, checkout takes a clearly labelled test payment and no money moves.
export function paymentMode(env: Pick<Env, 'STRIPE_PUBLISHABLE_KEY'>): PaymentMode {
  return env.STRIPE_PUBLISHABLE_KEY
    ? { kind: 'card', publishableKey: env.STRIPE_PUBLISHABLE_KEY }
    : { kind: 'test' };
}
