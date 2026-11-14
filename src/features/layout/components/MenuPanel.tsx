import Image from 'next/image';
import NextLink from 'next/link';
import { ArrowIcon } from '@/ui/icons';
import styles from './SiteChrome.module.css';

interface MenuPanelProps {
  title: string;
  links: { label: string; href: string }[];
  feature: { image: string; heading: string; href: string; action: string };
}

// Drops below the header as a white frame: the links in columns, and one card to the side.
export function MenuPanel({ title, links, feature }: MenuPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelInner}>
        <div>
          <p className="eyebrow">{title}</p>
          <ul className={styles.menuList}>
            {links.map((link) => (
              <li key={link.href}>
                <NextLink href={link.href}>
                  {link.label}
                  <ArrowIcon width={14} height={14} />
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
        <NextLink href={feature.href} className={styles.feature}>
          <span className={styles.featurePhoto}>
            <Image src={feature.image} alt="" width={1600} height={1000} sizes="22rem" />
          </span>
          <strong className={styles.featureHeading}>{feature.heading}</strong>
          <span className={styles.featureAction}>{feature.action} →</span>
        </NextLink>
      </div>
    </div>
  );
}
