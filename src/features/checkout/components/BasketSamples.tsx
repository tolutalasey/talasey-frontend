import NextLink from 'next/link';
import type { BasketSample } from '@/api-client';
import { formatPrice } from '@/lib/format';
import { productPath } from '@/lib/urls/keyword-map';
import { VisuallyHidden } from '@/ui/VisuallyHidden/VisuallyHidden';
import { removeSampleFromBasket } from '../actions';
import styles from './BasketItems.module.css';

// Samples sit apart from the products in the bag, each marked free or £5.
export function BasketSamples({ samples }: { samples: BasketSample[] }) {
  if (samples.length === 0) return null;
  return (
    <section aria-labelledby="bag-samples-title" className={styles.samples}>
      <h2 id="bag-samples-title" className={styles.samplesTitle}>
        Samples
      </h2>
      <p className={styles.samplesNote}>
        The first three are free, then £5 each. Samples on their own cost £5 to post; with other
        products they come in the same delivery.
      </p>
      <ul className={styles.items} aria-label="Samples in your bag">
        {samples.map((sample) => (
          <li key={sample.offerId} className={`${styles.item} ${styles.sample}`}>
            <div className={styles.about}>
              <h3 className={styles.title}>
                <NextLink href={productPath(sample.productHandle)}>{sample.productTitle}</NextLink>
              </h3>
              <p className={styles.details}>Sample · {sample.label}</p>
            </div>
            <div className={styles.controls}>
              <form action={removeSampleFromBasket}>
                <input type="hidden" name="offerId" value={sample.offerId} />
                <button type="submit" className={styles.remove}>
                  Remove
                  <VisuallyHidden>
                    {' '}
                    sample of {sample.productTitle}, {sample.label}
                  </VisuallyHidden>
                </button>
              </form>
            </div>
            <p className={styles.total}>
              {sample.price.amount === 0 ? 'Free' : formatPrice(sample.price)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
