import NextLink from 'next/link';
import type { OfflineAction as Action } from '@/api-client';
import { LOCAL_HELP } from '@/features/contact';
import styles from './ProductPage.module.css';

const ACTIONS: Record<Action, { heading: string; text: string; label: string }> = {
  stockist: {
    heading: 'Buy from a stockist',
    text: "This product is sold through our stockists. Get in touch and we'll tell you where to buy it near you.",
    label: 'Find a stockist',
  },
  installer: {
    heading: 'Supplied and fitted by an installer',
    text: "This product is fitted by an approved installer. Tell us about your project and we'll put you in touch.",
    label: 'Find an installer',
  },
  showroom: {
    heading: 'See it in our showroom',
    text: "Come and see this product before you buy. Tell us when you'd like to visit and we'll confirm.",
    label: 'Book a showroom visit',
  },
};

// For a product that isn't sold online: what it offers instead of the basket.
interface Props {
  action: Action;
  phone: string;
  handle: string;
}

export function OfflineAction({ action, phone, handle }: Props) {
  const { heading, text, label } = ACTIONS[action];
  const href = `${LOCAL_HELP[action].path}?product=${encodeURIComponent(handle)}`;
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
