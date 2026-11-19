import type { CSSProperties } from 'react';
import { CURRENT_PALETTE, PALETTE_PARAM, PALETTES, type Palette } from '../palettes';
import styles from './PalettePreview.module.css';

const PAGES = [
  { label: 'Homepage', path: '/' },
  { label: 'Porcelain paving', path: '/porcelain-paving/' },
  { label: 'Composite decking', path: '/composite-decking/' },
  { label: 'Free samples', path: '/samples/' },
];

const SWATCHES = [
  '--color-brand950',
  '--color-brand600',
  '--color-brand50',
  '--color-stone',
  '--color-stone50',
] as const;

function PaletteCard({ palette }: { palette: Palette }) {
  const query = `?${PALETTE_PARAM}=${palette === CURRENT_PALETTE ? 'off' : palette.id}`;
  return (
    <article className={styles.card} style={palette.colours as CSSProperties}>
      <div className={styles.swatches} aria-hidden="true">
        {SWATCHES.map((token) => (
          <span key={token} style={{ background: palette.colours[token] }} />
        ))}
      </div>
      <h2>{palette.name}</h2>
      <p>{palette.summary}</p>
      <div className={styles.sample} aria-hidden="true">
        <strong>Paving, decking and outdoor living</strong>
        <span className={styles.sampleButton}>Order free samples</span>
      </div>
      {/* Plain links, so the colours are set before each page paints. */}
      <ul className={styles.links} aria-label={`See ${palette.name} on`}>
        {PAGES.map((page) => (
          <li key={page.path}>
            <a href={`${page.path}${query}`}>{page.label}</a>
          </li>
        ))}
      </ul>
    </article>
  );
}

// The colour options side by side, each with links to see it across real pages.
export function PaletteChoices() {
  return (
    <div className={styles.page}>
      <h1>Colour options</h1>
      <p className={styles.intro}>
        Each option keeps the light, bright look and changes the brand colours. Open a page in one
        of them and the colours stay while you browse; the bar at the bottom of the page switches
        between them.
      </p>
      <div className={styles.grid}>
        {[CURRENT_PALETTE, ...PALETTES].map((palette) => (
          <PaletteCard key={palette.id} palette={palette} />
        ))}
      </div>
    </div>
  );
}
