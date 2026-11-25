import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getProductRow, getRanges, rangePath, RelatedProducts } from '@/features/catalogue';
import { AddToBasket, MadeToMeasure } from '@/features/checkout';
import { getInspirationFor, InGardens } from '@/features/content';
import { SiteSurvey } from '@/features/contact';
import { getSiteSettings } from '@/features/layout';
import {
  ColourChoicesPage,
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
  startFromQuery,
  startFromSku,
  designFrom,
} from '@/features/pergola';
import { FenceProduct, getFenceForProduct } from '@/features/fencing';
import { getProductResources, ProductResources } from '@/features/knowledge-hub';
import { pageMetadata } from '@/lib/seo';
import { getSampleOffers, offerFor } from '@/features/samples';
import {
  COLOUR_OPTION,
  colourFromSlug,
  colourPath,
  colourTitle,
  pageColours,
} from '@/lib/product-colours';
import { slugify } from '@/lib/slug';

const ENQUIRY_ONLY = '3';
const BUILT_TO_ORDER = '4';

type Query = Record<string, string | string[] | undefined>;

// The product and the options chosen on its page, for a stockist enquiry. The colour is already in
// a colour page's title.
const specOf = (title: string, options: Record<string, string> = {}) =>
  [
    title,
    ...Object.entries(options)
      .filter(([name]) => name !== COLOUR_OPTION)
      .map(([name, value]) => `${name}: ${value}`),
  ].join(', ');

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// A colour page's address names the colour; on the product's own page ?colour= picks one.
export async function productRouteMetadata(
  handle: string,
  query: Query,
  colourSlug?: string,
): Promise<Metadata> {
  const product = await getProduct(handle);
  if (!product) notFound();
  const colour = colourSlug ? colourFromSlug(product.options, colourSlug) : null;
  if (colourSlug && !colour) notFound();
  return pageMetadata({
    title: `${colour ? colourTitle(product.title, colour) : product.title} | Talasey`,
    description: productDescription(product),
    path: colour ? colourPath(product.handle, colour) : productPath(product.handle),
    noindex: Object.keys(query).length > 0,
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

export async function ProductRoute({
  handle,
  query,
  colourSlug,
}: {
  handle: string;
  query: Query;
  colourSlug?: string;
}) {
  const found = await getProduct(handle);
  if (!found) notFound();
  const colour = colourSlug ? colourFromSlug(found.options, colourSlug) : null;
  if (colourSlug && !colour) notFound();
  const [view, feedback, settings] = await Promise.all([
    getProductView(handle, colour ? { ...query, colour: slugify(colour) } : query),
    readFeedback(),
    getSiteSettings(),
  ]);
  if (!view) notFound();
  const { variant, colours, extras, pricing, stock } = view;
  const skus = view.product.variants.flatMap((option) => option.sku ?? []);
  const [related, resources, pergola, fence, gardens] = await Promise.all([
    relatedTo(view.product),
    getProductResources(view.product.handle),
    getPergolaForProduct(skus),
    query.buy === 'boards' ? null : getFenceForProduct(view.product.handle),
    getInspirationFor(view.product.title),
  ]);
  const colourNames = pergola || fence ? [] : pageColours(view.product.options);

  // A product in several colours: its own page lists the colours, and each colour has a page.
  if (colourNames.length > 0 && !colour) {
    const asked = colourFromSlug(view.product.options, first(query.colour) ?? '');
    if (asked) {
      const { colour: _colour, ...rest } = query;
      const others = new URLSearchParams(
        Object.entries(rest).flatMap(([key, value]) => (value ? [[key, String(value)]] : [])),
      ).toString();
      permanentRedirect(`${colourPath(handle, asked)}${others ? `?${others}` : ''}`);
    }
    return (
      <ColourChoicesPage
        view={view}
        offers={await getSampleOffers()}
        resources={<ProductResources {...resources} />}
      />
    );
  }

  const product = colour
    ? { ...view.product, title: colourTitle(view.product.title, colour) }
    : view.product;
  const path = colour ? colourPath(handle, colour) : view.path;
  const breadcrumbs = colour
    ? [...view.breadcrumbs, { name: product.title, path }]
    : view.breadcrumbs;
  const colourSample = colour ? offerFor(view.samples, handle, colour) : null;
  const samples = colour ? (colourSample ? [colourSample] : []) : view.samples;
  const colourPaths = Object.fromEntries(
    colourNames.map((name) => [name, colourPath(handle, name)]),
  );
  const actions = (
    <ProductActions title={product.title} handle={product.handle} path={path} hasSamples={false} />
  );
  const outOfStock = Boolean(variant?.priceIncVat) && stock.level === 'out-of-stock';

  return (
    <>
      <ProductPage
        {...view}
        product={product}
        path={path}
        breadcrumbs={breadcrumbs}
        colour={colour}
        colourPaths={colourPaths}
        samples={samples}
        enquiryOnly={product.pageType === ENQUIRY_ONLY}
        top={
          fence ? (
            <FenceProduct
              {...fence}
              title={product.title}
              subtitle={product.subtitle}
              photos={<ProductPhotos photos={view.photos} name={product.title} />}
              actions={actions}
              singlePath={`${view.path}?buy=boards`}
            />
          ) : (
            pergola && (
              <PergolaProduct
                {...pergola}
                design={designFrom(query.design)}
                path={view.path}
                title={product.title}
                subtitle={product.subtitle}
                photos={<ProductPhotos photos={view.photos} name={product.title} />}
                actions={actions}
                start={
                  startFromQuery(pergola.builder, query) ??
                  (Object.keys(query).some((key) => key !== 'design')
                    ? startFromSku(pergola.builder, variant?.sku)
                    : undefined)
                }
              />
            )
          )
        }
        resources={<ProductResources {...resources} />}
        related={
          <>
            <InGardens items={gardens} />
            <RelatedProducts
              heading="You may also need"
              products={related.products}
              more={related.range}
            />
          </>
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
            spec={specOf(product.title, variant?.options)}
            colours={colours && { label: colours.label, options: colours.options }}
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
        path,
      ).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
    </>
  );
}
