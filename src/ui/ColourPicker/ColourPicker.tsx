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
import { CheckIcon } from '../icons';
import styles from './ColourPicker.module.css';

export interface Colour {
  id: string;
  name: string;
  hex: string;
}

export interface ColourPickerProps extends Omit<
  RadioGroupProps,
  'className' | 'style' | 'children'
> {
  label: string;
  colours: Colour[];
  description?: string;
  errorMessage?: string;
}

// A colour is always named in words next to its swatch; the swatch alone never carries meaning.
export function ColourPicker({
  label,
  colours,
  description,
  errorMessage,
  ...props
}: ColourPickerProps) {
  return (
    <RadioGroup {...props} className={choice.group}>
      <Label className={fieldStyles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <div className={cx(choice.options, styles.options)}>
        {colours.map((colour) => (
          <Radio key={colour.id} value={colour.id} className={cx(choice.option, styles.colour)}>
            <span className={styles.swatch} style={{ background: colour.hex }} aria-hidden="true">
              <CheckIcon className={styles.tick} />
            </span>
            <span className={styles.name}>{colour.name}</span>
          </Radio>
        ))}
      </div>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </RadioGroup>
  );
}
