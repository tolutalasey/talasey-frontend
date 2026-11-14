import NextLink from 'next/link';
import { BagIcon } from '@/ui/icons';
import styles from './SiteChrome.module.css';

// The bag in the header. The count arrives once the basket has loaded; until then, or with an
// empty bag, the icon shows on its own.
export function BagLink({ count }: { count: number }) {
  const label = count > 0 ? `Your bag, ${count} ${count === 1 ? 'item' : 'items'}` : 'Your bag';
  return (
    <NextLink href="/basket/" className={styles.bag} aria-label={label}>
      <BagIcon width={22} height={22} strokeWidth={1.6} />
      <span className={styles.bagWord} aria-hidden="true">
        Bag
      </span>
      {count > 0 && (
        <span className={styles.count} aria-hidden="true">
          {count}
        </span>
      )}
    </NextLink>
  );
}
