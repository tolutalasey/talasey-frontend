'use client';

import { TextField } from '@/ui/TextField/TextField';
import { useState } from 'react';
import { DEFAULT_WASTAGE, packsFor, WASTAGE_CHOICES } from '@/lib/coverage';
import { formatPrice } from '@/lib/format';
import type { BasketExtra } from './AddToBasket';
import styles from './CoverageCalculator.module.css';

type Mode = 'dimensions' | 'area';

interface Props {
  coverageM2: number;
  packPricePence: number | null;
  extras: BasketExtra[];
  defaultQuantity: string;
  defaultArea: string;
}

const numberFrom = (value: string) => {
  const parsed = Number(value.replace(',', '.'));
  return parsed > 0 ? parsed : 0;
};

const pounds = (pence: number) => formatPrice({ amount: pence / 100, currencyCode: 'GBP' });

const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

// Works out the packs, and how much of each "complete the job" item, for the area being paved.
// The server repeats the sums, so the same fields still work without JavaScript.
export function CoverageCalculator({
  coverageM2,
  packPricePence,
  extras,
  defaultQuantity,
  defaultArea,
}: Props) {
  const [mode, setMode] = useState<Mode>(defaultArea ? 'area' : 'dimensions');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [area, setArea] = useState(defaultArea);
  const [wastage, setWastage] = useState<number>(DEFAULT_WASTAGE);
  const [quantity, setQuantity] = useState(defaultQuantity);

  const areaM2 =
    mode === 'area'
      ? numberFrom(area)
      : Math.round(numberFrom(length) * numberFrom(width) * 100) / 100;
  const packs = packsFor(areaM2, coverageM2, wastage);
  const measured = packs > 0;
  const extraCount = (extra: BasketExtra) =>
    measured && extra.coverageM2 ? packsFor(areaM2, extra.coverageM2) : 1;

  return (
    <div className={styles.calculator}>
      <div className={styles.head}>
        <h2 className={styles.title}>How much do you need?</h2>
        <div className={styles.segment} role="group" aria-label="Measure by">
          <button
            type="button"
            aria-pressed={mode === 'dimensions'}
            onClick={() => setMode('dimensions')}
          >
            Length × width
          </button>
          <button type="button" aria-pressed={mode === 'area'} onClick={() => setMode('area')}>
            Total m²
          </button>
        </div>
      </div>

      {mode === 'dimensions' ? (
        <div className={styles.dimensions}>
          <TextField
            label="Length (m)"
            name="length"
            inputMode="decimal"
            value={length}
            onChange={setLength}
          />
          <span className={styles.times} aria-hidden="true">
            ×
          </span>
          <TextField
            label="Width (m)"
            name="width"
            inputMode="decimal"
            value={width}
            onChange={setWidth}
          />
          {areaM2 > 0 && <input type="hidden" name="area" value={areaM2} />}
        </div>
      ) : (
        <TextField
          label="Area to cover (m²)"
          name="area"
          inputMode="decimal"
          value={area}
          onChange={setArea}
        />
      )}

      <fieldset className={styles.wastage}>
        <legend>Extra for cuts</legend>
        {WASTAGE_CHOICES.map((choice) => (
          <label key={choice.percent} className={styles.choice}>
            <input
              type="radio"
              name="wastage"
              value={choice.percent}
              checked={wastage === choice.percent}
              onChange={() => setWastage(choice.percent)}
            />
            <strong>{choice.label}</strong>
            <small>{choice.detail}</small>
          </label>
        ))}
      </fieldset>
      <input type="hidden" name="coverage" value={coverageM2} />

      {measured ? (
        <p className={styles.result} aria-live="polite">
          You need <strong>{plural(packs, 'pack', 'packs')}</strong>, covering{' '}
          {(packs * coverageM2).toFixed(2)} m² for {areaM2} m² plus {wastage}% for cuts.
          {packPricePence !== null && (
            <span className={styles.total}>{pounds(packs * packPricePence)} inc. VAT</span>
          )}
        </p>
      ) : (
        <TextField
          label="Or enter packs"
          name="quantity"
          type="number"
          inputMode="numeric"
          value={quantity}
          onChange={setQuantity}
          description={`Each pack covers ${coverageM2} m².`}
          isRequired
        />
      )}

      {extras.length > 0 && (
        <fieldset className={styles.extras}>
          <legend>Complete the job</legend>
          {extras.map((extra) => {
            const count = extraCount(extra);
            return (
              <label key={extra.variantId} className={styles.extra}>
                <input type="checkbox" name="extra" value={extra.variantId} />
                <input type="hidden" name={`extraQuantity:${extra.variantId}`} value={count} />
                <span>
                  <span className={styles.extraName}>
                    {extra.name} × {count}
                  </span>
                  {extra.pricePence !== null && <span> · {pounds(count * extra.pricePence)}</span>}
                  <span className={styles.reason}>
                    {sentence(extra.reason)}
                    {measured && extra.coverageM2 ? ` About ${extra.coverageM2} m² each.` : ''}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
      )}
    </div>
  );
}
