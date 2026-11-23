import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { getCatalog, orEmpty } from '@/lib/commerce';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import { productPath } from '@/lib/urls/keyword-map';
import type { OtherBuilder } from './components/BiggerSize';
import { asRules, pergolaContentSchema, type PergolaContent } from './content';
import { builderGuide, type Catalogue } from './rules';

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

const structureSkus = (builder: PergolaContent) =>
  builder.sizes.flatMap((size) => [size.freeStandingSku, size.wallMountedSku]);

const skusOf = (builder: PergolaContent) => [
  ...structureSkus(builder),
  ...builder.sizes.map((size) => size.lightingKitSku),
  ...builder.sides.flatMap((side) => [
    side.sku3m,
    side.sku4m,
    side.verticalSku3m,
    side.verticalSku4m,
  ]),
  builder.heaterSku,
];

export interface PergolaPage {
  builder: PergolaContent;
  path: string;
}

async function handlesBySku(): Promise<Record<string, string>> {
  'use cache';
  cacheTag(cacheTags.products);
  cacheLife('hours');
  const products = await orEmpty(() => getCatalog().listProducts());
  return Object.fromEntries(
    products.flatMap((product) =>
      product.variants.flatMap((variant) => (variant.sku ? [[variant.sku, product.handle]] : [])),
    ),
  );
}

// Each builder with the product page it is on: the product that sells that range's pergolas.
export async function getPergolaPages(): Promise<PergolaPage[]> {
  const [builders, handles] = await Promise.all([getPergolaBuilders(), handlesBySku()]);
  return builders.flatMap((builder) => {
    const handle = structureSkus(builder)
      .map((sku) => sku && handles[sku])
      .find(Boolean);
    return handle ? [{ builder, path: productPath(handle) }] : [];
  });
}

export async function getPergolaPage(slug: string): Promise<PergolaPage | null> {
  return (await getPergolaPages()).find((page) => page.builder.slug === slug) ?? null;
}

const otherFrom = ({ builder, path }: PergolaPage): OtherBuilder => {
  const biggest = [...builder.sizes].sort((a, b) => b.width * b.depth - a.width * a.depth)[0];
  return {
    path,
    range: builder.range,
    biggest: biggest?.label ?? '',
    area: biggest ? biggest.width * biggest.depth : 0,
  };
};

// The builder for a pergola's own product page, found by the product's SKUs, with the other ranges.
export async function getPergolaForProduct(skus: string[]) {
  const pages = await getPergolaPages();
  const page = pages.find(({ builder }) =>
    structureSkus(builder).some((sku) => sku && skus.includes(sku)),
  );
  if (!page) return null;
  const catalogue = await getPergolaCatalogue();
  return {
    builder: page.builder,
    catalogue,
    others: pages.filter((other) => other !== page).map(otherFrom),
  };
}

// The pergola pages an add-on such as a screen or heater is chosen on.
export async function getPergolaPagesUsing(skus: string[]): Promise<PergolaPage[]> {
  return (await getPergolaPages()).filter(({ builder }) =>
    skusOf(builder).some((sku) => sku && skus.includes(sku)),
  );
}

// What the assistant knows about every builder, for its site knowledge.
export async function getPergolaGuides(): Promise<string[]> {
  const [pages, catalogue] = await Promise.all([getPergolaPages(), getPergolaCatalogue()]);
  return pages.map(({ builder, path }) => builderGuide(asRules(builder), catalogue, path));
}
