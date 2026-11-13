'use client';

import { useActionState } from 'react';
import { Button, Checkbox, SelectField, TextAreaField, TextField } from '@/ui';
import styles from './StaffForm.module.css';
import { bespokePricing, type BespokeFormState } from '../bespoke-actions';
import {
  configFromValues,
  formulaNames,
  ROUNDING,
  SIZE_NAMES,
  type BespokeFormValues,
} from '../bespoke-form';

interface Props {
  productId: string;
  values: BespokeFormValues;
}

export function BespokePricing({ productId, values }: Props) {
  const [state, action, pending] = useActionState<BespokeFormState, FormData>(bespokePricing, {
    version: 0,
    values,
    trial: {},
    outcome: null,
    problems: [],
  });
  const { config } = configFromValues(state.values);
  const names = formulaNames(config);

  return (
    <form key={state.version} action={action} className={styles.stack}>
      <input type="hidden" name="productId" value={productId} />
      {state.outcome && (
        <p role="status" className={styles.notice}>
          {state.outcome}
        </p>
      )}
      {state.problems.length > 0 && (
        <div role="alert" className={styles.problem}>
          <strong>Fix these first:</strong>
          <ul>
            {state.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <section className={styles.panel} aria-labelledby="sizes">
        <h2 id="sizes">Sizes the customer types in</h2>
        <div className={styles.row}>
          <SelectField
            label="Unit"
            name="unit"
            defaultValue={state.values.unit}
            options={[
              { value: 'mm', label: 'Millimetres' },
              { value: 'cm', label: 'Centimetres' },
            ]}
          />
        </div>
        {SIZE_NAMES.map((name) => {
          const size = state.values.sizes[name];
          return (
            <fieldset key={name} className={styles.row}>
              <legend>
                {name}: {size.label}
              </legend>
              <Checkbox name={`size.${name}.used`} defaultSelected={size.used}>
                Ask for it
              </Checkbox>
              <TextField label="Label" name={`size.${name}.label`} defaultValue={size.label} />
              <TextField label="Smallest" name={`size.${name}.min`} defaultValue={size.min} />
              <TextField label="Largest" name={`size.${name}.max`} defaultValue={size.max} />
              <TextField label="Steps of" name={`size.${name}.step`} defaultValue={size.step} />
            </fieldset>
          );
        })}
      </section>

      <section className={`${styles.panel} ${styles.stack}`} aria-labelledby="choices">
        <h2 id="choices">Choices</h2>
        <TextAreaField
          label="One choice per line"
          name="choices"
          rows={4}
          defaultValue={state.values.choices}
          description="Like: Finish (FIN): Mild steel = 1, Corten = 2, Powder coated = 3. The short name in brackets is what the formula uses; each answer gives it a number."
        />
      </section>

      <section className={`${styles.panel} ${styles.stack}`} aria-labelledby="formula">
        <h2 id="formula">Price formula</h2>
        <TextAreaField
          label="Formula (the result is the price in pounds, inc VAT)"
          name="formula"
          rows={12}
          defaultValue={state.values.formula}
          description={`It can use ${names.join(', ') || 'the sizes and choices above'}, numbers, + - * / and brackets, min(a, b), max(a, b) and if(test, then, otherwise). Work in steps with lines like AREA = W * D / 1000000; the last line is the price.`}
        />
        <div className={styles.row}>
          <SelectField
            label="Round the price"
            name="rounding"
            defaultValue={state.values.rounding}
            options={ROUNDING}
          />
          <TextField
            label="Minimum price (£)"
            name="minPrice"
            defaultValue={state.values.minPrice}
            description="Optional"
          />
        </div>
      </section>

      <section className={`${styles.panel} ${styles.stack}`} aria-labelledby="test">
        <h2 id="test">Test calculator</h2>
        <p className={styles.muted}>
          Works out a price from what is on this page, saved or not, exactly as the shop will.
        </p>
        <div className={styles.row}>
          {Object.entries(config.dimensions).map(([name, size]) => (
            <TextField
              key={name}
              label={`${size?.label} (${config.unit})`}
              name={`trial.${name}`}
              inputMode="numeric"
              defaultValue={state.trial[name] ?? String(size?.min ?? '')}
            />
          ))}
          {config.choices.map((choice) => (
            <SelectField
              key={choice.name}
              label={choice.label}
              name={`trial.choice.${choice.name}`}
              defaultValue={state.trial[`choice.${choice.name}`] ?? choice.answers[0]?.label}
              options={choice.answers.map((answer) => answer.label)}
            />
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <Button type="submit" name="intent" value="test" variant="secondary" isDisabled={pending}>
          Work out a test price
        </Button>
        <Button type="submit" name="intent" value="save" isDisabled={pending}>
          Save pricing
        </Button>
      </div>
    </form>
  );
}
