import { z } from 'zod';

const photo = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  // Show this photo when these options are chosen; empty means it suits every option.
  size: z.string().nullish(),
  finish: z.string().nullish(),
  colour: z.string().nullish(),
});

export const productContentSchema = z.object({
  photos: z.array(photo).default([]),
  completeTheJob: z.array(z.object({ handle: z.string(), reason: z.string() })).default([]),
  documents: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
  features: z.array(z.string()).default([]),
  warranty: z.string().nullish(),
});

export type ProductContent = z.infer<typeof productContentSchema>;
export type ProductPhoto = ProductContent['photos'][number];

export const emptyProductContent: ProductContent = {
  photos: [],
  completeTheJob: [],
  documents: [],
  features: [],
};

// What the content team publishes for a product in /content ("Product extras").
export const productExtrasSchema = productContentSchema
  .omit({ photos: true })
  .extend({ product: z.string() });

export type ProductExtras = z.infer<typeof productExtrasSchema>;

export function extrasFor(handle: string, published: unknown[]): Omit<ProductContent, 'photos'> {
  const extras = published
    .map((entry) => productExtrasSchema.safeParse(entry))
    .find((parsed) => parsed.success && parsed.data.product === handle)?.data;
  if (!extras) return emptyProductContent;
  const { product: _product, ...content } = extras;
  return content;
}
