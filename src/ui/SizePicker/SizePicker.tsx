'use client';

import {
  FieldError,
  Label,
  Radio,
  RadioGroup,
  Text,
  type RadioGroupProps,
} from 'react-aria-components';
import choice from '../choice.module.css';
import { cx } from '../cx';
import fieldStyles from '../field.module.css';
import styles from './SizePicker.module.css';

export interface SizeOption {
  id: string;
  label: string;
  note?: string;
  isUnavailable?: boolean;
}

export interface SizePickerProps extends Omit<RadioGroupProps, 'className' | 'style' | 'children'> {
  label: string;
  options: SizeOption[];
  description?: string;
  errorMessage?: string;
}

// Also used for finishes. An unavailable option stays visible with its reason, so shoppers can see
// what exists.
export function SizePicker({
  label,
  options,
  description,
  errorMessage,
  ...props
}: SizePickerProps) {
  return (
    <RadioGroup {...props} className={choice.group}>
      <Label className={fieldStyles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <div className={choice.options}>
        {options.map((option) => (
          <Radio
            key={option.id}
            value={option.id}
            isDisabled={option.isUnavailable}
            className={cx(choice.option, styles.chip)}
          >
            <span className={styles.label}>{option.label}</span>
            {option.note && <span className={styles.note}>{option.note}</span>}
          </Radio>
        ))}
      </div>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </RadioGroup>
  );
}
