'use client';

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Appearance, type Stripe } from '@stripe/stripe-js';
import { color, font, radius } from '@/tokens';
import { Button } from '@/ui';
import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { placeOrder } from '../actions';
import type { FormState } from '../forms';
import { FormMessage } from './FormMessage';

const CARD_DECLINED = 'Your payment did not go through. Check the details or try another card.';

const appearance: Appearance = {
  variables: {
    colorPrimary: color.brand600,
    colorText: color.ink,
    colorDanger: color.error,
    fontFamily: font.body,
    borderRadius: radius.control,
  },
};

const stripeByKey = new Map<string, Promise<Stripe | null>>();

function stripeFor(publishableKey: string): Promise<Stripe | null> {
  let stripe = stripeByKey.get(publishableKey);
  if (!stripe) {
    stripe = loadStripe(publishableKey);
    stripeByKey.set(publishableKey, stripe);
  }
  return stripe;
}

interface CardPaymentFormProps {
  publishableKey: string;
  clientSecret: string;
  returnUrl: string;
  total: string;
}

export function CardPaymentForm({
  publishableKey,
  clientSecret,
  returnUrl,
  total,
}: CardPaymentFormProps) {
  return (
    <Elements stripe={stripeFor(publishableKey)} options={{ clientSecret, appearance }}>
      <CardFields returnUrl={returnUrl} total={total} />
    </Elements>
  );
}

function CardFields({ returnUrl, total }: Pick<CardPaymentFormProps, 'returnUrl' | 'total'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [state, place, placing] = useActionState<FormState>(placeOrder, {});
  const [declined, setDeclined] = useState<string>();
  const [confirming, setConfirming] = useState(false);

  async function pay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setConfirming(true);
    setDeclined(undefined);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: { return_url: returnUrl },
    });
    setConfirming(false);

    if (error) {
      setDeclined(error.message ?? CARD_DECLINED);
      return;
    }
    startTransition(place);
  }

  return (
    <form onSubmit={pay}>
      <PaymentElement options={{ layout: 'tabs' }} />
      <FormMessage message={declined ?? state.message} />
      <Button type="submit" isPending={confirming || placing} isDisabled={!stripe || !elements}>
        Pay {total}
      </Button>
    </form>
  );
}
