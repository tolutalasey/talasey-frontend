import NextLink from 'next/link';
import type { PergolaContent } from '../content';
import styles from './PergolaBuilderPage.module.css';

// On the pergolas range page: one card per builder.
export function BuilderLinks({ builders }: { builders: PergolaContent[] }) {
  if (builders.length === 0) return null;
  return (
    <section className={styles.links} aria-labelledby="build-your-own">
      <h2 id="build-your-own">Build your own pergola</h2>
      <ul>
        {builders.map((builder) => (
          <li key={builder.slug} className="frame">
            <h3>
              <NextLink href={`/pergolas/${builder.slug}/`}>{builder.range} pergola</NextLink>
            </h3>
            <p>
              {builder.roof}. {builder.sizes.map((size) => size.label).join(', ')}.
            </p>
            <span className="go" aria-hidden="true">
              →
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
