import NextLink from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductRow, getRanges, rangePath, RelatedProducts } from '@/features/catalogue';
import { AddToBasket } from '@/features/checkout';
import {
  getProduct,
  getProductView,
  ProductPage,
  productDescription,
  StockAlertForm,
  productPath,
  productStructuredData,
} from '@/features/product';
import { areaFrom } from '@/lib/coverage';
import { formatPrice } from '@/lib/format';
import { readFeedback } from '@/lib/form-feedback.server';
import { JsonLd } from '@/lib/JsonLd';
import { builderPathFor } from '@/features/pergola';
import { pageMetadata } from '@/lib/seo';

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
  const [view, feedback] = await Promise.all([getProductView(handle, query), readFeedback()]);
  if (!view) notFound();
  const { product, variant, colours, extras, pricing, stock } = view;
  const related = await relatedTo(product);
  const outOfStock = Boolean(variant?.priceIncVat) && stock.level === 'out-of-stock';

  return (
    <>
      <ProductPage
        {...view}
        related={
          <RelatedProducts
            heading="More from this range"
            products={related.products}
            more={related.range}
          />
        }
      >
        {product.pageType === BUILT_TO_ORDER ? (
          <p>
            This is bought as part of a build.{' '}
            <NextLink
              href={await builderPathFor(product.variants.flatMap((option) => option.sku ?? []))}
              className="button"
            >
              Build your pergola
            </NextLink>
          </p>
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
      {productStructuredData(product, variant, view.content.faqs).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
    </>
  );
}
