import NextLink from 'next/link';
import type { SeasonalBlock as Block } from '../content';
import styles from './HomeSections.module.css';

export function SeasonalBlock({ block }: { block: Block }) {
  return (
    <section className={styles.seasonal} aria-labelledby="season-title">
      <div className="container">
        <h2 id="season-title">{block.heading}</h2>
        <p className={styles.seasonalText}>{block.text}</p>
        <NextLink href={block.action.href}>{block.action.label}</NextLink>
      </div>
    </section>
  );
}
