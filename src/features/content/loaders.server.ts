import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import {
  fallbackBrands,
  fallbackFaqs,
  fallbackGuides,
  fallbackInspiration,
  fallbackProjects,
} from './fallback';
import {
  brandPageSchema,
  faqSchema,
  guideSchema,
  inspirationSchema,
  projectPageSchema,
  type BrandPage,
  type Faq,
  type Guide,
  type Inspiration,
  type ProjectPage,
} from './schemas';

const paragraphs = z
  .string()
  .nullish()
  .transform((text) => (text ? text.split(/\n\s*\n/).map((p) => p.trim()) : []));

const list = <T extends z.ZodType>(item: T) =>
  z
    .array(item)
    .nullish()
    .transform((value) => value ?? []);

// What is published in /content, with the built-in copy for anything not published yet: a
// published entry replaces the built-in one with the same key.
async function contentOr<T>(
  type: string,
  schema: z.ZodType<T>,
  fallback: T[],
  keyOf: (entry: T) => string,
  keep: (entry: T) => boolean = () => true,
): Promise<T[]> {
  const published = (await publishedContent(type)).flatMap((entry) => {
    const parsed = schema.safeParse(entry);
    return parsed.success && keep(parsed.data) ? [parsed.data] : [];
  });
  const keys = new Set(published.map(keyOf));
  return [...published, ...fallback.filter((entry) => !keys.has(keyOf(entry)))];
}

const bySlug = (entry: { slug: string }) => entry.slug;

export const storedPageSchema = brandPageSchema.extend({
  story: paragraphs,
  facts: list(z.object({ label: z.string(), value: z.string() })),
  points: list(z.string()),
  ranges: list(z.string()),
  faqs: list(faqSchema),
});

export const storedGuideSchema = guideSchema.extend({
  steps: list(z.string()),
  body: paragraphs,
  products: list(z.string()),
  faqs: list(faqSchema),
});

export async function getBrandPages(): Promise<BrandPage[]> {
  'use cache';
  cacheTag(cacheTags.brandPages);
  cacheLife('days');
  return contentOr('brand-page', storedPageSchema, fallbackBrands, bySlug);
}

export const storedProjectSchema = projectPageSchema.extend({
  ...storedPageSchema.shape,
  steps: list(z.string()),
});

export async function getProjectPages(): Promise<ProjectPage[]> {
  'use cache';
  cacheTag(cacheTags.projectPages);
  cacheLife('days');
  return contentOr('project-page', storedProjectSchema, fallbackProjects, bySlug);
}

export async function getGuides(): Promise<Guide[]> {
  'use cache';
  cacheTag(cacheTags.guides);
  cacheLife('days');
  const guides = await contentOr('guide', storedGuideSchema, fallbackGuides, bySlug);
  return [...guides].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export async function getInspiration(): Promise<Inspiration[]> {
  'use cache';
  cacheTag(cacheTags.inspiration);
  cacheLife('days');
  return contentOr(
    'inspiration',
    inspirationSchema.extend({ colours: list(z.string()), products: list(z.string()) }),
    fallbackInspiration,
    bySlug,
  );
}

export async function getFaqs(topic: string): Promise<Faq[]> {
  'use cache';
  cacheTag(cacheTags.faqs);
  cacheLife('days');
  return contentOr(
    'faq',
    faqSchema.extend({ topic: z.string() }),
    (fallbackFaqs[topic] ?? []).map((faq) => ({ ...faq, topic })),
    (faq) => faq.question,
    (faq) => faq.topic === topic,
  ).then((faqs) => faqs.map(({ question, answer }) => ({ question, answer })));
}
