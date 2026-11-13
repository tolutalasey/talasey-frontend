import type { ReactNode } from 'react';
import { PageBreadcrumbs } from '@/features/layout';
import type { BreadcrumbItem } from '@/lib/seo';
import { Cards, type CardLink } from './Cards';
import styles from './Content.module.css';

interface IndexPageProps {
  h1: string;
  intro: string;
  breadcrumbs: BreadcrumbItem[];
  items: CardLink[];
  children?: ReactNode;
}

export function IndexPage({ h1, intro, breadcrumbs, items, children }: IndexPageProps) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs items={breadcrumbs} />
      <header className={styles.header}>
        <h1>{h1}</h1>
        <p className={styles.intro}>{intro}</p>
      </header>
      {children}
      <Cards items={items} label={h1} />
    </article>
  );
}
