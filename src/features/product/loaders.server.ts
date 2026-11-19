import 'server-only';
import { isAvailable, type ColourOffer, type Product, type ProductVariant } from '@/api-client';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { getCatalog, orEmpty } from '@/lib/commerce';
import { publishedContent } from '@/lib/content';
import { extrasFor, type ProductContent } from './content';

export async function getProduct(handle: string): Promise<Product | null> {
  'use cache';
  cacheTag(cacheTags.products, cacheTags.product(handle));
  cacheLife('hours');

  return getCatalog().getProductByHandle(handle);
}

export async function getProductHandles(): Promise<string[]> {
  'use cache';
  cacheTag(cacheTags.products);
  cacheLife('hours');

  return orEmpty(() => getCatalog().listProductHandles());
}

export async function getColours(
  product: Pick<Product, 'id' | 'handle'>,
  options: Record<string, string>,
): Promise<ColourOffer | null> {
  'use cache';
  cacheTag(cacheTags.products, cacheTags.product(product.handle));
  cacheLife('hours');

  return getCatalog().getColours(product.id, options);
}

// Photos come from the product in /admin; "complete the job", documents, features and warranty
// from its "Product extras" in /content.
export async function getProductContent(handle: string): Promise<ProductContent> {
  'use cache';
  cacheTag(
    cacheTags.products,
    cacheTags.product(handle),
    cacheTags.productContent(handle),
    cacheTags.productExtras,
  );
  cacheLife('days');

  const product = await getProduct(handle).catch(() => null);
  const photos = (product?.images ?? []).map((image) => ({
    src: image.url,
    alt: image.alt,
    width: image.width ?? 1200,
    height: image.height ?? 900,
    shows: image.shows ?? null,
  }));
  const extras = extrasFor(handle, await publishedContent('product-extras'));
  return { ...extras, photos };
}

export interface Companion {
  product: Product;
  // The versions that can be bought now, cheapest first.
  variants: ProductVariant[];
  reason: string;
}

// The products in "complete the job", each with the versions that can be bought online. Products
// with none are left out.
export async function getCompanions(content: ProductContent): Promise<Companion[]> {
  const found = await Promise.all(
    content.completeTheJob.map(async ({ handle, reason }) => {
      const product = await getProduct(handle);
      const variants = (product?.variants ?? [])
        .filter((candidate) => candidate.priceIncVat && isAvailable(candidate))
        .sort((a, b) => (a.priceIncVat?.amount ?? 0) - (b.priceIncVat?.amount ?? 0));
      return product && variants.length > 0 ? [{ product, variants, reason }] : [];
    }),
  );
  return found.flat();
}
