'use client';

import { TextField } from '@/ui/TextField/TextField';
import { useState } from 'react';
import { packsFor } from '@/lib/coverage';
import { countOf, type SalesProfile } from '@/lib/sold-as';
import { formatPrice } from '@/lib/format';
import { KitExtras, type BasketExtra } from './KitExtras';
import styles from './CoverageCalculator.module.css';

type Mode = 'dimensions' | 'area';

interface Props {
  profile: SalesProfile;
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

// Works out the packs, and how much of each "complete the job" item, for the area being paved.
// The server repeats the sums, so the same fields still work without JavaScript.
export function CoverageCalculator({
  profile,
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
  const [wastage, setWastage] = useState<number>(profile.defaultWastage);
  const [quantity, setQuantity] = useState(defaultQuantity);

  const areaM2 =
    mode === 'area'
      ? numberFrom(area)
      : Math.round(numberFrom(length) * numberFrom(width) * 100) / 100;
  const packs = packsFor(areaM2, coverageM2, wastage);
  const measured = packs > 0;

  return (
    <div className={styles.calculator}>
      <div className={styles.head}>
        <h2 className={styles.title}>{profile.calculatorTitle}</h2>
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
            label={profile.dimensionLabels[0]}
            name="length"
            inputMode="decimal"
            value={length}
            onChange={setLength}
          />
          <span className={styles.times} aria-hidden="true">
            ×
          </span>
          <TextField
            label={profile.dimensionLabels[1]}
            name="width"
            inputMode="decimal"
            value={width}
            onChange={setWidth}
          />
          {areaM2 > 0 && <input type="hidden" name="area" value={areaM2} />}
        </div>
      ) : (
        <TextField
          label={profile.areaLabel}
          name="area"
          inputMode="decimal"
          value={area}
          onChange={setArea}
        />
      )}

      {profile.wastage.length > 0 ? (
        <fieldset className={styles.wastage}>
          <legend>Extra for cuts</legend>
          {profile.wastage.map((choice) => (
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
      ) : (
        <input type="hidden" name="wastage" value="0" />
      )}
      <input type="hidden" name="coverage" value={coverageM2} />

      {measured ? (
        <p className={styles.result} aria-live="polite">
          You need <strong>{countOf(packs, profile.unit)}</strong>, covering{' '}
          {(packs * coverageM2).toFixed(2)} m² for {areaM2} m²
          {wastage > 0 ? ` plus ${wastage}% for cuts` : ''}.
          {packPricePence !== null && (
            <span className={styles.total}>{pounds(packs * packPricePence)} inc. VAT</span>
          )}
        </p>
      ) : (
        <TextField
          label={`Or enter ${profile.unit.many}`}
          name="quantity"
          type="number"
          inputMode="numeric"
          value={quantity}
          onChange={setQuantity}
          description={`Each ${profile.unit.one} covers ${coverageM2} m².`}
          isRequired
        />
      )}

      {extras.length > 0 && (
        <KitExtras
          extras={extras}
          areaM2={measured ? areaM2 : 0}
          mainTotalPence={measured && packPricePence !== null ? packs * packPricePence : null}
        />
      )}
    </div>
  );
}
