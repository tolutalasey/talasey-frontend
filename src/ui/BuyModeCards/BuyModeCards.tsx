'use client';

import { useId } from 'react';
import { FieldError, Label, Radio, RadioGroup, type RadioGroupProps } from 'react-aria-components';
import choice from '../choice.module.css';
import { cx } from '../cx';
import fieldStyles from '../field.module.css';
import styles from './BuyModeCards.module.css';

export interface BuyMode {
  id: string;
  title: string;
  description: string;
  price?: string;
}

export interface BuyModeCardsProps extends Omit<
  RadioGroupProps,
  'className' | 'style' | 'children'
> {
  label: string;
  modes: BuyMode[];
  errorMessage?: string;
}

// How to buy: the product itself, a sample first, or a quote with an installer.
export function BuyModeCards({ label, modes, errorMessage, ...props }: BuyModeCardsProps) {
  return (
    <RadioGroup {...props} className={choice.group}>
      <Label className={fieldStyles.label}>{label}</Label>
      <div className={styles.cards}>
        {modes.map((mode) => (
          <ModeCard key={mode.id} mode={mode} />
        ))}
      </div>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </RadioGroup>
  );
}

function ModeCard({ mode }: { mode: BuyMode }) {
  const descriptionId = useId();
  return (
    <Radio
      value={mode.id}
      aria-describedby={descriptionId}
      className={cx(choice.option, styles.card)}
    >
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.text}>
        <span className={styles.title}>{mode.title}</span>
        <span id={descriptionId} className={styles.description}>
          {mode.description}
        </span>
      </span>
      {mode.price && <span className={styles.price}>{mode.price}</span>}
    </Radio>
  );
}
