import NextLink from 'next/link';
import type { ProjectTile } from '../content';
import styles from './HomeSections.module.css';

export function ProjectTiles({ tiles }: { tiles: ProjectTile[] }) {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="planning-title">
      <h2 id="planning-title">What are you planning?</h2>
      <ul className={styles.tiles}>
        {tiles.map((tile) => (
          <li key={tile.href} className={styles.tile}>
            <h3 className={styles.tileTitle}>
              <NextLink href={tile.href} className={styles.tileLink}>
                {tile.title}
              </NextLink>
            </h3>
            <p>{tile.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
