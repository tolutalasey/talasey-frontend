import Image from 'next/image';
import NextLink from 'next/link';
import styles from './SiteChrome.module.css';

interface MenuPanelProps {
  title: string;
  links: { label: string; href: string }[];
  feature: { image: string; heading: string; text: string; href: string; action: string };
}

export function MenuPanel({ title, links, feature }: MenuPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={`container ${styles.panelInner}`}>
        <div>
          <p className="eyebrow">{title}</p>
          <ul className={styles.menuList}>
            {links.map((link) => (
              <li key={link.href}>
                <NextLink href={link.href}>{link.label}</NextLink>
              </li>
            ))}
          </ul>
        </div>
        <NextLink href={feature.href} className={styles.feature}>
          <Image src={feature.image} alt="" width={900} height={900} sizes="20rem" />
          <span className={styles.featureText}>
            <strong>{feature.heading}</strong>
            <span>{feature.text}</span>
            <span className={styles.featureAction}>{feature.action}</span>
          </span>
        </NextLink>
      </div>
    </div>
  );
}
