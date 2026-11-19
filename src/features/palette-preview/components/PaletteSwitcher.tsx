'use client';

import { useSyncExternalStore } from 'react';
import { CURRENT_PALETTE, PALETTE_STORAGE_KEY, type Palette } from '../palettes';
import styles from './PalettePreview.module.css';

const root = () => document.documentElement;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ['data-palette'] });
  return () => observer.disconnect();
}

const activePalette = () => root().dataset.palette ?? '';

function choose(id: string) {
  try {
    if (id) sessionStorage.setItem(PALETTE_STORAGE_KEY, id);
    else sessionStorage.removeItem(PALETTE_STORAGE_KEY);
  } catch {
    // Storage can be blocked; the choice then lasts until the next page.
  }
  if (id) root().dataset.palette = id;
  else delete root().dataset.palette;
}

// A bar to flick between the colour options on any page, shown only while one is being previewed.
export function PaletteSwitcher({ palettes }: { palettes: Palette[] }) {
  const active = useSyncExternalStore(subscribe, activePalette, () => '');
  if (!active) return null;
  return (
    <div className={styles.switcher} role="group" aria-label="Colour preview">
      <span className={styles.switcherLabel}>Colours</span>
      {[{ ...CURRENT_PALETTE, id: '' }, ...palettes].map((palette) => (
        <button
          key={palette.id || 'current'}
          type="button"
          aria-pressed={active === palette.id}
          onClick={() => choose(palette.id)}
        >
          <span
            className={styles.dot}
            style={{ background: palette.colours['--color-brand600'] }}
            aria-hidden="true"
          />
          {palette.name}
        </button>
      ))}
    </div>
  );
}
