import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { getCatalog, orEmpty } from '@/lib/commerce';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import { pergolaContentSchema, type PergolaContent } from './content';
import type { Catalogue } from './rules';

export async function getPergolaBuilders(): Promise<PergolaContent[]> {
  'use cache';
  cacheTag(cacheTags.pergolaBuilders);
  cacheLife('days');
  return (await publishedContent('pergola-builder')).flatMap((entry) => {
    const parsed = pergolaContentSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getPergolaBuilder(slug: string): Promise<PergolaContent | null> {
  return (await getPergolaBuilders()).find((builder) => builder.slug === slug) ?? null;
}

// Every SKU on the shop that has a price, so the builders offer only what can be bought.
export async function getPergolaCatalogue(): Promise<Catalogue> {
  'use cache';
  cacheTag(cacheTags.products);
  cacheLife('hours');
  const products = await orEmpty(() => getCatalog().listProducts());
  return Object.fromEntries(
    products.flatMap((product) =>
      product.variants.flatMap((variant) =>
        variant.sku && variant.priceIncVat
          ? [
              [
                variant.sku,
                {
                  variantId: variant.id,
                  name:
                    product.variants.length > 1
                      ? `${product.title}, ${variant.title}`
                      : product.title,
                  pricePence: Math.round(variant.priceIncVat.amount * 100),
                },
              ],
            ]
          : [],
      ),
    ),
  );
}

const skusOf = (builder: PergolaContent) => [
  ...builder.sizes.flatMap((size) => [
    size.freeStandingSku,
    size.wallMountedSku,
    size.lightingKitSku,
  ]),
  ...builder.sides.flatMap((side) => [
    side.sku3m,
    side.sku4m,
    side.verticalSku3m,
    side.verticalSku4m,
  ]),
  builder.heaterSku,
];

// The builder a product is bought through, found by any of its SKUs.
export async function builderPathFor(skus: string[]): Promise<string> {
  const builders = await getPergolaBuilders();
  const found = builders.find((builder) =>
    skusOf(builder).some((sku) => sku && skus.includes(sku)),
  );
  return found ? `/pergolas/${found.slug}/` : '/pergolas/';
}
