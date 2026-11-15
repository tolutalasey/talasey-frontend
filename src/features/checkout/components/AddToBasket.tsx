'use client';

import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { TextField } from '@/ui/TextField/TextField';
import { useActionState, useEffect, useRef, useState } from 'react';
import { addToBasket } from '../actions';
import { CoverageCalculator } from './CoverageCalculator';
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
  pricePence: number | null;
  coverageM2: number | null;
}

export interface AddToBasketProps {
  variantId: string | null;
  colours?: ColourChoiceProps | null;
  extras?: BasketExtra[];
  coverageM2?: number | null;
  packPricePence?: number | null;
  initialState?: FormState;
  // On phones, a bar at the bottom of the screen with this name and price and its own button.
  bar?: { title: string; price: string };
}

// Hidden while the form's own button is on screen, so the two never show at once.
function useOutOfView() {
  const target = useRef<HTMLDivElement>(null);
  const [out, setOut] = useState(true);
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOut(!entry?.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [target, out] as const;
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
  packPricePence = null,
  initialState = {},
  bar,
}: AddToBasketProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(addToBasket, initialState);
  const [buttonArea, buttonOutOfView] = useOutOfView();

  return (
    <>
      <Form
        id="add-to-bag"
        action={action}
        validationErrors={state.fieldErrors}
        className={styles.form}
      >
        <input type="hidden" name="variantId" value={variantId ?? ''} />
        {colours && colours.options.length > 0 && (
          <ColourSwatches {...colours} error={state.fieldErrors?.colourId} />
        )}
        {coverageM2 ? (
          <CoverageCalculator
            coverageM2={coverageM2}
            packPricePence={packPricePence}
            extras={extras}
            defaultQuantity={state.values?.quantity ?? '1'}
            defaultArea={state.values?.area ?? ''}
          />
        ) : (
          <>
            <div className={styles.amount}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                inputMode="numeric"
                defaultValue={state.values?.quantity ?? '1'}
                isRequired
              />
            </div>
            {extras.length > 0 && <Extras extras={extras} />}
          </>
        )}
        <FormMessage message={state.message} />
        <div ref={buttonArea}>
          <Button type="submit" isPending={pending} isDisabled={!variantId} className={styles.add}>
            Add to bag
          </Button>
        </div>
      </Form>
      {bar && variantId && (
        <div className={styles.bar} data-buy-bar="" data-hidden={!buttonOutOfView || undefined}>
          <p className={styles.barText}>
            <span className={styles.barTitle}>{bar.title}</span>
            <strong>{bar.price}</strong>
          </p>
          <button type="submit" form="add-to-bag" className={styles.barButton} disabled={pending}>
            Add to bag
          </button>
        </div>
      )}
    </>
  );
}
