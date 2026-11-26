import NextLink from 'next/link';
import type { GalleryPhoto } from '../views.server';
import { InspirationGrid } from './InspirationGrid';
import styles from './Content.module.css';

// On a product page: photos from the gallery that show this product in a finished garden.
export function InGardens({ items }: { items: GalleryPhoto[] }) {
  if (items.length === 0) return null;
  return (
    <section className={`container ${styles.inGardens}`} aria-labelledby="in-gardens-title">
      <div className={styles.inGardensHead}>
        <h2 id="in-gardens-title">See it in real gardens</h2>
        <NextLink href="/inspiration/">More inspiration</NextLink>
      </div>
      <InspirationGrid items={items} />
    </section>
  );
}
