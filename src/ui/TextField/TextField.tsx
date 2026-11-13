'use client';

import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import styles from '../field.module.css';

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'className' | 'style'> {
  label: string;
  description?: string;
  errorMessage?: string;
  className?: string;
}

export function TextField({
  label,
  description,
  errorMessage,
  className,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField {...props} className={[styles.field, className].filter(Boolean).join(' ')}>
      <Label className={styles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <Input className={styles.input} />
      <FieldError className={styles.error}>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
