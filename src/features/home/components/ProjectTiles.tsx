import Image from 'next/image';
import NextLink from 'next/link';
import { projectPhotos } from '../brand';
import type { ProjectTile } from '../content';
import styles from './HomeSections.module.css';

export function ProjectTiles({ tiles }: { tiles: ProjectTile[] }) {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="planning-title">
      <div className={styles.heading}>
        <p className="eyebrow">Shop by project</p>
        <h2 id="planning-title">What are you planning?</h2>
      </div>
      <ul className={styles.tiles}>
        {tiles.map((tile, index) => {
          const photo = projectPhotos[index % projectPhotos.length];
          return (
            <li key={tile.href} className={styles.tile} data-reveal="">
              {photo && (
                <div className={styles.tilePhoto}>
                  <Image
                    src={photo.src}
                    alt=""
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
                  />
                </div>
              )}
              <h3 className={styles.tileTitle}>
                <NextLink href={tile.href} className={styles.tileLink}>
                  {tile.title}
                </NextLink>
              </h3>
              <p>{tile.summary}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
