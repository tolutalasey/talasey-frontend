'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import { ArrowIcon } from '@/ui/icons';
import styles from './SiteChrome.module.css';

interface MenuLink {
  label: string;
  href: string;
  image: string;
}

interface Feature {
  image: string;
  heading: string;
  href: string;
  action: string;
}

interface MenuPanelProps {
  title: string;
  links: MenuLink[];
  feature: Feature;
  // The word before a link's name on the card, such as Shop or Plan.
  verb: string;
}

// Drops below the header as a white frame: the links in columns, and one card to the side. The
// card shows the link under the pointer, or in focus, and goes back to its own offer after.
export function MenuPanel({ title, links, feature, verb }: MenuPanelProps) {
  const [active, setActive] = useState<MenuLink | null>(null);
  const shown: Feature = active
    ? {
        image: active.image,
        heading: active.label,
        href: active.href,
        action: `${verb} ${active.label.toLowerCase()}`,
      }
    : feature;

  return (
    <div className={styles.panel}>
      <div className={styles.panelInner} onPointerLeave={() => setActive(null)}>
        <div>
          <p className="eyebrow">{title}</p>
          <ul className={styles.menuList}>
            {links.map((link) => (
              <li key={link.href}>
                <NextLink
                  href={link.href}
                  onPointerEnter={() => setActive(link)}
                  onFocus={() => setActive(link)}
                >
                  {link.label}
                  <ArrowIcon width={14} height={14} />
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
        <NextLink href={shown.href} className={styles.feature}>
          <span className={styles.featurePhoto}>
            {[feature, ...links].map((item) => (
              <Image
                key={item.image + ('href' in item ? item.href : '')}
                src={item.image}
                alt=""
                fill
                sizes="22rem"
                data-shown={item.image === shown.image || undefined}
              />
            ))}
          </span>
          <strong className={styles.featureHeading}>{shown.heading}</strong>
          <span className={styles.featureAction}>{shown.action} →</span>
        </NextLink>
      </div>
    </div>
  );
}
