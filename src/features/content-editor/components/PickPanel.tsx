'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePick } from './PickContext';
import styles from './PickPanel.module.css';

const SHOWN = 'data-shown';

// Only the field picked on the page is shown, with the row it belongs to when it is in a list.
function revealPicked(root: HTMLElement, path: string | null) {
  root.querySelectorAll(`[${SHOWN}]`).forEach((element) => element.removeAttribute(SHOWN));
  if (!path) return;
  const field = root.querySelector<HTMLElement>(`[data-field="${CSS.escape(path)}"]`);
  if (!field) return;
  const shown = field.closest<HTMLElement>('[data-row]') ?? field;
  shown.setAttribute(SHOWN, '');
  shown.parentElement?.querySelector(':scope > [data-extra]')?.setAttribute(SHOWN, '');
  for (let parent = shown.parentElement?.closest('[data-field]'); parent;) {
    parent.setAttribute(SHOWN, '');
    parent = parent.parentElement?.closest('[data-field]');
  }
  root.scrollIntoView({ block: 'nearest' });
  field
    .querySelector<HTMLElement>('input:not([type=hidden]), textarea, select')
    ?.focus({ preventScroll: true });
}

export function PickPanel({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pick = usePick();
  const path = pick?.picked?.path ?? null;

  useEffect(() => {
    if (root.current) revealPicked(root.current, path);
  }, [path]);

  if (!pick) return children;
  const { picked, missed, showAll, setShowAll } = pick;

  return (
    <div ref={root} className={styles.panel} data-picking={showAll ? undefined : ''}>
      <div className={styles.head} aria-live="polite">
        {showAll ? (
          <p>Every part of this page.</p>
        ) : picked ? (
          <p>
            Changing <strong>{picked.label}</strong>
          </p>
        ) : missed ? (
          <p>
            That part is not written here. It comes from the products, the menu or the site
            settings. Click a heading, some text or a photo.
          </p>
        ) : (
          <p>Click any heading, text or photo on the page to change it.</p>
        )}
        <div className={styles.actions}>
          {picked && !showAll && (
            <button type="button" className={styles.done} onClick={() => pick.pick(null)}>
              Done
            </button>
          )}
          <button type="button" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Pick on the page' : 'Show every part'}
          </button>
        </div>
      </div>
      <div className={styles.fields}>{children}</div>
    </div>
  );
}
