import { createApiClient, unwrap, unwrapOrNull, type ApiClientOptions } from './client';
import type { ColourOffer, Price, Product } from './product';
import type { paths } from './schema';

type StoreProduct =
  paths['/store/products']['get']['responses'][200]['content']['application/json'][number];

const price = (pence: number | null): Price | null =>
  pence === null ? null : { amount: pence / 100, currencyCode: 'GBP' };

export function toProduct(product: StoreProduct): Product {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    subtitle: product.subtitle,
    brand: product.brand,
    description: product.description,
    thumbnail: product.thumbnail,
    madeToMeasure: product.madeToMeasure,
    measurements: product.measurements,
    sellOnline: product.sellOnline,
    offlineAction: product.offlineAction,
    pageType: product.pageType,
    updatedAt: product.updatedAt,
    categories: product.categories,
    options: product.options,
    colourChoice: product.colourChoice,
    images: product.images,
    leadTime: product.leadTime,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      barcode: variant.barcode,
      options: variant.options,
      priceIncVat: price(variant.pricePence),
      stock: variant.stock,
      coverageM2: variant.coverageM2,
      weightKg: variant.weightKg,
      thumbnail: null,
    })),
  };
}

export function createCatalog(options: ApiClientOptions) {
  const api = createApiClient(options);

  return {
    async getProductByHandle(handle: string): Promise<Product | null> {
      const product = await unwrapOrNull(
        api.GET('/store/products/{handle}', { params: { path: { handle } } }),
      );
      return product ? toProduct(product) : null;
    },

    async listProducts(): Promise<Product[]> {
      return (await unwrap(api.GET('/store/products'))).map(toProduct);
    },

    async listProductHandles(): Promise<string[]> {
      return (await unwrap(api.GET('/store/products'))).map((product) => product.handle);
    },

    // The colours to offer once the shopper has picked options, e.g. { Finish: 'Powder Coated' }.
    async getColours(
      productId: string,
      selected: Record<string, string>,
    ): Promise<ColourOffer | null> {
      return unwrap(
        api.GET('/store/products/{id}/colours', {
          params: { path: { id: productId }, query: { selected } },
          querySerializer: { object: { style: 'deepObject', explode: true } },
        }),
      );
    },

    async quoteMadeToMeasure(
      handle: string,
      dimensions: Record<string, number>,
      choices: Record<string, string>,
    ): Promise<Price | null> {
      const { pricePence } = await unwrap(
        api.POST('/store/products/{handle}/bespoke-quote', {
          params: { path: { handle } },
          body: { dimensions, choices },
        }),
      );
      return price(pricePence);
    },
  };
}

export type Catalog = ReturnType<typeof createCatalog>;
