import type { Metadata } from 'next';
import NextLink from 'next/link';
import styles from '../contact.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Thank you for your message | Talasey' },
  robots: { index: false, follow: true },
};

export default function ContactThanks() {
  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.intro}>
        <p className="eyebrow">Contact us</p>
        <h1>Thank you, we&rsquo;ve got your message</h1>
        <p>We&rsquo;ll reply by email within one working day.</p>
        <p>
          <NextLink href="/" className="button-on-dark">
            Back to the homepage
          </NextLink>
        </p>
      </div>
    </section>
  );
}
