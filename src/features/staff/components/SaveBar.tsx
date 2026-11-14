'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Staff.module.css';

interface Props {
  children: ReactNode;
  saved?: ReactNode;
}

// Sits at the foot of an editing form, says when there are unsaved changes, and asks before
// the page is left with them.
export function SaveBar({ children, saved }: Props) {
  const bar = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = bar.current?.closest('form');
    if (!form) return;
    const change = () => setDirty(true);
    const submit = () => setDirty(false);
    form.addEventListener('input', change);
    form.addEventListener('change', change);
    form.addEventListener('submit', submit);
    return () => {
      form.removeEventListener('input', change);
      form.removeEventListener('change', change);
      form.removeEventListener('submit', submit);
    };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  return (
    <div ref={bar} className={styles.saveBar} data-dirty={dirty || undefined}>
      <p className={styles.saveState} aria-live="polite">
        <span className={styles.saveDot} aria-hidden="true" />
        {dirty ? 'Unsaved changes' : (saved ?? 'All changes saved')}
      </p>
      <div className={styles.saveActions}>{children}</div>
    </div>
  );
}
