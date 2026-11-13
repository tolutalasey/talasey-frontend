import 'server-only';
import type { z } from 'zod';
import { storedGuideSchema, storedPageSchema } from './loaders.server';
import type { BrandPage, Guide } from './schemas';

export type ContentPreview =
  | { kind: 'guide'; guide: Guide }
  | { kind: 'page'; page: BrandPage }
  | { kind: 'not-ready'; problems: string[] }
  | { kind: 'no-template' };

const problemsOf = (error: z.ZodError) =>
  error.issues.map((issue) => `${issue.path.join(' › ') || 'Page'}: ${issue.message}`);

// A draft drawn with the same templates the site uses, before it is published.
export function previewContent(type: string, draft: unknown): ContentPreview {
  if (type === 'guide') {
    const parsed = storedGuideSchema.safeParse(draft);
    return parsed.success
      ? { kind: 'guide', guide: parsed.data }
      : { kind: 'not-ready', problems: problemsOf(parsed.error) };
  }
  if (type === 'brand-page' || type === 'project-page') {
    const parsed = storedPageSchema.safeParse(draft);
    return parsed.success
      ? { kind: 'page', page: parsed.data }
      : { kind: 'not-ready', problems: problemsOf(parsed.error) };
  }
  return { kind: 'no-template' };
}
