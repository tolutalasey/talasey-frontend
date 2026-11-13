'use client';

import type { DeliveryOption, Shipment } from '@/api-client';
import { Button, Form, Radio, RadioGroup } from '@/ui';
import { useActionState } from 'react';
import { chooseDelivery } from '../actions';
import type { FormState } from '../forms';
import { FormMessage } from './FormMessage';

interface Props {
  options: (Omit<DeliveryOption, 'price'> & { price: string | null })[];
  chosen: Shipment | null;
  initialState?: FormState;
}

export function DeliveryOptionForm({ options, chosen, initialState = {} }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    chooseDelivery,
    initialState,
  );
  const current = options.find((option) => option.shipment === chosen);

  return (
    <Form action={action} validationErrors={state.fieldErrors}>
      <RadioGroup label="Delivery" name="optionId" defaultValue={current?.id} isRequired>
        {options.map((option) => (
          <Radio
            key={option.id}
            value={option.id}
            isDisabled={!option.price}
            description={option.price ?? option.problem}
          >
            {option.name}
          </Radio>
        ))}
      </RadioGroup>
      <FormMessage message={state.message} />
      <div>
        <Button type="submit" isPending={pending}>
          Use this delivery
        </Button>
      </div>
    </Form>
  );
}
