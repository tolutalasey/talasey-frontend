'use client';

import NextLink from 'next/link';
import styles from './ErrorPage.module.css';

export function ErrorPage({ onRetry }: { onRetry: () => void }) {
  return (
    <section className={`container ${styles.page}`}>
      <h1>Something went wrong on our side</h1>
      <p>
        This page didn&rsquo;t load properly. Nothing in your bag has been lost. Try again, or carry
        on from one of these:
      </p>
      <p>
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      </p>
      <ul className={styles.links}>
        <li>
          <NextLink href="/">Go to the homepage</NextLink>
        </li>
        <li>
          <NextLink href="/basket/">Your bag</NextLink>
        </li>
        <li>
          <NextLink href="/contact/">Contact us</NextLink>
        </li>
      </ul>
    </section>
  );
}
