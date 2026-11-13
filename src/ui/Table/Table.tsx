import type { ReactNode } from 'react';
import styles from './Table.module.css';

export interface TableProps {
  caption: ReactNode;
  children: ReactNode;
}

// Use th scope="row" for the first cell of each row so screen readers read rows with their name.
export function Table({ caption, children }: TableProps) {
  return (
    <div className={styles.scroller}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}
