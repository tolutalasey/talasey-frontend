import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { rangePhoto } from '@/features/catalogue';
import { SearchLauncher } from '@/features/search';
import { AccountIcon, ChevronIcon } from '@/ui/icons';
import { getNavigation, getSiteSettings } from '../loaders.server';
import type { MenuItem, MenuSection } from '../navigation';
import { MenuBehaviour } from './MenuBehaviour';
import { MenuPanel, type MenuLink } from './MenuPanel';
import { MobileMenu } from './MobileMenu';
import styles from './SiteChrome.module.css';

// The range a menu link points at, like porcelain-paving for /porcelain-paving/, for its photo.
const firstSegment = (href: string | null) => href?.split(/[/#?]/).filter(Boolean)[0] ?? '';

const menuLink = (section: MenuSection): MenuLink => ({
  label: section.label,
  href: section.href ?? section.links[0]?.href ?? '/',
  image: section.photo?.src ?? rangePhoto(firstSegment(section.href)).src,
  children: section.links,
});

const telephone = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

function Menu({ item }: { item: MenuItem }) {
  if (item.sections.length === 0) {
    return (
      <NextLink href={item.href ?? '/'} className={styles.navLink}>
        {item.label}
      </NextLink>
    );
  }
  const links = item.sections.map(menuLink);
  const [first] = links;
  return (
    <details className={styles.menu} name="main-menu">
      <summary>
        {item.label} <ChevronIcon className={styles.chevron} width={12} height={12} />
      </summary>
      <MenuPanel
        title={item.label}
        verb="Explore"
        links={links}
        feature={{
          image: first?.image ?? '/images/brand/samples-mixed.jpg',
          heading: first?.label ?? item.label,
          href: first?.href ?? '/',
          action: `Explore ${(first?.label ?? item.label).toLowerCase()}`,
        }}
      />
    </details>
  );
}

// `bag` is the header's bag link with its count, passed in by the app so the header stays
// cached while the count, which reads the visitor's cookie, streams in. The menus come from
// "Navigation" in /content.
export async function SiteHeader({ bag }: { bag: ReactNode }) {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()]);
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.contact}>
          <a href={telephone(settings.contactPhone)}>{settings.contactPhone}</a>
          {settings.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          )}
        </div>
        {navigation.header.length > 0 && (
          <nav aria-label="Quick links" className={styles.quickLinks}>
            {navigation.header.map((link) => (
              <NextLink key={link.href + link.label} href={link.href}>
                {link.label}
              </NextLink>
            ))}
          </nav>
        )}
      </div>
      <div className={styles.bar}>
        <div className={styles.search}>
          <SearchLauncher />
        </div>
        <NextLink href="/" className={styles.logo}>
          <Image
            src="/images/brand/talasey-logo.png"
            alt="Talasey"
            width={900}
            height={212}
            sizes="10rem"
            priority
          />
        </NextLink>
        <div className={styles.actions}>
          <NextLink href="/account/" className={styles.action}>
            Log in / join
          </NextLink>
          <NextLink href="/account/" className={styles.iconLink} aria-label="Your account">
            <AccountIcon width={22} height={22} strokeWidth={1.6} />
          </NextLink>
          {bag}
          <MobileMenu navigation={navigation} />
        </div>
      </div>
      <nav id="main-nav" aria-label="Main" className={styles.nav}>
        <MenuBehaviour navId="main-nav" />
        <NextLink href="/samples/" className={`${styles.navLink} ${styles.samplesLink}`}>
          Free samples
        </NextLink>
        {navigation.menu.map((item) => (
          <Menu key={item.label} item={item} />
        ))}
      </nav>
    </header>
  );
}
