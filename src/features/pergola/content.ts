import { z } from 'zod';
import type { PergolaRules } from './rules';

const text = z.string().trim();
const optional = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);
const count = z.coerce.number().int().positive().nullish().catch(null);

export const pergolaContentSchema = z.object({
  slug: text,
  range: text,
  intro: text,
  roof: text,
  lighting: text,
  sizes: z.array(
    z.object({
      label: text,
      width: z.coerce.number(),
      depth: z.coerce.number(),
      freeStandingSku: text,
      wallMountedSku: text,
      freeStandingSize: optional,
      wallMountedSize: optional,
      lightingKitSku: optional,
    }),
  ),
  sides: z
    .array(
      z.object({
        name: text,
        kind: text,
        sku3m: optional,
        sku4m: optional,
        verticalSku3m: optional,
        verticalSku4m: optional,
        panels3m: count,
        panels4m: count,
      }),
    )
    .default([]),
  heaterSku: optional,
  messages: z.array(text).default([]),
  details: z.array(z.object({ heading: text, text })).default([]),
  seo: z.object({ title: text, description: text }),
});

export type PergolaContent = z.infer<typeof pergolaContentSchema>;

// The parsed content is the rules both builders read.
export const asRules = (content: PergolaContent): PergolaRules => content;
