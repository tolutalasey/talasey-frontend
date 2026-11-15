import NextLink from 'next/link';
import type { PergolaRules } from '../rules';
import styles from './AmyBuilder.module.css';

export interface OtherBuilder {
  slug: string;
  range: string;
  biggest: string;
  area: number;
}

const biggestArea = (rules: PergolaRules) =>
  Math.max(0, ...rules.sizes.map((size) => size.width * size.depth));

// Under the size step: where to go for a bigger pergola than this range makes.
export function BiggerSize({ rules, others }: { rules: PergolaRules; others: OtherBuilder[] }) {
  const bigger = others.find((other) => other.area > biggestArea(rules));
  if (!bigger) return null;
  return (
    <p className={styles.note}>
      Need something bigger? See the{' '}
      <NextLink href={`/pergolas/${bigger.slug}/`}>{bigger.range} range</NextLink> (up to{' '}
      {bigger.biggest}) or <NextLink href="/contact/">contact us</NextLink> about a bespoke size.
    </p>
  );
}
