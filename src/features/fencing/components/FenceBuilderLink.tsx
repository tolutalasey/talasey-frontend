import NextLink from 'next/link';
import type { FenceBuilder } from '../content';
import { fenceBuilderPath } from '../paths';
import styles from './FenceBuilder.module.css';

// On the fencing range page: the way into each kit builder.
export function FenceBuilderLinks({ builders }: { builders: FenceBuilder[] }) {
  if (builders.length === 0) return null;
  return (
    <section className={`frame ${styles.link}`} aria-labelledby="fence-builder-title">
      <p className="eyebrow">Fence kit builder</p>
      <h2 id="fence-builder-title">Build your fence in a few steps</h2>
      <p>
        Pick the style, colour, length and height, and we work out every board, post and trim you
        need, with the price as you go.
      </p>
      {builders.map((builder) => (
        <NextLink key={builder.slug} href={fenceBuilderPath(builder)} className="button">
          Build a {builder.name.toLowerCase()} kit
        </NextLink>
      ))}
    </section>
  );
}
