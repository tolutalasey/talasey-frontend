import NextLink from 'next/link';
import type { SeasonalBlock as Block } from '../content';
import styles from './HomeSections.module.css';

export function SeasonalBlock({ block }: { block: Block }) {
  return (
    <section className={styles.section} aria-labelledby="season-title">
      <div className={`frame ${styles.season}`}>
        <div className={styles.head}>
          <p className="eyebrow">This season</p>
          <h2 id="season-title">{block.heading}</h2>
        </div>
        <p className={styles.seasonText}>{block.text}</p>
        <NextLink href={block.action.href} className="button">
          {block.action.label}
        </NextLink>
      </div>
    </section>
  );
}
