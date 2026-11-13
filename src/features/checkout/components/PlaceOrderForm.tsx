'use client';

import { Button } from '@/ui';
import { useActionState } from 'react';
import { placeOrder } from '../actions';
import type { FormState } from '../forms';
import { FormMessage } from './FormMessage';

interface Props {
  total: string;
  initialState?: FormState;
}

export function PlaceOrderForm({ total, initialState = {} }: Props) {
  const [state, action, pending] = useActionState<FormState>(placeOrder, initialState);

  return (
    <form action={action}>
      <FormMessage message={state.message} />
      <Button type="submit" isPending={pending}>
        Place order, {total}
      </Button>
    </form>
  );
}
