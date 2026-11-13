import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AddToBasket } from '@/features/checkout';
import {
  getProduct,
  getProductView,
  ProductPage,
  productDescription,
  productPath,
  productStructuredData,
} from '@/features/product';
import { readFeedback } from '@/lib/form-feedback.server';
import { JsonLd } from '@/lib/JsonLd';
import { pageMetadata } from '@/lib/seo';

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
  });
}

export default async function Product({ params, searchParams }: Props) {
  const { handle } = await params;
  const [view, feedback] = await Promise.all([
    getProductView(handle, await searchParams),
    readFeedback(),
  ]);
  if (!view) notFound();
  const { product, variant, colours, extras, pricing } = view;

  return (
    <>
      <ProductPage {...view}>
        {product.madeToMeasure ? (
          <p>Made to your measurements. Call us for a quote while online ordering is set up.</p>
        ) : (
          <AddToBasket
            key={variant?.id}
            variantId={variant?.priceIncVat ? variant.id : null}
            colours={colours}
            extras={extras}
            coverageM2={pricing?.coverageM2}
            initialState={feedback.basket}
          />
        )}
      </ProductPage>
      {productStructuredData(product, variant).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
    </>
  );
}
