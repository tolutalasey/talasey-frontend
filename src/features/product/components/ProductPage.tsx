import type { Product, ProductVariant, SampleOffer } from '@/api-client';
import type { StockStatusProps } from '@/ui/StockStatus/StockStatus';
import type { ReactNode } from 'react';
import { TrustStrip } from '@/ui/TrustStrip/TrustStrip';
import { TruckIcon } from '@/ui/icons';
import { PageBreadcrumbs } from '@/features/layout';
import { trustPoints } from '@/lib/trust-points';
import { DetailsForm } from '@/features/contact';
import { ProductSamples } from '@/features/samples';
import type { BreadcrumbItem } from '@/lib/seo';
import type { SalesProfile } from '@/lib/sold-as';
import type { ProductContent, ProductPhoto } from '../content';
import type { PackPricing } from '../pricing';
import type { OptionGroup } from '../selection';
import { OptionPicker } from './OptionPicker';
import { PriceSummary } from './PriceSummary';
import { ProductFacts } from './ProductFacts';
import styles from './ProductPage.module.css';
import { ProductPhotos } from './ProductPhotos';
import { ProductActions } from './ProductActions';
import { FeaturesBox } from './FeaturesBox';
import { ProductIntro } from './ProductIntro';

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
  profile: SalesProfile;
  samples: SampleOffer[];
  path: string;
  // The purchase area: the basket form, or what to do instead for made-to-measure products.
  children?: ReactNode;
  // Takes the place of the photos and purchase area, for products bought through a builder.
  top?: ReactNode;
  // Template 3: priced after a site survey, so no price, stock or delivery line.
  enquiryOnly?: boolean;
  // Downloads and videos for the product, under the details.
  resources?: ReactNode;
  // Products shown under the details, such as others from the same range.
  related?: ReactNode;
  // On a colour's own page: that colour, and the page for each of the product's colours.
  colour?: string | null;
  colourPaths?: Record<string, string>;
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
  profile,
  samples,
  path,
  children,
  top,
  enquiryOnly = false,
  resources,
  related,
  colour = null,
  colourPaths,
}: ProductPageProps) {
  const range = breadcrumbs.length > 2 ? breadcrumbs[1]?.name : null;
  const colourWords = colour
    ? content.colours.find((entry) => entry.colour.toLowerCase() === colour.toLowerCase())
    : undefined;
  const features = colourWords?.features.length ? colourWords.features : content.features;
  const tags = [
    ...new Set([...(range ? [range] : []), ...product.categories.map((category) => category.name)]),
  ];
  const sizes = product.options.find((option) => option.title === 'Size')?.values ?? [];
  return (
    <>
      <article className={styles.product}>
        <PageBreadcrumbs items={breadcrumbs} />
        {top ?? (
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
              <ProductIntro
                description={colourWords?.description || content.description || product.description}
                sizes={sizes}
                tags={tags}
              />
              <ProductActions
                title={product.title}
                handle={product.handle}
                path={path}
                hasSamples={samples.length > 0}
                without={product.sellOnline ? null : product.offlineAction}
              />
              {enquiryOnly ? (
                <p className={styles.subtitle}>
                  Designed and built to order. Every one is priced individually after a free site
                  survey.
                </p>
              ) : (
                <PriceSummary pricing={pricing} stock={stock} unit={profile.unit.one} />
              )}
              {options.length > 0 && (
                <OptionPicker groups={options} path={path} colourPaths={colourPaths} />
              )}
              {children}
              <ProductSamples offers={samples} />
              {!enquiryOnly && product.sellOnline && (
                <p className={styles.delivery}>
                  <TruckIcon width={22} height={22} />
                  <span>
                    <strong>Delivery on a day you choose.</strong> Book the day at checkout. We call
                    before we come.
                  </span>
                </p>
              )}
              <FeaturesBox features={features} />
            </div>
          </div>
        )}
        {resources}
        <ProductFacts
          product={product}
          variant={variant}
          brand={brand}
          content={content}
          colour={colour}
        />
        {related}
        <section className={`frame ${styles.message}`}>
          <DetailsForm id="product" productHandle={product.handle} />
        </section>
      </article>
      <TrustStrip points={trustPoints} label="Why buy from Talasey" />
    </>
  );
}
