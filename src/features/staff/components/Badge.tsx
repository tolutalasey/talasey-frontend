import type { ReactNode } from 'react';
import styles from './Staff.module.css';

export type BadgeTone = 'neutral' | 'good' | 'warn' | 'bad' | 'brand' | 'info';

const TONES: Record<BadgeTone, string | undefined> = {
  neutral: undefined,
  good: styles.good,
  warn: styles.warn,
  bad: styles.bad,
  brand: styles.brand,
  info: styles.info,
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={[styles.status, TONES[tone]].filter(Boolean).join(' ')}>{children}</span>;
}
