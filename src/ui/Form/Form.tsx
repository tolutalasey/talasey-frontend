'use client';

import { Form as AriaForm, type FormProps as AriaFormProps } from 'react-aria-components';
import styles from './Form.module.css';

export interface FormProps extends Omit<AriaFormProps, 'className' | 'style'> {
  className?: string;
}

export function Form({ className, ...props }: FormProps) {
  return <AriaForm {...props} className={[styles.form, className].filter(Boolean).join(' ')} />;
}
