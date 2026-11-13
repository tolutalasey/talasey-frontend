import type { ElementType, ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps {
  children: ReactNode;
  as?: ElementType;
}

export function VisuallyHidden({ children, as: Element = 'span' }: VisuallyHiddenProps) {
  return <Element className={styles.hidden}>{children}</Element>;
}
