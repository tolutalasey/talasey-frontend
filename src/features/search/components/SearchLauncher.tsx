'use client';

import { useRef, useState, type ComponentType } from 'react';
import type { HeaderSearch as HeaderSearchType } from './HeaderSearch';
import styles from './SearchLauncher.module.css';

type HeaderSearchComponent = typeof HeaderSearchType;

// The header search starts as a plain GET form, which is all a visitor without JavaScript needs.
// The suggestions box and its code load only once someone reaches for the field, which keeps
// them out of every page's first load (PRD section 11 budgets).
export function SearchLauncher() {
  const input = useRef<HTMLInputElement>(null);
  const [Search, setSearch] = useState<ComponentType<Parameters<HeaderSearchComponent>[0]> | null>(
    null,
  );

  const [typed, setTyped] = useState('');
  const [hadFocus, setHadFocus] = useState(false);

  // Hovering only fetches the code early. Focus moves to the new box only if the visitor was
  // already in the field, so a passing mouse never takes the keyboard away from them.
  const load = () => {
    if (Search) return;
    void import('./HeaderSearch').then((module) => {
      setTyped(input.current?.value ?? '');
      setHadFocus(document.activeElement === input.current);
      setSearch(() => module.HeaderSearch);
    });
  };

  if (Search) return <Search defaultQuery={typed} autoFocus={hadFocus} />;

  return (
    <form role="search" action="/search/" method="get" className={styles.search}>
      <div className={styles.box}>
        <input
          ref={input}
          type="search"
          name="q"
          aria-label="Search products"
          placeholder="Paving, decking, planters…"
          autoComplete="off"
          className={styles.input}
          onFocus={load}
          onPointerEnter={load}
        />
        <button type="submit" className={styles.submit} aria-label="Search">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
