'use client';

import type { ReactNode } from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  FieldError,
  Label,
  Text,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import fieldStyles from '../field.module.css';
import { CheckIcon } from '../icons';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'className' | 'style' | 'children'> {
  children: ReactNode;
  description?: ReactNode;
}

export function Checkbox({ children, description, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={styles.checkbox}>
      <span className={styles.box} aria-hidden="true">
        <CheckIcon className={styles.tick} width={16} height={16} />
      </span>
      <span className={styles.text}>
        {children}
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </AriaCheckbox>
  );
}

export interface CheckboxGroupProps extends Omit<
  AriaCheckboxGroupProps,
  'className' | 'style' | 'children'
> {
  label: string;
  // For when a heading next to the group already shows the same words.
  isLabelHidden?: boolean;
  description?: string;
  errorMessage?: string;
  children: ReactNode;
}

export function CheckboxGroup({
  label,
  isLabelHidden,
  description,
  errorMessage,
  children,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props} className={fieldStyles.field}>
      <Label className={isLabelHidden ? styles.hiddenLabel : fieldStyles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <div className={styles.options}>{children}</div>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}
