'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function StaffNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const home = href.split('/').filter(Boolean).length === 1;
  const current = home ? pathname === href : pathname.startsWith(href);
  return (
    <NextLink href={href} aria-current={current ? 'page' : undefined}>
      {children}
    </NextLink>
  );
}
