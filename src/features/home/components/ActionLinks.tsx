import NextLink from 'next/link';
import type { HomeLink } from '../content';
import styles from './HomeSections.module.css';

export function ActionLinks({ actions }: { actions: HomeLink[] }) {
  if (actions.length === 0) return null;
  return (
    <div className={styles.actions}>
      {actions.map((action, index) => (
        <NextLink
          key={action.href}
          href={action.href}
          className={index === 0 ? 'button' : 'button-secondary'}
        >
          {action.label}
        </NextLink>
      ))}
    </div>
  );
}
