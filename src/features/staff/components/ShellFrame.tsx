'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { CloseIcon } from '@/ui/icons';
import { MenuIcon } from './icons';
import styles from './Shell.module.css';

interface Props {
  sidebar: ReactNode;
  bar: ReactNode;
  children: ReactNode;
}

// On small screens the sidebar slides in over the page and closes when a link is followed.
export function ShellFrame({ sidebar, bar, children }: Props) {
  const pathname = usePathname();
  // Remembers the page the menu was opened on, so following a link closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpenOn(null);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return (
    <>
      <aside id="staff-sidebar" className={styles.side} data-open={open || undefined}>
        <button
          type="button"
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="Close the menu"
        >
          <CloseIcon />
        </button>
        {sidebar}
      </aside>
      {open && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close the menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className={styles.body}>
        <header className={styles.bar}>
          <button
            type="button"
            className={styles.menu}
            aria-expanded={open}
            aria-controls="staff-sidebar"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
            <span className={styles.hidden}>Menu</span>
          </button>
          {bar}
        </header>
        {children}
      </div>
    </>
  );
}
