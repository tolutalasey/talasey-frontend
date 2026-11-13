'use client';

import { Button, Form, TextField } from '@/ui';
import { useActionState } from 'react';
import { addToBasket } from '../actions';
import type { FormState } from '../forms';
import styles from './AddToBasket.module.css';
import { FormMessage } from './FormMessage';

export interface ColourOption {
  id: string;
  name: string;
  hex: string;
}

export interface ColourChoiceProps {
  label: string;
  required: boolean;
  options: ColourOption[];
  selected: string | null;
}

export interface BasketExtra {
  variantId: string;
  name: string;
  reason: string;
  price: string | null;
}

export interface AddToBasketProps {
  variantId: string | null;
  colours?: ColourChoiceProps | null;
  extras?: BasketExtra[];
  coverageM2?: number | null;
  wastagePercent?: number;
  initialState?: FormState;
}

// Swatches are plain radio buttons, so the colour can be chosen without JavaScript.
function ColourSwatches({
  label,
  required,
  options,
  selected,
  error,
}: ColourChoiceProps & { error?: string }) {
  return (
    <fieldset className={styles.colours} aria-describedby={error ? 'colour-error' : undefined}>
      <legend>
        {label.charAt(0).toUpperCase() + label.slice(1)}
        {required && <span className={styles.required}> (required)</span>}
      </legend>
      <input type="hidden" name="colourRequired" value={String(required)} />
      <input type="hidden" name="colourLabel" value={label.toLowerCase()} />
      {error && (
        <p id="colour-error" className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.swatches}>
        {options.map((colour) => (
          <label key={colour.id} className={styles.swatch}>
            <input
              type="radio"
              name="colourId"
              value={colour.id}
              defaultChecked={colour.id === selected}
              required={required}
            />
            <span className={styles.chip} style={{ backgroundColor: colour.hex }} aria-hidden />
            <span>{colour.name}</span>
            <input type="hidden" name={`colourName:${colour.id}`} value={colour.name} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// "Complete the job": nothing is ticked until the shopper ticks it (PRD section 17).
function Extras({ extras }: { extras: BasketExtra[] }) {
  return (
    <fieldset className={styles.extras}>
      <legend>Complete the job</legend>
      {extras.map((extra) => (
        <label key={extra.variantId} className={styles.extra}>
          <input type="checkbox" name="extra" value={extra.variantId} />
          <span>
            <span className={styles.extraName}>{extra.name}</span>
            {extra.price && <span> · {extra.price}</span>}
            <span className={styles.reason}>{extra.reason}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export function AddToBasket({
  variantId,
  colours,
  extras = [],
  coverageM2,
  wastagePercent = 0,
  initialState = {},
}: AddToBasketProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(addToBasket, initialState);

  return (
    <Form action={action} validationErrors={state.fieldErrors} className={styles.form}>
      <input type="hidden" name="variantId" value={variantId ?? ''} />
      {colours && colours.options.length > 0 && (
        <ColourSwatches {...colours} error={state.fieldErrors?.colourId} />
      )}
      <TextField
        label={coverageM2 ? 'Packs' : 'Quantity'}
        name="quantity"
        type="number"
        inputMode="numeric"
        defaultValue={state.values?.quantity ?? '1'}
        isRequired
      />
      {coverageM2 && (
        <>
          <TextField
            label="Or the area to cover (m²)"
            name="area"
            inputMode="decimal"
            defaultValue={state.values?.area ?? ''}
            description={`We round up to whole packs of ${coverageM2} m²${wastagePercent ? `, with ${wastagePercent}% extra for cuts` : ''}.`}
          />
          <input type="hidden" name="coverage" value={coverageM2} />
          <input type="hidden" name="wastage" value={wastagePercent} />
        </>
      )}
      {extras.length > 0 && <Extras extras={extras} />}
      <FormMessage message={state.message} />
      <div>
        <Button type="submit" isPending={pending} isDisabled={!variantId}>
          Add to basket
        </Button>
      </div>
    </Form>
  );
}
