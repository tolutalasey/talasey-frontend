import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { ChevronLeftIcon } from './icons';
import styles from './Staff.module.css';

interface Props {
  title: ReactNode;
  back?: { href: string; label: string };
  eyebrow?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, back, eyebrow, description, meta, actions }: Props) {
  return (
    <header className={styles.pageHeader}>
      {back && (
        <NextLink href={back.href} className={styles.back}>
          <ChevronLeftIcon />
          {back.label}
        </NextLink>
      )}
      <div className={styles.headRow}>
        <div className={styles.headText}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.pageTitle}>{title}</h1>
          {description && <p className={styles.pageLead}>{description}</p>}
          {meta && <div className={styles.meta}>{meta}</div>}
        </div>
        {actions && <div className={styles.headActions}>{actions}</div>}
      </div>
    </header>
  );
}
