import styles from './StickyBasketBar.module.css';

export interface StickyBasketBarProps {
  summary: string;
  total: string;
  actionLabel: string;
  href: string;
}

// Shown on phones only, fixed to the bottom of the screen. Leave room for it with
// padding-bottom on the page so it never covers the footer.
export function StickyBasketBar({ summary, total, actionLabel, href }: StickyBasketBarProps) {
  return (
    <section aria-label="Basket" className={styles.bar}>
      <p className={styles.summary}>
        {summary}
        <strong className={styles.total}>{total}</strong>
      </p>
      <a className={styles.action} href={href}>
        {actionLabel}
      </a>
    </section>
  );
}
