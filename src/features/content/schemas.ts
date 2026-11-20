import { z } from 'zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const seoSchema = z.object({
  title: z.string().min(30).max(60),
  description: z.string().min(70).max(160),
});

export const faqSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });
export type Faq = z.infer<typeof faqSchema>;

// Copy written to show a template before the content team has written or approved the real
// thing. Such a page is noindex and stays out of the sitemap.
const placeholder = z.boolean().default(false);

export const brandPageSchema = z.object({
  slug,
  name: z.string().min(1),
  h1: z.string().min(1),
  intro: z.string().min(1),
  story: z.array(z.string()).default([]),
  facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  points: z.array(z.string()).default([]),
  ranges: z.array(slug).default([]),
  faqs: z.array(faqSchema).default([]),
  placeholder,
  seo: seoSchema,
});
export type BrandPage = z.infer<typeof brandPageSchema>;

export const projectPageSchema = brandPageSchema.extend({
  steps: z.array(z.string()).default([]),
});
export type ProjectPage = z.infer<typeof projectPageSchema>;

export const GUIDE_TOPICS = ['Planning', 'Buying', 'Laying', 'Care'] as const;

export const guideSchema = z.object({
  slug,
  title: z.string().min(1),
  topic: z.enum(GUIDE_TOPICS),
  answer: z.string().min(1),
  steps: z.array(z.string()).default([]),
  body: z.array(z.string()).default([]),
  products: z.array(z.string()).default([]),
  mainPage: z.string().nullish(),
  faqs: z.array(faqSchema).default([]),
  author: z.object({
    name: z.string(),
    role: z.string().nullish(),
    // A named person with a profile page, as the PRD asks, or the team while there is none.
    isPerson: z.boolean().default(true),
  }),
  publishedOn: z.iso.date(),
  reviewedOn: z.iso.date().nullish(),
  placeholder,
  seo: seoSchema,
});
export type Guide = z.infer<typeof guideSchema>;

export const inspirationSchema = z.object({
  slug,
  title: z.string().min(1),
  town: z.string().nullish(),
  style: z.string().nullish(),
  space: z.string().nullish(),
  categories: z.array(z.string()).default([]),
  colours: z.array(z.string()).default([]),
  products: z.array(z.string()).default([]),
  photo: z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  }),
});
export type Inspiration = z.infer<typeof inspirationSchema>;

export const HELP_TOPICS = [
  { slug: 'delivery', name: 'Delivery', faqTopic: 'Delivery' },
  { slug: 'returns', name: 'Returns and refunds', faqTopic: 'Returns' },
  { slug: 'laying', name: 'Laying and installing', faqTopic: 'Laying' },
  { slug: 'care', name: 'Care and cleaning', faqTopic: 'Care' },
  { slug: 'finance', name: 'Paying and finance', faqTopic: 'Finance' },
  { slug: 'samples', name: 'Samples', faqTopic: 'Samples' },
] as const;
export type HelpTopic = (typeof HELP_TOPICS)[number];
