'use client';

import {
  FieldError,
  Label,
  Text,
  TextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import styles from '../field.module.css';

export interface TextAreaFieldProps extends Omit<AriaTextFieldProps, 'className' | 'style'> {
  label: string;
  description?: string;
  errorMessage?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  description,
  errorMessage,
  rows = 5,
  ...props
}: TextAreaFieldProps) {
  return (
    <AriaTextField {...props} className={styles.field}>
      <Label className={styles.label}>{label}</Label>
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <TextArea className={styles.input} rows={rows} />
      <FieldError className={styles.error}>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
