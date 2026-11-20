'use client';

import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { TextField } from '@/ui/TextField/TextField';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { salesProfile, type SalesProfile } from '@/lib/sold-as';
import { addToBasket } from '../actions';
import { CoverageCalculator } from './CoverageCalculator';
import type { FormState } from '../forms';
import styles from './AddToBasket.module.css';
import { FormMessage } from './FormMessage';
import { KitExtras, type BasketExtra } from './KitExtras';

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

export interface AddToBasketProps {
  variantId: string | null;
  colours?: ColourChoiceProps | null;
  extras?: BasketExtra[];
  coverageM2?: number | null;
  packPricePence?: number | null;
  // The words and calculator for how the product is sold: packs, boards, tubs.
  profile?: SalesProfile;
  initialState?: FormState;
  // An area to open the calculator with, from a link such as the product finder's.
  startArea?: number | null;
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

// Once the page has JavaScript, adding to the bag slides the bag drawer open over the product
// instead of loading the bag page.
const noChanges = () => () => {};

function useOpenBagWhenAdded(added: number | undefined) {
  const router = useRouter();
  const ready = useSyncExternalStore(
    noChanges,
    () => true,
    () => false,
  );
  useEffect(() => {
    if (added) router.push('/basket/', { scroll: false });
  }, [added, router]);
  return ready;
}

export function AddToBasket({
  variantId,
  colours,
  extras = [],
  coverageM2,
  packPricePence = null,
  profile = salesProfile('paving'),
  initialState = {},
  startArea = null,
  bar,
}: AddToBasketProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(addToBasket, initialState);
  const [buttonArea, buttonOutOfView] = useOutOfView();
  const openBagWhenAdded = useOpenBagWhenAdded(state.added);

  return (
    <>
      <Form
        id="add-to-bag"
        action={action}
        validationErrors={state.fieldErrors}
        className={styles.form}
      >
        <input type="hidden" name="variantId" value={variantId ?? ''} />
        {openBagWhenAdded && <input type="hidden" name="js" value="1" />}
        {colours && colours.options.length > 0 && (
          <ColourSwatches {...colours} error={state.fieldErrors?.colourId} />
        )}
        {coverageM2 ? (
          <CoverageCalculator
            profile={profile}
            coverageM2={coverageM2}
            packPricePence={packPricePence}
            extras={extras}
            defaultQuantity={state.values?.quantity ?? '1'}
            defaultArea={state.values?.area ?? (startArea ? String(startArea) : '')}
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
            {extras.length > 0 && <KitExtras extras={extras} areaM2={0} mainTotalPence={null} />}
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
