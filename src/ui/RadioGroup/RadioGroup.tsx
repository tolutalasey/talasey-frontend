'use client';

import type { ReactNode } from 'react';
import {
  FieldError,
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  Text,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components';
import fieldStyles from '../field.module.css';
import styles from './RadioGroup.module.css';

export interface RadioGroupProps extends Omit<
  AriaRadioGroupProps,
  'className' | 'style' | 'children'
> {
  label: string;
  description?: string;
  errorMessage?: string;
  // Cards lay short options out in a grid, such as delivery days.
  layout?: 'list' | 'cards';
  children: ReactNode;
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  layout = 'list',
  children,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={fieldStyles.field}>
      <Label className={fieldStyles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <div className={layout === 'cards' ? styles.cards : styles.options}>{children}</div>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export interface RadioProps extends Omit<AriaRadioProps, 'className' | 'style' | 'children'> {
  children: ReactNode;
  description?: ReactNode;
}

export function Radio({ children, description, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={styles.radio}>
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.text}>
        {children}
        {description && <span className={styles.radioDescription}>{description}</span>}
      </span>
    </AriaRadio>
  );
}
