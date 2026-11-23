import { cx } from '@/ui/cx';
import styles from './Assistant.module.css';

// A plum disc with a sand leaf: Tala's face in the chat.
export function TalaAvatar({
  size = 'small',
  online,
}: {
  size?: 'small' | 'large';
  online?: boolean;
}) {
  return (
    <span className={cx(styles.avatar, size === 'large' && styles.avatarLarge)} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="60%" height="60%" fill="none">
        <path
          d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"
          fill="var(--color-sand)"
          stroke="var(--color-sand)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M5 19 13 11"
          stroke="var(--color-brand600)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {online && <span className={styles.online} />}
    </span>
  );
}
