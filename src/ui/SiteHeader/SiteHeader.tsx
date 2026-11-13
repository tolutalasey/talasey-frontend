import type { ReactNode } from 'react';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './SiteHeader.module.css';

export interface SiteHeaderProps {
  logo: ReactNode;
  homeHref?: string;
  basketHref: string;
  basketCount: number;
  topBar?: ReactNode;
  navigation?: ReactNode;
  search?: ReactNode;
}

export function SiteHeader({
  logo,
  homeHref = '/',
  basketHref,
  basketCount,
  topBar,
  navigation,
  search,
}: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      {topBar && <div className={styles.topBar}>{topBar}</div>}
      <div className={styles.bar}>
        <a className={styles.logo} href={homeHref}>
          {logo} <VisuallyHidden>home</VisuallyHidden>
        </a>
        {search && <div className={styles.search}>{search}</div>}
        <a className={styles.basket} href={basketHref}>
          Basket{' '}
          {basketCount > 0 && (
            <span className={styles.count}>
              {basketCount} <VisuallyHidden>{basketCount === 1 ? 'item' : 'items'}</VisuallyHidden>
            </span>
          )}
        </a>
      </div>
      {navigation && <div className={styles.navigation}>{navigation}</div>}
    </header>
  );
}
