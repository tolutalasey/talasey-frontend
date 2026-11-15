'use client';

import type { ReactNode } from 'react';
import { Form as AriaForm, type FormProps as AriaFormProps } from 'react-aria-components';
import styles from './Form.module.css';

export interface FormProps extends Omit<AriaFormProps, 'className' | 'style'> {
  className?: string;
}

export function Form({ className, ...props }: FormProps) {
  return <AriaForm {...props} className={[styles.form, className].filter(Boolean).join(' ')} />;
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function FormGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {children}
    </fieldset>
  );
}
