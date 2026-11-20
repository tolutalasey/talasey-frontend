'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import type { Measurements } from '@/api-client';
import { formatPrice } from '@/lib/format';
import { addMadeToMeasureToBasket, quoteMadeToMeasure } from '../actions';
import styles from './MadeToMeasure.module.css';

interface Props {
  handle: string;
  variantId: string;
  measurements: Measurements;
  // "Made to order, dispatched in 3–4 weeks" from the product's lead time.
  leadTime: string;
}

type Quote =
  | { state: 'idle' }
  | { state: 'pricing' }
  | { state: 'priced'; pence: number }
  | {
      state: 'problem';
      message: string;
    };

const QUOTE_DELAY = 350;

const pounds = (pence: number) => formatPrice({ amount: pence / 100, currencyCode: 'GBP' });

function problemFor(
  value: string,
  { label, min, max, step }: Measurements['dimensions'][number],
  unit: string,
) {
  if (!value) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return `Enter the ${label.toLowerCase()} as a number`;
  if (number < min || number > max) return `${label} must be between ${min} and ${max} ${unit}`;
  if (Math.abs(((number - min) / step) % 1) > 1e-9) {
    return step === 1 ? `Enter a whole number of ${unit}` : `Use steps of ${step} ${unit}`;
  }
  return null;
}

// Soil to fill a box-shaped planter, from its outside measurements. Shapes with more than width,
// depth and height (an L-shape) are left out rather than guessed.
function litres(sizes: Record<string, number>, unit: Measurements['unit']) {
  const keys = Object.keys(sizes).sort().join('');
  if (keys !== 'DHW') return null;
  const toCm = unit === 'mm' ? 0.1 : 1;
  return Math.round(((sizes.W ?? 0) * toCm * (sizes.D ?? 0) * toCm * (sizes.H ?? 0) * toCm) / 1000);
}

// Template 2: the shopper picks the choices and types the sizes; the price comes from the server
// once everything is valid, and again when the item goes into the basket.
export function MadeToMeasure({ handle, variantId, measurements, leadTime }: Props) {
  const router = useRouter();
  const { unit, dimensions, choices } = measurements;
  const [values, setValues] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [quote, setQuote] = useState<Quote>({ state: 'idle' });
  const [message, setMessage] = useState<string | null>(null);
  const [adding, startAdding] = useTransition();

  const problems = Object.fromEntries(
    dimensions.map((dimension) => [
      dimension.key,
      problemFor(values[dimension.key] ?? '', dimension, unit),
    ]),
  );
  const sizes = Object.fromEntries(
    dimensions.flatMap((dimension) => {
      const value = values[dimension.key];
      return value && !problems[dimension.key] ? [[dimension.key, Number(value)]] : [];
    }),
  );
  const ready =
    Object.keys(sizes).length === dimensions.length &&
    choices.every((choice) => picked[choice.name]);
  const request = JSON.stringify({ sizes, picked });

  useEffect(() => {
    if (!ready) return;
    let current = true;
    const timer = window.setTimeout(async () => {
      setQuote({ state: 'pricing' });
      const result = await quoteMadeToMeasure(handle, { dimensions: sizes, choices: picked });
      if (!current) return;
      setQuote(
        result.ok
          ? { state: 'priced', pence: result.pricePence }
          : { state: 'problem', message: result.message },
      );
    }, QUOTE_DELAY);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
    // The request string stands for sizes and picked, which change identity every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, ready, request]);

  const add = () =>
    startAdding(async () => {
      setMessage(null);
      const result = await addMadeToMeasureToBasket(variantId, {
        dimensions: sizes,
        choices: picked,
      });
      if (result.added) router.push('/basket/', { scroll: false });
      else setMessage(result.message ?? 'We could not add that to your bag. Please try again.');
    });

  const fill = litres(sizes, unit);
  const missing = !choices.every((choice) => picked[choice.name])
    ? `Choose ${choices.find((choice) => !picked[choice.name])?.label.toLowerCase()}`
    : 'Enter your sizes';

  return (
    <div className={styles.form}>
      {choices.map((choice) => (
        <fieldset key={choice.name} className={styles.choice}>
          <legend>
            {choice.label}
            {picked[choice.name] && <span>: {picked[choice.name]}</span>}
          </legend>
          <div className={styles.chips}>
            {choice.answers.map((answer) => (
              <label key={answer} className={styles.chip}>
                <input
                  type="radio"
                  name={choice.name}
                  value={answer}
                  checked={picked[choice.name] === answer}
                  onChange={() => setPicked((now) => ({ ...now, [choice.name]: answer }))}
                />
                {answer}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className={styles.choice}>
        <legend>Your sizes, outside measurements in {unit}</legend>
        <div className={styles.sizes}>
          {dimensions.map((dimension) => {
            const id = `size-${dimension.key}`;
            const problem = problems[dimension.key];
            return (
              <div key={dimension.key} className={styles.size}>
                <label htmlFor={id}>
                  {dimension.label}
                  <small>
                    {dimension.min}–{dimension.max} {unit}
                  </small>
                </label>
                <span className={styles.input}>
                  <input
                    id={id}
                    inputMode="numeric"
                    value={values[dimension.key] ?? ''}
                    aria-invalid={problem ? true : undefined}
                    aria-describedby={problem ? `${id}-problem` : undefined}
                    onChange={(event) =>
                      setValues((now) => ({ ...now, [dimension.key]: event.target.value.trim() }))
                    }
                  />
                  <span aria-hidden="true">{unit}</span>
                </span>
                {problem && (
                  <small id={`${id}-problem`} className={styles.problem}>
                    {problem}
                  </small>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.price} aria-live="polite">
        {quote.state === 'priced' && ready ? (
          <>
            <strong>{pounds(quote.pence)}</strong> <span>inc. VAT</span>
            <p>
              {dimensions.map((dimension) => sizes[dimension.key]).join(' × ')} {unit}
              {fill !== null && ` · holds about ${fill} litres of soil`}
            </p>
          </>
        ) : quote.state === 'problem' && ready ? (
          <p className={styles.problem}>{quote.message}</p>
        ) : quote.state === 'pricing' && ready ? (
          <p>Working out your price…</p>
        ) : (
          <p>Your price appears here once your choices and sizes are in.</p>
        )}
      </div>

      <p className={styles.lead}>{leadTime}</p>
      <button
        type="button"
        className="button"
        disabled={!ready || quote.state !== 'priced' || adding}
        onClick={add}
      >
        {adding ? 'Adding…' : ready ? 'Add to bag' : missing}
      </button>
      {message && (
        <p className={styles.problem} role="alert">
          {message}
        </p>
      )}
      <p className={styles.note}>
        Made to your measurements, so please check them carefully. Made-to-measure items have
        different returns terms; see our <NextLink href="/terms-and-conditions/">terms</NextLink>.
      </p>
    </div>
  );
}
