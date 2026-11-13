import NextLink from 'next/link';
import styles from './Content.module.css';

export interface CardLink {
  href: string;
  title: string;
  text?: string | null;
}

export function Cards({ items, label }: { items: CardLink[]; label: string }) {
  return (
    <ul className={styles.cards} aria-label={label}>
      {items.map((item) => (
        <li key={item.href} className={styles.card}>
          <h3 className={styles.cardTitle}>
            <NextLink href={item.href} className={styles.cardLink}>
              {item.title}
            </NextLink>
          </h3>
          {item.text && <p>{item.text}</p>}
        </li>
      ))}
    </ul>
  );
}
