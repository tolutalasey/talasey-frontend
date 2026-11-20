import { z } from 'zod';

const text = z.string().trim();
const optional = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);
const commaList = z
  .string()
  .nullish()
  .transform((value) =>
    (value ?? '')
      .split(',')
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean),
  );

const wordAnswer = z.object({ label: text, hint: optional, words: commaList, reason: optional });

export const PRICE_LEANS = ['lower', 'any', 'higher'] as const;

// "Product finder" in /content: the answers to each question and what each one favours.
export const finderContentSchema = z.object({
  heading: text,
  intro: text,
  projects: z.array(z.object({ label: text, hint: optional, ranges: commaList })).min(2),
  looks: z.array(wordAnswer).min(2),
  colours: z.array(wordAnswer).min(2),
  upkeep: z.array(wordAnswer).min(2),
  budgets: z
    .array(z.object({ label: text, hint: optional, price: z.enum(PRICE_LEANS), reason: optional }))
    .min(2),
  seo: z.object({ title: text, description: text }),
});

export type FinderContent = z.input<typeof finderContentSchema>;
