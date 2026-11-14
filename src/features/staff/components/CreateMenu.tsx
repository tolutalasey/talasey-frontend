import type { ReactNode } from 'react';
import { PlusIcon } from './icons';
import styles from './Staff.module.css';

interface Props {
  label: string;
  children: ReactNode;
}

// A button in the page header that opens a small form, without needing JavaScript.
export function CreateMenu({ label, children }: Props) {
  return (
    <details className={styles.createMenu}>
      <summary className={styles.primaryLink}>
        <PlusIcon />
        {label}
      </summary>
      <div className={styles.createPanel}>{children}</div>
    </details>
  );
}
