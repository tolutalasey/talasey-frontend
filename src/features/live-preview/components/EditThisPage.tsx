'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './EditThisPage.module.css';

const HINT = 'talasey_staff_here=1';

interface Link {
  path: string;
  href: string;
  label: string;
}

// A button on the shop for signed-in staff, straight to the editor for the page they are on.
// Shoppers never have the hint cookie, so nothing is asked for them.
export function EditThisPage() {
  const pathname = usePathname();
  const [link, setLink] = useState<Link | null>(null);

  useEffect(() => {
    const framed = window.self !== window.top;
    if (framed || !document.cookie.includes(HINT) || pathname.startsWith('/preview/')) return;
    const controller = new AbortController();
    fetch(`/api/staff/edit-link?path=${encodeURIComponent(pathname)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.status === 200 ? response.json() : null))
      .then((found: Omit<Link, 'path'> | null) => found && setLink({ ...found, path: pathname }))
      .catch(() => undefined);
    return () => controller.abort();
  }, [pathname]);

  if (!link || link.path !== pathname) return null;
  return (
    <div className={styles.bar}>
      <NextLink href={link.href} className={styles.edit}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 20h4L19 9l-4-4L4 16z" />
          <path d="m13.5 6.5 4 4" />
        </svg>
        {link.label}
      </NextLink>
      <NextLink href="/admin/" className={styles.admin}>
        Admin
      </NextLink>
    </div>
  );
}
