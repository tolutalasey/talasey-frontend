'use client';

import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'style'> {
  variant?: ButtonVariant;
  className?: string;
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
    />
  );
}
