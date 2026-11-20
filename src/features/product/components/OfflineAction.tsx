import NextLink from 'next/link';
import type { OfflineAction as Action } from '@/api-client';
import styles from './ProductPage.module.css';

// Until the stockist, installer and showroom pages are built these go to the contact page, so
// changing where they lead is one edit here.
const ACTIONS: Record<Action, { heading: string; text: string; label: string; href: string }> = {
  stockist: {
    heading: 'Buy from a stockist',
    text: "This product is sold through our stockists. Get in touch and we'll tell you where to buy it near you.",
    label: 'Find a stockist',
    href: '/contact/',
  },
  installer: {
    heading: 'Supplied and fitted by an installer',
    text: "This product is fitted by an approved installer. Tell us about your project and we'll put you in touch.",
    label: 'Find an installer',
    href: '/contact/',
  },
  showroom: {
    heading: 'See it in our showroom',
    text: "Come and see this product before you buy. Tell us when you'd like to visit and we'll confirm.",
    label: 'Book a showroom visit',
    href: '/contact/',
  },
};

// For a product that isn't sold online: what it offers instead of the basket.
export function OfflineAction({ action, phone }: { action: Action; phone: string }) {
  const { heading, text, label, href } = ACTIONS[action];
  return (
    <div className={styles.offline}>
      <h2>{heading}</h2>
      <p>{text}</p>
      <p className={styles.offlineActions}>
        <NextLink href={href} className="button">
          {label}
        </NextLink>
        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="button-secondary">
          Call {phone}
        </a>
      </p>
    </div>
  );
}
