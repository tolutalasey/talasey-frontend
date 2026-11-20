import NextLink from 'next/link';
import type { ReactNode } from 'react';
import type { FenceBuilder as Rules } from '../content';
import type { FenceCatalogue } from '../rules';
import { FenceBuilder } from './FenceBuilder';
import styles from './FenceBuilder.module.css';

interface Props {
  builder: Rules;
  catalogue: FenceCatalogue;
  startStyle: number;
  title: string;
  subtitle: string | null;
  photos: ReactNode;
  actions?: ReactNode;
  // The same page as a plain product, for buying boards on their own.
  singlePath: string;
}

// A fence board's product page is the kit builder, opened on that board's style.
export function FenceProduct({
  builder,
  catalogue,
  startStyle,
  title,
  subtitle,
  photos,
  actions,
  singlePath,
}: Props) {
  return (
    <FenceBuilder
      rules={builder}
      catalogue={catalogue}
      startStyle={startStyle}
      photos={photos}
      head={
        <header className={`frame ${styles.head}`}>
          <p className="eyebrow">{builder.name} kit builder</p>
          <h1>{title}</h1>
          {subtitle && <p className={styles.intro}>{subtitle}</p>}
          <p className={styles.intro}>
            Pick the style, colour, length and height, and we work out every board, post and trim
            you need. Only need boards? <NextLink href={singlePath}>Buy them on their own</NextLink>
            .
          </p>
          {actions}
        </header>
      }
    />
  );
}
