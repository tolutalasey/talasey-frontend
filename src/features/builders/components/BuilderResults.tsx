import Image from 'next/image';
import NextLink from 'next/link';
import type { Builder } from '../builders';
import styles from './BuilderResults.module.css';

// Above search results: the builders that match what was searched for.
export function BuilderResults({ builders }: { builders: Builder[] }) {
  if (builders.length === 0) return null;
  return (
    <section className={styles.builders} aria-labelledby="builder-results">
      <h2 id="builder-results" className="eyebrow">
        Build it yourself
      </h2>
      <ul>
        {builders.map((builder) => (
          <li key={builder.path} className="frame">
            <Image src={builder.image} alt="" width={160} height={120} sizes="8rem" />
            <div>
              <h3>{builder.name}</h3>
              <p>{builder.summary}</p>
              <NextLink href={builder.path} className="button">
                Start building
              </NextLink>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
