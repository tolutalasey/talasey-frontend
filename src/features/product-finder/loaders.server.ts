import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { getRanges, rangePath } from '@/features/catalogue';
import { getSearchRecords } from '@/features/search';
import { cacheTags } from '@/lib/cache-tags';
import { publishedContent } from '@/lib/content';
import type { FinderAnswers } from './answers';
import { defaultFinder } from './defaults';
import { toFinder, type ProductFinder } from './finder';
import { recommend, type Recommendation } from './recommend';

export async function getProductFinder(): Promise<ProductFinder> {
  'use cache';
  cacheTag(cacheTags.productFinder);
  cacheLife('days');
  const [published] = await publishedContent('product-finder');
  const finder = (published ? toFinder(published) : null) ?? toFinder(defaultFinder);
  if (!finder) throw new Error('The built-in product finder answers are invalid');
  return finder;
}

export interface FinderResults {
  recommendations: Recommendation[];
  ranges: { name: string; path: string }[];
}

export async function getFinderResults(answers: FinderAnswers): Promise<FinderResults> {
  const [ranges, records] = await Promise.all([getRanges(), getSearchRecords()]);
  const wanted = new Set(answers.chosen.project?.ranges ?? []);
  const chosenRanges = ranges.filter((range) => wanted.has(range.slug));
  return {
    recommendations: recommend(
      records,
      chosenRanges.map((range) => range.scope),
      answers,
    ),
    ranges: chosenRanges.map((range) => ({ name: range.name, path: rangePath(range) })),
  };
}
