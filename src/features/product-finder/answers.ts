import { areaFrom } from '@/lib/coverage';
import type { FinderAnswer, ProductFinder, QuestionKey } from './finder';

type Params = Record<string, string | string[] | undefined>;

export const AREA_PARAM = 'area';

export interface FinderAnswers {
  chosen: Partial<Record<QuestionKey, FinderAnswer>>;
  areaM2: number | null;
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// Answers come from the query string, so results can be shared and work without JavaScript.
// Anything that isn't one of the answers on offer is ignored.
export function readAnswers(finder: ProductFinder, params: Params): FinderAnswers {
  const chosen: FinderAnswers['chosen'] = {};
  for (const question of finder.questions) {
    const value = first(params[question.key]);
    const match = question.answers.find((option) => option.value === value);
    if (match) chosen[question.key] = match;
  }
  return { chosen, areaM2: areaFrom(first(params[AREA_PARAM])) };
}

export const hasAnswers = (answers: FinderAnswers) => Object.keys(answers.chosen).length > 0;
