import { z } from 'zod';

export const NEWS_CATEGORIES = [
  'Company Updates',
  'Educational',
  'Inspirational',
  'Competitions & Awards',
  'New Appointments',
  'Training',
  'Case Studies',
  'Events',
  'Tips & Advice',
  'Interviews',
  'Product Updates',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

const photo = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const newsPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  categories: z
    .array(z.enum(NEWS_CATEGORIES))
    .nullish()
    .transform((value) => value ?? []),
  excerpt: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  body: z.string().min(1),
  photo: photo.nullish(),
});

export type NewsPost = z.infer<typeof newsPostSchema>;
