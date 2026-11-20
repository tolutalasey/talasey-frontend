import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cacheTags } from '@/lib/cache-tags';
import { getCatalog, orEmpty } from '@/lib/commerce';
import { publishedContent } from '@/lib/content';
import { fenceBuilderSchema, type FenceBuilder } from './content';
import type { FenceCatalogue } from './rules';

export async function getFenceBuilders(): Promise<FenceBuilder[]> {
  'use cache';
  cacheTag(cacheTags.fenceBuilders);
  cacheLife('days');
  return (await publishedContent('fence-builder')).flatMap((entry) => {
    const parsed = fenceBuilderSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getFenceBuilder(slug: string): Promise<FenceBuilder | null> {
  return (await getFenceBuilders()).find((builder) => builder.slug === slug) ?? null;
}

const handlesOf = (builder: FenceBuilder) =>
  new Set(
    [
      ...builder.styles.map((style) => style.boardProduct),
      ...builder.posts.map((post) => post.product),
      builder.trimProduct,
      ...builder.toppers.map((topper) => topper.product),
      ...builder.postExtras.flatMap((extra) => [extra.product, extra.withProduct]),
    ].filter((handle): handle is string => Boolean(handle)),
  );

// The builder's products that are on the shop, with every version that has a price.
export async function getFenceCatalogue(builder: FenceBuilder): Promise<FenceCatalogue> {
  'use cache';
  cacheTag(cacheTags.products, cacheTags.fenceBuilders);
  cacheLife('hours');
  const wanted = handlesOf(builder);
  const products = await orEmpty(() => getCatalog().listProducts());
  return Object.fromEntries(
    products
      .filter((product) => wanted.has(product.handle))
      .map((product) => [
        product.handle,
        {
          title: product.title,
          variants: product.variants.flatMap((variant) =>
            variant.priceIncVat
              ? [
                  {
                    id: variant.id,
                    title: variant.title,
                    colour: variant.options.Colour ?? null,
                    pricePence: Math.round(variant.priceIncVat.amount * 100),
                  },
                ]
              : [],
          ),
        },
      ]),
  );
}

// The builder for a fence board's own product page, opened on that board's style.
export async function getFenceForProduct(handle: string) {
  const builders = await getFenceBuilders();
  const builder = builders.find((candidate) =>
    candidate.styles.some((style) => style.boardProduct === handle),
  );
  if (!builder) return null;
  return {
    builder,
    catalogue: await getFenceCatalogue(builder),
    startStyle: builder.styles.findIndex((style) => style.boardProduct === handle),
  };
}
