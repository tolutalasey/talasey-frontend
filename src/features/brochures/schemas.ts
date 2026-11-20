import { z } from 'zod';

export const ACKNOWLEDGEMENT_RANGES = [
  'Porcelain',
  'Natural stone',
  'Composite',
  'Artificial grass',
] as const;

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

export const brochureSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  edition: z.coerce.number().int().positive(),
  summary: z.string().min(1),
  link: z.string().nullish(),
  cover: photo.nullish(),
});

export const acknowledgementSchema = z.object({
  slug: z.string().min(1),
  company: z.string().min(1),
  about: z.string().nullish(),
  product: z.string().min(1),
  range: z.enum(ACKNOWLEDGEMENT_RANGES),
  page: z.coerce.number().int().positive().nullish(),
  // /content keeps each photo in a row of its own.
  photos: list(z.union([photo, z.object({ photo }).transform((row) => row.photo)])),
});

export type Brochure = z.infer<typeof brochureSchema>;
export type Acknowledgement = z.infer<typeof acknowledgementSchema>;
