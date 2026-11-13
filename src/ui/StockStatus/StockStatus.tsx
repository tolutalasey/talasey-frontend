import { cx } from '../cx';
import { AlertIcon, CheckIcon, ClockIcon } from '../icons';
import styles from './StockStatus.module.css';

export type StockLevel = 'in-stock' | 'low-stock' | 'out-of-stock' | 'made-to-order';

export interface StockStatusProps {
  level: StockLevel;
  // Always words, never colour alone: "12 in stock", "Made to order, 3 to 4 weeks".
  label: string;
}

const icons = {
  'in-stock': CheckIcon,
  'low-stock': AlertIcon,
  'out-of-stock': AlertIcon,
  'made-to-order': ClockIcon,
} satisfies Record<StockLevel, unknown>;

export function StockStatus({ level, label }: StockStatusProps) {
  const Icon = icons[level];
  return (
    <p className={cx(styles.status, styles[level])}>
      <Icon className={styles.icon} />
      {label}
    </p>
  );
}
