import NextLink from 'next/link';
import type { PergolaPage } from '../loaders.server';
import { DESIGNS, designHref } from './PergolaProduct';
import styles from './BuilderLinks.module.css';

// On the pergolas range page: one card per pergola, each opening its product page and builder.
export function BuilderLinks({ pages }: { pages: PergolaPage[] }) {
  if (pages.length === 0) return null;
  return (
    <section id="build-your-own" className={styles.links} aria-labelledby="build-your-own-title">
      <p className="eyebrow">Pergola builder</p>
      <h2 id="build-your-own-title">Try our Pergola Builder</h2>
      <p className={styles.linksIntro}>
        Pick the size, how it is fixed, the sides and the extras, and see the price as you go.
      </p>
      <ul>
        {pages.map(({ builder, path }) => (
          <li key={builder.slug} className="frame">
            <h3>{builder.range} pergola</h3>
            <p>
              {builder.roof}. {builder.sizes.map((size) => size.label).join(', ')}.
            </p>
            <div className={styles.linkDesigns}>
              {DESIGNS.map((design) => (
                <NextLink
                  key={design.id}
                  href={designHref(path, design.id)}
                  className={design.id === 'amy' ? 'button' : 'button-secondary'}
                >
                  <span>{design.short}</span>
                  <small>{design.label}</small>
                </NextLink>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
