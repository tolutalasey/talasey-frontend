import Image from 'next/image';
import type { BrandPhoto } from '../brand';
import styles from './Showcase.module.css';

interface Props {
  columns: BrandPhoto[][];
  brochuresHref: string;
}

function Column({ photos, index }: { photos: BrandPhoto[]; index: number }) {
  // Each column holds its photos twice so the loop has no seam; the copy is hidden from
  // screen readers and is not in the tab order.
  return (
    <div className={styles.column} data-column={index}>
      <ul className={styles.track}>
        {[...photos, ...photos].map((photo, position) => {
          const copy = position >= photos.length;
          return (
            <li key={position} className={styles.tile} aria-hidden={copy || undefined}>
              <Image
                src={photo.src}
                alt={copy ? '' : photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 64rem) 16vw, 45vw"
              />
              <span className={styles.label} aria-hidden="true">
                {photo.caption}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Plain CSS animation: no JavaScript, a pause switch that works without it, and still photos
// for anyone who has asked their device for less motion.
export function Showcase({ columns, brochuresHref }: Props) {
  return (
    <section className={styles.showcase} aria-labelledby="showcase-title">
      <div className={styles.intro}>
        <p className="eyebrow">From the brochures</p>
        <h2 id="showcase-title">Gardens our customers have made</h2>
        <p>
          Paving, pergolas, screens, planters, sculpture and light, from projects across the UK.
        </p>
        <div className={styles.actions}>
          <a className="button-on-dark" href={brochuresHref}>
            Browse the brochures
          </a>
          <label className={styles.pause}>
            <input type="checkbox" className={styles.pauseInput} />
            <span className={styles.pauseOn}>Pause the photos</span>
            <span className={styles.pauseOff}>Play the photos</span>
          </label>
        </div>
      </div>
      <div className={styles.wall}>
        {columns.map((photos, index) => (
          <Column key={index} photos={photos} index={index} />
        ))}
      </div>
    </section>
  );
}
