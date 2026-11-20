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
  // Set in /admin: the one option this photo shows, such as Colour: Kandla Grey.
  shows: z.object({ option: z.string(), value: z.string() }).nullish(),
});

export const productContentSchema = z.object({
  photos: z.array(photo).default([]),
  completeTheJob: z.array(z.object({ handle: z.string(), reason: z.string() })).default([]),
  documents: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
  // Replaces the product's own description under its name.
  description: z.string().nullish(),
  features: z.array(z.string()).default([]),
  // The words on each colour's own page, for a product sold in several colours.
  colours: z
    .array(
      z.object({
        colour: z.string(),
        description: z.string().nullish(),
        features: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  warranty: z.string().nullish(),
  installation: z.string().nullish(),
  care: z.string().nullish(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  soldAs: z.string().nullish(),
  suits: z.array(z.string()).default([]),
});

export type ProductContent = z.infer<typeof productContentSchema>;
export type ProductPhoto = ProductContent['photos'][number];

export const emptyProductContent: ProductContent = {
  photos: [],
  completeTheJob: [],
  documents: [],
  features: [],
  colours: [],
  faqs: [],
  suits: [],
};

// What the content team publishes for a product in /content ("Product extras").
export const productExtrasSchema = productContentSchema
  .omit({ photos: true })
  .extend({ product: z.string() });

export type ProductExtras = z.infer<typeof productExtrasSchema>;

const filled = (value: unknown) =>
  Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== '';

function entryFor(handle: string, entries: unknown[]): ProductExtras | undefined {
  return entries
    .map((entry) => productExtrasSchema.safeParse(entry))
    .find((parsed) => parsed.success && parsed.data.product === handle)?.data;
}

// What is published in /content wins, field by field, over the built-in words copied from the
// current site.
export function extrasFor(
  handle: string,
  published: unknown[],
  builtIn: unknown[] = [],
): Omit<ProductContent, 'photos'> {
  const own = entryFor(handle, published);
  const base = entryFor(handle, builtIn);
  if (!own && !base) return emptyProductContent;
  const merged: Record<string, unknown> = { ...emptyProductContent, ...base };
  for (const [key, value] of Object.entries(own ?? {})) {
    if (filled(value)) merged[key] = value;
  }
  const { product: _product, ...content } = merged;
  return content as Omit<ProductContent, 'photos'>;
}
