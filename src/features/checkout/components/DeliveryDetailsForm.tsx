'use client';

import type { DeliveryAddress } from '@/api-client';
import { Button } from '@/ui/Button/Button';
import { Form, FormGroup, FormRow } from '@/ui/Form/Form';
import { TextField } from '@/ui/TextField/TextField';
import { useActionState } from 'react';
import { saveDeliveryDetails } from '../actions';
import type { FormState } from '../forms';
import { FormMessage } from './FormMessage';
import styles from './Checkout.module.css';

interface Props {
  email: string | null;
  address: DeliveryAddress | null;
  initialState?: FormState;
}

export function DeliveryDetailsForm({ email, address, initialState = {} }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveDeliveryDetails,
    initialState,
  );
  const typed = state.values ?? {};

  return (
    <Form action={action} validationErrors={state.fieldErrors}>
      <FormGroup legend="Contact">
        <FormRow>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={typed.email ?? email ?? ''}
            isRequired
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            description="The driver calls ahead on the day"
            defaultValue={typed.phone ?? address?.phone}
            isRequired
          />
        </FormRow>
      </FormGroup>
      <FormGroup legend="Delivery address">
        <FormRow>
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            defaultValue={typed.firstName ?? address?.firstName}
            isRequired
          />
          <TextField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            defaultValue={typed.lastName ?? address?.lastName}
            isRequired
          />
        </FormRow>
        <TextField
          label="Address"
          name="address1"
          autoComplete="address-line1"
          defaultValue={typed.address1 ?? address?.address1}
          isRequired
        />
        <FormRow>
          <TextField
            label="Town or city"
            name="city"
            autoComplete="address-level2"
            defaultValue={typed.city ?? address?.city}
            isRequired
          />
          <TextField
            label="Postcode"
            name="postcode"
            autoComplete="postal-code"
            defaultValue={typed.postcode ?? address?.postcode}
            isRequired
          />
        </FormRow>
      </FormGroup>
      <FormMessage message={state.message} />
      <div>
        <Button type="submit" isPending={pending} className={styles.submit}>
          {address ? 'Update delivery address' : 'Show delivery prices'}
        </Button>
      </div>
    </Form>
  );
}
