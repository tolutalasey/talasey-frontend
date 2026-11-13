import NextLink from 'next/link';
import { SearchBox } from '@/features/content';
import styles from './NotFoundPage.module.css';

const TOP_LINKS = [
  { href: '/porcelain-paving/', label: 'Porcelain paving' },
  { href: '/garden-screens/', label: 'Garden screens' },
  { href: '/outdoor-lighting/', label: 'Outdoor lighting' },
  { href: '/fire-pits/', label: 'Fire pits' },
  { href: '/help/', label: 'Help centre' },
  { href: '/contact/', label: 'Contact us' },
];

export function NotFoundPage() {
  return (
    <section className={`container ${styles.notFound}`}>
      <h1>We can&rsquo;t find that page</h1>
      <p>It may have moved when we rebuilt the site. Search for it, or try one of these:</p>
      <SearchBox label="Search our products" />
      <ul className={styles.links}>
        <li>
          <NextLink href="/">Go to the homepage</NextLink>
        </li>
        {TOP_LINKS.map((link) => (
          <li key={link.href}>
            <NextLink href={link.href}>{link.label}</NextLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
