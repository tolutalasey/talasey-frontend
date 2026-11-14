import Image from 'next/image';
import type { CSSProperties } from 'react';
import NextLink from 'next/link';
import { MotionToggle } from '@/ui/MotionToggle/MotionToggle';
import type { BrandPhoto } from '../brand';
import styles from './HomeSections.module.css';

// One pergola after another, five seconds each, with a dash per photo that fills as it plays.
export function PergolaFeature({ photos }: { photos: BrandPhoto[] }) {
  return (
    <section className={styles.section} aria-labelledby="pergola-title" data-motion="">
      <div className={styles.feature} style={{ '--count': photos.length } as CSSProperties}>
        <div className={styles.cycle}>
          {photos.map((photo, index) => (
            <figure
              key={photo.src}
              className={styles.cyclePhoto}
              style={{ '--index': index } as CSSProperties}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 64rem) 58vw, 100vw" />
              <figcaption className={styles.cycleCaption}>{photo.caption}</figcaption>
            </figure>
          ))}
          <span className={styles.dashes} aria-hidden="true">
            {photos.map((photo, index) => (
              <i key={photo.src} style={{ '--index': index } as CSSProperties} />
            ))}
          </span>
          <MotionToggle label="Pause the pergolas" tone="dark" className={styles.cycleToggle} />
        </div>
        <div className={styles.featureText}>
          <p className="eyebrow">Pergolas</p>
          <h2 id="pergola-title">Defined by the detail</h2>
          <p>
            Aluminium pergolas with louvred roofs you can open for sun or close for rain, with LED
            lighting, privacy screens and heaters to suit how you use the garden.
          </p>
          <p>
            <NextLink href="/pergolas/" className="button-on-dark">
              Shop pergolas
            </NextLink>
          </p>
        </div>
      </div>
    </section>
  );
}
