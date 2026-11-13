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
      <h1>Thank you, we&rsquo;ve got your message</h1>
      <p className={styles.intro}>We&rsquo;ll reply by email.</p>
      <p>
        <NextLink href="/">Back to the homepage</NextLink>
      </p>
    </section>
  );
}
