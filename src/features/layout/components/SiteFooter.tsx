import { cacheLife } from 'next/cache';
import Image from 'next/image';
import NextLink from 'next/link';
import { CookieSettingsButton } from '@/features/consent';
import { getNavigation, getSiteSettings } from '../loaders.server';
import styles from './SiteChrome.module.css';

async function CurrentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

const SOCIAL_NAMES: [string, string][] = [
  ['facebook.', 'Facebook'],
  ['linkedin.', 'LinkedIn'],
  ['instagram.', 'Instagram'],
  ['pinterest.', 'Pinterest'],
  ['tiktok.', 'TikTok'],
  ['youtube.', 'YouTube'],
  ['x.com', 'X'],
];

const socialName = (url: string) =>
  SOCIAL_NAMES.find(([host]) => url.includes(host))?.[1] ?? new URL(url).hostname;

const telephone = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// The columns come from "Navigation" and the contact details from "Site settings" in /content.
export async function SiteFooter() {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()]);
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
        <div className={styles.footerColumns}>
          {navigation.footer.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2>{column.heading}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <NextLink href={link.href}>{link.label}</NextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2>Contact</h2>
            {settings.address && <address>{settings.address}</address>}
            <ul>
              <li>
                <a href={telephone(settings.contactPhone)}>{settings.contactPhone}</a>
              </li>
              {settings.contactEmail && (
                <li>
                  <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                </li>
              )}
              {settings.openingHours && <li>{settings.openingHours}</li>}
            </ul>
          </div>
          {settings.socialProfiles.length > 0 && (
            <nav aria-label="Follow us">
              <h2>Follow us</h2>
              <ul>
                {settings.socialProfiles.map((url) => (
                  <li key={url}>
                    <a href={url} rel="noopener noreferrer" target="_blank">
                      {socialName(url)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <div className={styles.footerLinks}>
          <CookieSettingsButton />
        </div>
        <p className={styles.footerSmall}>
          &copy; <CurrentYear /> Talasey Ltd. Prices include VAT.
        </p>
      </div>
    </footer>
  );
}
