import NextLink from 'next/link';
import type { PergolaContent } from '../content';
import { DESIGNS } from './PergolaBuilderPage';
import styles from './PergolaBuilderPage.module.css';

// On the pergolas range page: one card per builder, with a way into each builder design.
export function BuilderLinks({ builders }: { builders: PergolaContent[] }) {
  if (builders.length === 0) return null;
  return (
    <section id="build-your-own" className={styles.links} aria-labelledby="build-your-own-title">
      <p className="eyebrow">Pergola builder</p>
      <h2 id="build-your-own-title">Design your own pergola</h2>
      <p className={styles.linksIntro}>
        Pick the size, how it is fixed, the sides and the extras, and see the price as you go.
      </p>
      <ul>
        {builders.map((builder) => {
          const path = `/pergolas/${builder.slug}/`;
          return (
            <li key={builder.slug} className="frame">
              <h3>{builder.range} pergola</h3>
              <p>
                {builder.roof}. {builder.sizes.map((size) => size.label).join(', ')}.
              </p>
              <div className={styles.linkDesigns}>
                {DESIGNS.map((design) => (
                  <NextLink
                    key={design.id}
                    href={design.id === 'amy' ? path : `${path}?design=${design.id}`}
                    className={design.id === 'amy' ? 'button' : 'button-secondary'}
                  >
                    {design.label}: {design.detail.split(',')[0]}
                  </NextLink>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
