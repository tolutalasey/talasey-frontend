'use client';

import { useId, useState } from 'react';
import { packsFor } from '@/lib/coverage';
import { formatPrice } from '@/lib/format';
import styles from './KitExtras.module.css';

export interface ExtraChoice {
  variantId: string;
  label: string;
  pricePence: number | null;
  coverageM2: number | null;
}

// A product that goes with this one, such as a primer or jointing, with the versions on offer.
export interface BasketExtra {
  key: string;
  name: string;
  reason: string;
  choices: ExtraChoice[];
}

interface Props {
  extras: BasketExtra[];
  // The area being covered, once the shopper has measured it; quantities follow from it.
  areaM2: number;
  // What the main product comes to, so the kit total can include it.
  mainTotalPence: number | null;
}

const pounds = (pence: number) => formatPrice({ amount: pence / 100, currencyCode: 'GBP' });

const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

const countFor = (choice: ExtraChoice | undefined, areaM2: number) =>
  areaM2 > 0 && choice?.coverageM2 ? packsFor(areaM2, choice.coverageM2) : 1;

// "Complete the job": the products that go with this one, each with how many the area needs.
// Nothing is ticked until the shopper ticks it, one item at a time or the whole kit at once
// (PRD section 17). Plain checkboxes and selects, so it works before JavaScript loads too.
export function KitExtras({ extras, areaM2, mainTotalPence }: Props) {
  const id = useId();
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const [chosen, setChosen] = useState<Record<string, string>>({});

  const choiceOf = (extra: BasketExtra) =>
    extra.choices.find((choice) => choice.variantId === chosen[extra.key]) ?? extra.choices[0];
  const all = extras.length > 1 && extras.every((extra) => ticked[extra.key]);
  const tickAll = (on: boolean) =>
    setTicked(Object.fromEntries(extras.map((extra) => [extra.key, on])));

  const kitPence = extras.reduce((total, extra) => {
    const choice = choiceOf(extra);
    if (!ticked[extra.key] || choice?.pricePence == null) return total;
    return total + countFor(choice, areaM2) * choice.pricePence;
  }, mainTotalPence ?? 0);
  const anyTicked = extras.some((extra) => ticked[extra.key]);

  return (
    <fieldset className={styles.extras}>
      <legend>Complete the job</legend>
      {extras.length > 1 && (
        <label className={styles.all}>
          <input
            type="checkbox"
            checked={all}
            onChange={(event) => tickAll(event.target.checked)}
          />
          <span>
            <span className={styles.name}>Add the full kit</span>
            <span className={styles.reason}>Everything below, in the amounts your area needs.</span>
          </span>
        </label>
      )}
      {extras.map((extra) => {
        const choice = choiceOf(extra);
        if (!choice) return null;
        const count = countFor(choice, areaM2);
        const selectId = `${id}-${extra.key}`;
        return (
          <div
            key={extra.key}
            className={styles.extra}
            data-ticked={ticked[extra.key] || undefined}
          >
            <label className={styles.tick}>
              <input
                type="checkbox"
                name="extra"
                value={choice.variantId}
                checked={Boolean(ticked[extra.key])}
                onChange={(event) =>
                  setTicked((current) => ({ ...current, [extra.key]: event.target.checked }))
                }
              />
              <span>
                <span className={styles.name}>
                  {extra.name} × {count}
                </span>
                {choice.pricePence !== null && <span> · {pounds(count * choice.pricePence)}</span>}
                <span className={styles.reason}>
                  {sentence(extra.reason)}
                  {areaM2 > 0 && choice.coverageM2
                    ? ` ${count} for ${areaM2} m², at about ${choice.coverageM2} m² each.`
                    : ''}
                </span>
              </span>
            </label>
            <input type="hidden" name={`extraQuantity:${choice.variantId}`} value={count} />
            {extra.choices.length > 1 && (
              <div className={styles.choice}>
                <label htmlFor={selectId}>Choose one</label>
                <select
                  id={selectId}
                  value={choice.variantId}
                  onChange={(event) =>
                    setChosen((current) => ({ ...current, [extra.key]: event.target.value }))
                  }
                >
                  {extra.choices.map((option) => (
                    <option key={option.variantId} value={option.variantId}>
                      {option.label}
                      {option.pricePence !== null ? ` (${pounds(option.pricePence)})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      })}
      {anyTicked && mainTotalPence !== null && (
        <p className={styles.total} aria-live="polite">
          Kit total <strong>{pounds(kitPence)}</strong> inc. VAT
        </p>
      )}
    </fieldset>
  );
}
