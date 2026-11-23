import { z } from 'zod';
import pages from './old-range-pages.json';
import type { Range } from './ranges';

const UPLOADS = 'https://talasey.co.uk/wp-content/uploads/';

const oldPages = z
  .record(
    z.string(),
    z.object({
      description: z.string().optional(),
      photos: z.array(z.tuple([z.string(), z.number(), z.number()])).default([]),
      closing: z.string().optional(),
    }),
  )
  .parse(pages);

// The words and photos each menu page had on the current site, until /content says otherwise.
export function withCurrentSiteWords(range: Range): Range {
  const old = oldPages[range.slug];
  if (!old) return range;
  const slides = old.photos.map(([file, width, height]) => ({
    src: `${UPLOADS}${file}`,
    alt: range.name,
    width,
    height,
  }));
  return {
    ...range,
    description: range.description || old.description || null,
    slides: range.slides?.length ? range.slides : slides,
    closing: range.closing || old.closing || null,
  };
}
