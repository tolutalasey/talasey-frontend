import NextLink from 'next/link';
import type { ReactNode } from 'react';
import type { PergolaContent } from '../content';
import type { Build, Catalogue } from '../rules';
import { AmyBuilder } from './AmyBuilder';
import type { OtherBuilder } from './BiggerSize';
import { PergolaDetails } from './PergolaDetails';
import { PhotoBuilder } from './PhotoBuilder';
import { formatPrice } from '@/lib/format';
import { ToluBuilder } from './ToluBuilder';
import styles from './PergolaProduct.module.css';

export type Design = 'photos' | 'amy' | 'tolu';

export const DESIGNS: { id: Design; label: string; short: string; detail: string }[] = [
  { id: 'photos', label: 'Design C', short: 'With photos', detail: 'Studio photos, step by step' },
  { id: 'amy', label: 'Design A', short: 'Step by step', detail: "Step by step, from Amy's spec" },
  { id: 'tolu', label: 'Design B', short: 'In 3D', detail: "In 3D, from Tolu's first version" },
];

export const designHref = (path: string, design: Design) =>
  design === 'photos' ? path : `${path}?design=${design}`;

export const designFrom = (asked: unknown): Design =>
  asked === 'amy' || asked === 'tolu' ? asked : 'photos';

interface Props {
  builder: PergolaContent;
  catalogue: Catalogue;
  others: OtherBuilder[];
  design: Design;
  path: string;
  title: string;
  subtitle: string | null;
  photos: ReactNode;
  // Sample, share, stockist and installer buttons, as on every product page.
  actions?: ReactNode;
  start?: Partial<Build>;
}

const lowestPrice = (builder: PergolaContent, catalogue: Catalogue) => {
  const prices = builder.sizes.flatMap((size) =>
    [size.freeStandingSku, size.wallMountedSku].flatMap((sku) =>
      sku && catalogue[sku] ? [catalogue[sku].pricePence] : [],
    ),
  );
  return prices.length ? Math.min(...prices) : null;
};

// A pergola's product page is its builder: the photos and drawing on one side, the steps, price
// and bag button on the other, so shoppers choose and buy without leaving the product.
export function PergolaProduct({
  builder,
  catalogue,
  others,
  design,
  path,
  title,
  subtitle,
  photos,
  actions,
  start,
}: Props) {
  const from = lowestPrice(builder, catalogue);
  const head = (
    <header className={styles.head}>
      <p className="eyebrow">{builder.range} pergola</p>
      <h1>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {from !== null && (
        <p className={styles.from}>
          From {formatPrice({ amount: from / 100, currencyCode: 'GBP' })}
          <small>inc. VAT, before sides and extras</small>
        </p>
      )}
      <nav className={styles.designs} aria-label="Builder design">
        {DESIGNS.map((option) => (
          <NextLink
            key={option.id}
            href={designHref(path, option.id)}
            aria-current={option.id === design ? 'page' : undefined}
            scroll={false}
          >
            <strong>{option.label}</strong>
            <small>{option.detail}</small>
          </NextLink>
        ))}
      </nav>
      {actions}
    </header>
  );
  return (
    <div className={styles.product}>
      {design === 'photos' ? (
        <PhotoBuilder
          rules={builder}
          catalogue={catalogue}
          others={others}
          start={start}
          head={head}
        />
      ) : design === 'tolu' ? (
        <ToluBuilder
          rules={builder}
          catalogue={catalogue}
          others={others}
          start={start}
          head={head}
        />
      ) : (
        <AmyBuilder
          rules={builder}
          catalogue={catalogue}
          others={others}
          start={start}
          head={head}
          photos={photos}
        />
      )}
      <PergolaDetails builder={builder} />
    </div>
  );
}
