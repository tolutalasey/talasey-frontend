import type { Metadata } from 'next';
import NextLink from 'next/link';
import { pageMetadata } from '@/lib/seo';
import styles from './thanks.module.css';

// Reads the reference from the address, so it renders per request.
export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: 'Your free samples are on the way | Talasey',
  description: 'Thank you. We send samples the next working day and email you when they leave.',
  path: '/samples/thanks/',
  noindex: true,
});

type Props = PageProps<'/samples/thanks'>;

export default async function SamplesThanks({ searchParams }: Props) {
  const raw = (await searchParams).request;
  const reference = typeof raw === 'string' && /^S\d+$/.test(raw) ? raw : null;
  return (
    <div className={styles.page}>
      <div className={`frame ${styles.card}`}>
        <span className={styles.tick} aria-hidden="true">
          ✓
        </span>
        <p className="eyebrow">Free samples</p>
        <h1>Thank you, your samples are on the way</h1>
        {reference && <p>Your reference is {reference}.</p>}
        <p className={styles.muted}>
          We post samples the next working day and email you when they leave. Have a look at them in
          your garden in daylight, wet and dry.
        </p>
        <p className={styles.actions}>
          <NextLink href="/guides/" className="button">
            Read our guides
          </NextLink>
          <NextLink href="/samples/" className="chip">
            Choose more samples
          </NextLink>
        </p>
      </div>
    </div>
  );
}
