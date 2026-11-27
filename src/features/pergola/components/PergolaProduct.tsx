import type { ReactNode } from 'react';
import type { PergolaContent } from '../content';
import type { Build, Catalogue } from '../rules';
import type { OtherBuilder } from './BiggerSize';
import { PergolaDetails } from './PergolaDetails';
import { PhotoBuilder } from './PhotoBuilder';
import { formatPrice } from '@/lib/format';
import styles from './PergolaProduct.module.css';

interface Props {
  builder: PergolaContent;
  catalogue: Catalogue;
  others: OtherBuilder[];
  title: string;
  subtitle: string | null;
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
  title,
  subtitle,
  actions,
  start,
}: Props) {
  const from = lowestPrice(builder, catalogue);
  const head = (
    <header className={styles.head}>
      <p className="eyebrow">{builder.range} Pergola</p>
      <h1>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {from !== null && (
        <p className={styles.from}>
          From {formatPrice({ amount: from / 100, currencyCode: 'GBP' })}
          <small>inc. VAT, before sides and extras</small>
        </p>
      )}
      {actions}
    </header>
  );
  return (
    <div className={styles.product}>
      <PhotoBuilder
        rules={builder}
        catalogue={catalogue}
        others={others}
        start={start}
        head={head}
      />
      <PergolaDetails builder={builder} />
    </div>
  );
}
