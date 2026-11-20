import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductRow, getRanges, rangePath, RelatedProducts } from '@/features/catalogue';
import { AddToBasket, MadeToMeasure } from '@/features/checkout';
import { SiteSurvey } from '@/features/contact';
import { getSiteSettings } from '@/features/layout';
import {
  getProduct,
  getProductView,
  leadTimeText,
  OfflineAction,
  ProductPage,
  ProductActions,
  ProductPhotos,
  productDescription,
  StockAlertForm,
  productPath,
  productStructuredData,
} from '@/features/product';
import { areaFrom } from '@/lib/coverage';
import { formatPrice } from '@/lib/format';
import { readFeedback } from '@/lib/form-feedback.server';
import { JsonLd } from '@/lib/JsonLd';
import {
  getPergolaForProduct,
  getPergolaPagesUsing,
  PergolaAddOnLinks,
  PergolaProduct,
  startFromSku,
} from '@/features/pergola';
import { getProductResources, ProductResources } from '@/features/knowledge-hub';
import { pageMetadata } from '@/lib/seo';

const ENQUIRY_ONLY = '3';
const BUILT_TO_ORDER = '4';

// Options come from the query string and the basket form shows the server's errors without
// JavaScript, so the page renders per request and in full before it is sent (ADR 0020). An
// unknown handle is a real 404.
export const instant = false;

type Props = PageProps<'/products/[handle]'>;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return pageMetadata({
    title: `${product.title} | Talasey`,
    description: productDescription(product),
    path: productPath(product.handle),
    noindex: Object.keys(await searchParams).length > 0,
    image: product.thumbnail,
  });
}

// Up to four other products from the product's own category, and the range page they belong to.
async function relatedTo(product: { handle: string; categories: { handle: string }[] }) {
  const category = product.categories.at(-1)?.handle;
  if (!category) return { products: [] };
  const [hits, ranges] = await Promise.all([
    getProductRow({ scope: { categories: [category] }, pageSize: 5 }),
    getRanges(),
  ]);
  const range = ranges.find((candidate) => candidate.scope.categories?.includes(category));
  return {
    products: hits.filter((hit) => hit.handle !== product.handle).slice(0, 4),
    range: range && { href: rangePath(range), label: `Shop all ${range.name.toLowerCase()}` },
  };
}

export default async function Product({ params, searchParams }: Props) {
  const { handle } = await params;
  const query = await searchParams;
  const [view, feedback, settings] = await Promise.all([
    getProductView(handle, query),
    readFeedback(),
    getSiteSettings(),
  ]);
  if (!view) notFound();
  const { product, variant, colours, extras, pricing, stock } = view;
  const skus = product.variants.flatMap((option) => option.sku ?? []);
  const [related, resources, pergola] = await Promise.all([
    relatedTo(product),
    getProductResources(product.handle),
    getPergolaForProduct(skus),
  ]);
  const outOfStock = Boolean(variant?.priceIncVat) && stock.level === 'out-of-stock';

  return (
    <>
      <ProductPage
        {...view}
        enquiryOnly={product.pageType === ENQUIRY_ONLY}
        top={
          pergola && (
            <PergolaProduct
              {...pergola}
              design={query.design === 'tolu' ? 'tolu' : 'amy'}
              path={view.path}
              title={product.title}
              subtitle={product.subtitle}
              photos={<ProductPhotos photos={view.photos} name={product.title} />}
              actions={
                <ProductActions
                  title={product.title}
                  handle={product.handle}
                  path={view.path}
                  hasSamples={false}
                />
              }
              start={
                Object.keys(query).some((key) => key !== 'design')
                  ? startFromSku(pergola.builder, variant?.sku)
                  : undefined
              }
            />
          )
        }
        resources={<ProductResources {...resources} />}
        related={
          <RelatedProducts
            heading="More from this range"
            products={related.products}
            more={related.range}
          />
        }
      >
        {product.pageType === ENQUIRY_ONLY ? (
          <SiteSurvey
            productHandle={product.handle}
            productTitle={product.title}
            sizes={product.options.find((option) => option.title === 'Size')?.values ?? []}
          />
        ) : product.pageType === BUILT_TO_ORDER ? (
          <PergolaAddOnLinks pages={await getPergolaPagesUsing(skus)} />
        ) : !product.sellOnline ? (
          <OfflineAction
            action={product.offlineAction}
            phone={settings.contactPhone}
            handle={product.handle}
          />
        ) : product.madeToMeasure && product.measurements && product.variants[0] ? (
          <MadeToMeasure
            handle={product.handle}
            variantId={product.variants[0].id}
            measurements={product.measurements}
            leadTime={`Made to order${
              leadTimeText(product.leadTime)
                ? `, dispatched in ${leadTimeText(product.leadTime)}`
                : ''
            }`}
          />
        ) : product.madeToMeasure ? (
          <p>Made to your measurements. Call us for a quote while online ordering is set up.</p>
        ) : (
          <AddToBasket
            key={variant?.id}
            variantId={variant?.priceIncVat ? variant.id : null}
            colours={colours}
            extras={extras}
            coverageM2={pricing?.coverageM2}
            packPricePence={pricing ? Math.round(pricing.perPack.amount * 100) : null}
            profile={view.profile}
            initialState={feedback.basket}
            startArea={areaFrom(query.area)}
            bar={
              pricing
                ? {
                    title: product.title,
                    price: `${formatPrice(pricing.perPack)}${pricing.coverageM2 ? ` per ${view.profile.unit.one}` : ''}`,
                  }
                : undefined
            }
          />
        )}
        {outOfStock && variant && (
          <StockAlertForm key={variant.id} variantId={variant.id} feedback={feedback.alert} />
        )}
      </ProductPage>
      {productStructuredData(
        product,
        product.pageType === ENQUIRY_ONLY ? null : variant,
        view.content.faqs,
      ).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
    </>
  );
}
