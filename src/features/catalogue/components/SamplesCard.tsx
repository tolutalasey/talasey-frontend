import Image from 'next/image';
import NextLink from 'next/link';
import styles from './Listing.module.css';

// Sits in the product grid on ranges that offer samples.
export function SamplesCard() {
  return (
    <NextLink href="/samples/" className={styles.samples}>
      <span className={styles.samplesText}>
        <span className={styles.samplesEyebrow}>Not sure yet?</span>
        <span className={styles.samplesHeading}>Up to five samples, free to your door</span>
        <span className={`button-on-dark ${styles.samplesAction}`}>Choose samples</span>
      </span>
      <span className={styles.samplesPhoto}>
        <Image
          src="/images/brand/samples-mixed.jpg"
          alt=""
          width={1600}
          height={1200}
          sizes="(min-width: 64rem) 25vw, 50vw"
        />
      </span>
    </NextLink>
  );
}
