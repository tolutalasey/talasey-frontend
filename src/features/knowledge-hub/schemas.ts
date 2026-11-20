import { z } from 'zod';

export const DOCUMENT_KINDS = [
  'Installation & Technical Guides',
  'Specification Sheets',
  'Safety Data Sheets',
  'Declaration of Performance',
  'Comparison Charts',
] as const;

export const DOCUMENT_RANGES = [
  'Artificial Grass',
  'Cleaners',
  'Composite Products',
  'Finishing Touches',
  'Installation',
  'Natural Stone',
  'Porcelain',
  'Sealers',
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];
export type DocumentRange = (typeof DOCUMENT_RANGES)[number];

const list = <T extends z.ZodType>(item: T) =>
  z
    .array(item)
    .nullish()
    .transform((value) => value ?? []);

const photo = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const hubDocumentSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(DOCUMENT_KINDS),
  file: z.string().min(1),
  thumbnail: photo.nullish(),
  ranges: list(z.enum(DOCUMENT_RANGES)),
  products: list(z.string()),
  publishedOn: z.string(),
});

export const videoSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  youtube: z.string().regex(/^[\w-]{11}$/),
  summary: z.string().nullish(),
  ranges: list(z.enum(DOCUMENT_RANGES)),
  products: list(z.string()),
  publishedOn: z.string(),
});

export type HubDocument = z.infer<typeof hubDocumentSchema>;
export type Video = z.infer<typeof videoSchema>;
