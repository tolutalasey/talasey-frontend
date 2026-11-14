import type { Product, ProductVariant, SampleOffer } from '@/api-client';
import type { StockStatusProps } from '@/ui/StockStatus/StockStatus';
import type { ReactNode } from 'react';
import { TrustStrip } from '@/ui/TrustStrip/TrustStrip';
import { TruckIcon } from '@/ui/icons';
import { PageBreadcrumbs } from '@/features/layout';
import { trustPoints } from '@/lib/trust-points';
import { ProductSamples } from '@/features/samples';
import type { BreadcrumbItem } from '@/lib/seo';
import type { ProductContent, ProductPhoto } from '../content';
import type { PackPricing } from '../pricing';
import type { OptionGroup } from '../selection';
import { OptionPicker } from './OptionPicker';
import { PriceSummary } from './PriceSummary';
import { ProductFacts } from './ProductFacts';
import styles from './ProductPage.module.css';
import { ProductPhotos } from './ProductPhotos';

export interface ProductPageProps {
  product: Product;
  variant: ProductVariant | null;
  brand: string | null;
  breadcrumbs: BreadcrumbItem[];
  photos: ProductPhoto[];
  pricing: PackPricing | null;
  stock: StockStatusProps;
  options: OptionGroup[];
  content: ProductContent;
  samples: SampleOffer[];
  path: string;
  // The purchase area: the basket form, or what to do instead for made-to-measure products.
  children: ReactNode;
  // Products shown under the details, such as others from the same range.
  related?: ReactNode;
}

export function ProductPage({
  product,
  variant,
  brand,
  breadcrumbs,
  photos,
  pricing,
  stock,
  options,
  content,
  samples,
  path,
  children,
  related,
}: ProductPageProps) {
  const range = breadcrumbs.length > 2 ? breadcrumbs[1]?.name : null;
  return (
    <>
      <article className={styles.product}>
        <PageBreadcrumbs items={breadcrumbs} />
        <div className={styles.top}>
          <div className={`frame ${styles.media}`}>
            <ProductPhotos photos={photos} name={product.title} />
            {photos.length > 0 && samples.length > 0 && (
              <span className={`sticker ${styles.sticker}`} aria-hidden="true">
                Free samples
              </span>
            )}
          </div>
          <div className={`frame ${styles.buy}`}>
            {(range ?? brand) && <p className="eyebrow">{range ?? brand}</p>}
            <h1>{product.title}</h1>
            {product.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}
            <PriceSummary pricing={pricing} stock={stock} />
            {options.length > 0 && <OptionPicker groups={options} path={path} />}
            {children}
            <ProductSamples offers={samples} />
            <p className={styles.delivery}>
              <TruckIcon width={22} height={22} />
              <span>
                <strong>Delivery on a day you choose.</strong> Book the day at checkout. We call
                before we come.
              </span>
            </p>
          </div>
        </div>
        <ProductFacts product={product} variant={variant} brand={brand} content={content} />
        {related}
      </article>
      <TrustStrip points={trustPoints} label="Why buy from Talasey" />
    </>
  );
}
