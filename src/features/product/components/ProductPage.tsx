import type { Product, ProductVariant, SampleOffer } from '@/api-client';
import type { StockStatusProps } from '@/ui/StockStatus/StockStatus';
import type { ReactNode } from 'react';
import { PageBreadcrumbs } from '@/features/layout';
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
}: ProductPageProps) {
  return (
    <article className={`container ${styles.product}`}>
      <PageBreadcrumbs items={breadcrumbs} />
      <div className={styles.top}>
        <ProductPhotos photos={photos} name={product.title} />
        <div className={styles.buy}>
          <h1>{product.title}</h1>
          {product.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}
          <PriceSummary pricing={pricing} stock={stock} />
          {options.length > 0 && <OptionPicker groups={options} path={path} />}
          {children}
          <ProductSamples offers={samples} />
        </div>
      </div>
      <ProductFacts product={product} variant={variant} brand={brand} content={content} />
    </article>
  );
}
