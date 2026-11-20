import NextLink from 'next/link';
import { ChevronIcon, CloseIcon, MenuIcon } from '@/ui/icons';
import type { Navigation } from '../navigation';
import { CloseOnNavigate } from './CloseOnNavigate';
import styles from './SiteChrome.module.css';

const MENU_ID = 'mobile-menu';

// On phones the whole menu opens from one button, each group folding open in turn. Plain
// <details>, so it works before JavaScript loads.
export function MobileMenu({ navigation }: { navigation: Navigation }) {
  return (
    <details id={MENU_ID} className={styles.mobileMenu}>
      <summary aria-label="Menu">
        <MenuIcon className={styles.openIcon} width={22} height={22} strokeWidth={1.6} />
        <CloseIcon className={styles.closeIcon} width={22} height={22} strokeWidth={1.6} />
      </summary>
      <CloseOnNavigate id={MENU_ID} />
      <nav aria-label="Menu" className={styles.mobilePanel}>
        {navigation.menu.map((item) =>
          item.sections.length === 0 ? (
            <NextLink key={item.label} href={item.href ?? '/'} className={styles.mobileGroup}>
              {item.label}
            </NextLink>
          ) : (
            <details key={item.label} className={styles.mobileFold}>
              <summary className={styles.mobileGroup}>
                {item.label} <ChevronIcon width={16} height={16} />
              </summary>
              <ul>
                {item.sections.map((section) => (
                  <li key={section.label}>
                    {section.href ? (
                      <NextLink href={section.href}>{section.label}</NextLink>
                    ) : (
                      <span>{section.label}</span>
                    )}
                    {section.links.length > 0 && (
                      <ul>
                        {section.links.map((link) => (
                          <li key={link.href + link.label}>
                            <NextLink href={link.href}>{link.label}</NextLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ),
        )}
        <ul className={styles.mobileQuick}>
          {navigation.header.map((link) => (
            <li key={link.href + link.label}>
              <NextLink href={link.href}>{link.label}</NextLink>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
