import Image from 'next/image';
import NextLink from 'next/link';
import { ArrowIcon } from '@/ui/icons';
import type { ProjectTile } from '../content';
import { tilePhoto } from '../tile-photo';
import styles from './HomeSections.module.css';

interface TileSectionProps {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  tiles: ProjectTile[];
}

export function TileSection({ id, eyebrow, heading, intro, tiles }: TileSectionProps) {
  if (tiles.length === 0) return null;
  const threeAcross = tiles.length % 3 === 0 && tiles.length % 4 !== 0;
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.head}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{heading}</h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
      <ul className={`${styles.grid} ${threeAcross ? styles.gridThree : ''}`}>
        {tiles.map((tile) => {
          const photo = tilePhoto(tile);
          return (
            <li key={tile.href + tile.title} className={`frame ${styles.tile}`} data-reveal="">
              <div className={styles.tilePhoto}>
                <Image
                  src={photo.src}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                />
              </div>
              <h3 className={styles.tileTitle}>
                <NextLink href={tile.href} className={styles.tileLink}>
                  {tile.title}
                </NextLink>
              </h3>
              <p className={styles.tileText}>{tile.summary}</p>
              <span className={`go ${styles.tileGo}`} aria-hidden="true">
                <ArrowIcon width={16} height={16} />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
