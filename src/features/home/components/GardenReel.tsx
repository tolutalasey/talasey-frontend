import Image from 'next/image';
import { MotionToggle } from '@/ui/MotionToggle/MotionToggle';
import type { BrandPhoto } from '../brand';
import styles from './HomeSections.module.css';

// A row of finished gardens that slides slowly and stops on hover, on focus or with the pause
// button. The row holds the photos twice so the loop has no seam; the copy is hidden.
export function GardenReel({ photos }: { photos: BrandPhoto[] }) {
  return (
    <section className={styles.reel} aria-labelledby="reel-title" data-motion="">
      <div className={styles.headRow}>
        <div className={styles.head}>
          <p className="eyebrow">Inspiration</p>
          <h2 id="reel-title">Gardens made with Talasey</h2>
        </div>
        <MotionToggle label="Pause the gardens" />
      </div>
      <div className={styles.strip}>
        <ul className={styles.track}>
          {[...photos, ...photos].map((photo, index) => {
            const copy = index >= photos.length;
            return (
              <li
                key={index}
                className={`frame ${styles.reelCard}`}
                aria-hidden={copy || undefined}
              >
                <div className={styles.reelPhoto}>
                  <Image
                    src={photo.src}
                    alt={copy ? '' : photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="20rem"
                  />
                </div>
                <p className={styles.reelCaption}>{photo.caption}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
