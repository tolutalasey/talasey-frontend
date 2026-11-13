import { cacheLife } from 'next/cache';
import NextLink from 'next/link';
import { CookieSettingsButton } from '@/features/consent';
import styles from './SiteChrome.module.css';

async function CurrentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.bar}`}>
        <p>
          &copy; <CurrentYear /> Talasey Ltd
        </p>
        <nav aria-label="Footer" className={styles.footerLinks}>
          <NextLink href="/">Home</NextLink>
          <NextLink href="/brands/">Our brands</NextLink>
          <NextLink href="/guides/">Guides</NextLink>
          <NextLink href="/inspiration/">Inspiration</NextLink>
          <NextLink href="/help/">Help centre</NextLink>
          <NextLink href="/contact/">Contact us</NextLink>
          <CookieSettingsButton />
        </nav>
      </div>
    </footer>
  );
}
