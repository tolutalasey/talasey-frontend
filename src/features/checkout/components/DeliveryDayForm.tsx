'use client';

import { Button, Form, Radio, RadioGroup } from '@/ui';
import { useActionState } from 'react';
import { holdDeliveryDay } from '../actions';
import type { FormState } from '../forms';
import { FormMessage } from './FormMessage';

interface Props {
  days: { date: string; label: string; remaining: number }[];
  chosen: string | null;
  initialState?: FormState;
}

export function DeliveryDayForm({ days, chosen, initialState = {} }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    holdDeliveryDay,
    initialState,
  );

  return (
    <Form action={action} validationErrors={state.fieldErrors}>
      <RadioGroup
        label="Delivery day"
        name="date"
        description="We hold the day for you while you finish your order."
        defaultValue={chosen ?? undefined}
        isRequired
      >
        {days.map((day) => (
          <Radio
            key={day.date}
            value={day.date}
            isDisabled={day.remaining === 0}
            description={day.remaining === 0 ? 'Fully booked' : `${day.remaining} left`}
          >
            {day.label}
          </Radio>
        ))}
      </RadioGroup>
      <FormMessage message={state.message} />
      {chosen && (
        <p role="status">
          Held for you: {days.find((day) => day.date === chosen)?.label ?? chosen}. Finish your
          order within 15 minutes to keep it.
        </p>
      )}
      <div>
        <Button type="submit" isPending={pending}>
          Hold this day
        </Button>
      </div>
    </Form>
  );
}
