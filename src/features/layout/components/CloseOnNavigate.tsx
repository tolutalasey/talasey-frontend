'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Closes the <details> with this id, and any open inside it, when the page changes, so a
// chosen link isn't left hidden under the menu.
export function CloseOnNavigate({ id }: { id: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document
      .getElementById(id)
      ?.querySelectorAll<HTMLDetailsElement>('details[open]')
      .forEach((menu) => (menu.open = false));
    const root = document.getElementById(id);
    if (root instanceof HTMLDetailsElement) root.open = false;
  }, [id, pathname]);
  return null;
}
