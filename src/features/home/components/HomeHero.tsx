import NextLink from 'next/link';
import type { HomeContent } from '../content';
import styles from './HomeHero.module.css';

export function HomeHero({ content }: { content: HomeContent }) {
  const [primary, secondary] = content.heroActions;
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className="container">
        <h1 id="home-title" className={styles.title}>
          {content.h1}
        </h1>
        <p className={styles.intro}>{content.intro}</p>
        <p className={styles.actions}>
          <NextLink href={primary.href} className={styles.primary}>
            {primary.label}
          </NextLink>
          <NextLink href={secondary.href} className={styles.secondary}>
            {secondary.label}
          </NextLink>
        </p>
      </div>
    </section>
  );
}
