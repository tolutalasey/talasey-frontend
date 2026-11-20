import { z } from 'zod';

const text = z.string().trim().min(1);
const optional = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);

// "Pages" in /content: plain pages such as About, Careers and the policies.
export const plainPageSchema = z.object({
  title: text,
  slug: text,
  intro: optional,
  photo: z
    .object({
      src: text,
      alt: z.string().default(''),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .nullish(),
  body: text,
  actions: z.array(z.object({ label: text, href: text })).default([]),
  placeholder: z.boolean().default(false),
  seo: z.object({ title: text, description: text }),
});

export type PlainPage = z.infer<typeof plainPageSchema>;
export type PlainPageInput = z.input<typeof plainPageSchema>;

export const plainPagePath = (page: Pick<PlainPage, 'slug'>) => `/${page.slug}/`;
