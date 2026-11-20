import type { SampleOffer } from '@/api-client';
import { addSampleToBasket } from '@/features/checkout';
import styles from './Samples.module.css';

// "Order a free sample" on a product page, one button per colour or finish we sample.
export function ProductSamples({ offers }: { offers: SampleOffer[] }) {
  if (offers.length === 0) return null;
  return (
    <section id="samples" className={styles.productSamples} aria-labelledby="product-samples-title">
      <h2 id="product-samples-title">Free samples</h2>
      <p className={styles.muted}>Three free with every order, sent the next working day.</p>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            <form action={addSampleToBasket}>
              <input type="hidden" name="offerId" value={offer.id} />
              <input type="hidden" name="next" value="/basket/" />
              <button type="submit" className={styles.secondary}>
                Order a free sample: {offer.label}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
