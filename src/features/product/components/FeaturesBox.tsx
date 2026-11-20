import NextLink from 'next/link';
import styles from './ProductPage.module.css';

// The "Features and Benefits" panel from the current site, with its two standing notes.
export function FeaturesBox({ features }: { features: string[] }) {
  return (
    <section className={styles.featuresBox} aria-labelledby="features-title">
      <h2 id="features-title">Features and benefits</h2>
      {features.length > 0 && (
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
      <p>
        We recommend you visit the <NextLink href="/knowledge-hub/">Knowledge Hub</NextLink> for
        further information, advice and FAQs.
      </p>
      <p>
        Colours may vary from those shown on this website. All sizes and coverages stated are
        estimates and may have minor variations. It’s also important to allow for cuts and
        positioning during installation. For more details, please refer to our{' '}
        <NextLink href="/know-before-you-buy/">Know Before You Buy</NextLink> page.
      </p>
    </section>
  );
}
