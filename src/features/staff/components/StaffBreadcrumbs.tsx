'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from './icons';
import styles from './Shell.module.css';

interface Crumb {
  href: string;
  label: string;
}

const NAMED: Record<string, string> = {
  pricing: 'Pricing',
  preview: 'Preview',
  account: 'Your account',
};

const looksLikeId = (segment: string) => /^[0-9a-f-]{16,}$/i.test(segment);

// Where you are, worked out from the address and the sidebar's own labels.
export function StaffBreadcrumbs({ links }: { links: Crumb[] }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const labelFor = (href: string) => links.find((link) => link.href === href)?.label;

  const trail: Crumb[] = [];
  segments.forEach((segment, index) => {
    if (segment === 'edit') return;
    const href = `/${segments.slice(0, index + 1).join('/')}/`;
    const label =
      labelFor(href) ??
      NAMED[segment] ??
      (looksLikeId(segment) ? (segments[index - 1] === 'edit' ? 'Edit' : 'Details') : segment);
    trail.push({ href, label });
  });

  return (
    <nav aria-label="You are here" className={styles.crumbs}>
      <ol>
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.href}>
              {index > 0 && <ChevronRightIcon className={styles.crumbSep} />}
              {last ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <NextLink href={crumb.href}>{crumb.label}</NextLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
