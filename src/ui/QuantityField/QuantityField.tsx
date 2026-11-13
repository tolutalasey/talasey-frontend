'use client';

import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField,
  Text,
  type NumberFieldProps,
} from 'react-aria-components';
import fieldStyles from '../field.module.css';
import { MinusIcon, PlusIcon } from '../icons';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './QuantityField.module.css';

interface BaseProps extends Omit<NumberFieldProps, 'className' | 'style' | 'children'> {
  label: string;
  description?: string;
  errorMessage?: string;
}

// Whole numbers with − and + buttons: packs, panels, bags.
export function QuantityField({
  label,
  description,
  errorMessage,
  minValue = 1,
  ...props
}: BaseProps) {
  return (
    <NumberField
      {...props}
      minValue={minValue}
      formatOptions={{ maximumFractionDigits: 0 }}
      className={fieldStyles.field}
    >
      <Label className={fieldStyles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <Group className={styles.stepper}>
        <Button slot="decrement" className={styles.step}>
          <MinusIcon />
        </Button>
        <Input className={styles.quantity} />
        <Button slot="increment" className={styles.step}>
          <PlusIcon />
        </Button>
      </Group>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </NumberField>
  );
}

export interface MeasurementFieldProps extends BaseProps {
  unit: string;
  unitLabel: string;
}

// Sizes and areas for the project builder and made-to-measure products, such as 12.5 m² or
// 600 mm. The unit is shown after the box and read out with the label.
export function MeasurementField({
  label,
  description,
  errorMessage,
  unit,
  unitLabel,
  ...props
}: MeasurementFieldProps) {
  return (
    <NumberField {...props} className={fieldStyles.field}>
      <Label className={fieldStyles.label}>
        {label} <VisuallyHidden>in {unitLabel}</VisuallyHidden>
      </Label>
      {description && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <Group className={styles.measure}>
        <Input className={styles.measureInput} />
        <span className={styles.unit} aria-hidden="true">
          {unit}
        </span>
      </Group>
      <FieldError className={fieldStyles.error}>{errorMessage}</FieldError>
    </NumberField>
  );
}
