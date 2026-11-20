import { z } from 'zod';

const text = z.string().trim();
const millimetres = z.coerce.number().int().positive();
const optional = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);

// "Fence builders" in /content: the parts a fence kit is made of, by product web address.
export const fenceBuilderSchema = z.object({
  slug: text,
  name: text,
  intro: text,
  bayWidth: millimetres,
  boardCounts: z.array(z.coerce.number().int().positive()).min(1),
  styles: z.array(z.object({ name: text, boardProduct: text, boardHeight: millimetres })).min(1),
  posts: z.array(z.object({ name: text, product: text, maxHeight: millimetres })).min(1),
  trimProduct: optional,
  toppers: z.array(z.object({ name: text, product: text, height: millimetres })).default([]),
  postExtras: z.array(z.object({ name: text, product: text, withProduct: optional })).default([]),
  details: z.array(z.object({ heading: text, text })).default([]),
  seo: z.object({ title: text, description: text }),
});

export type FenceBuilder = z.infer<typeof fenceBuilderSchema>;
