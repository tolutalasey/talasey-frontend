import { cacheLife } from 'next/cache';
import Image from 'next/image';
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
      <div className={styles.footerInner}>
        <Image
          className={styles.footerLogo}
          src="/images/brand/talasey-logo-on-dark.png"
          alt="Talasey"
          width={900}
          height={212}
        />
        <p className={styles.footerLine}>
          Paving, decking and outdoor living, sold direct to UK gardens.
        </p>
        <nav aria-label="Footer" className={styles.footerLinks}>
          <NextLink href="/samples/">Free samples</NextLink>
          <NextLink href="/brands/">Our brands</NextLink>
          <NextLink href="/guides/">Guides</NextLink>
          <NextLink href="/product-finder/">Product finder</NextLink>
          <NextLink href="/inspiration/">Inspiration</NextLink>
          <NextLink href="/help/">Help centre</NextLink>
          <NextLink href="/contact/">Contact us</NextLink>
          <a href="https://talasey.co.uk/brochures/">Brochures</a>
          <CookieSettingsButton />
        </nav>
        <p className={styles.footerSmall}>
          &copy; <CurrentYear /> Talasey Ltd. Prices include VAT.
        </p>
      </div>
    </footer>
  );
}
