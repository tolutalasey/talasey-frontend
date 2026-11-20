import { slugify } from '@/lib/slug';
import { finderContentSchema } from './content';

export type PriceLean = 'lower' | 'any' | 'higher';
export type QuestionKey = 'project' | 'look' | 'colour' | 'upkeep' | 'budget';

export interface FinderAnswer {
  value: string;
  label: string;
  hint: string | null;
  ranges: string[];
  words: string[];
  price: PriceLean;
  reason: string | null;
}

export interface FinderQuestion {
  key: QuestionKey;
  title: string;
  answers: FinderAnswer[];
}

export interface ProductFinder {
  heading: string;
  intro: string;
  questions: FinderQuestion[];
  seo: { title: string; description: string };
}

interface AnswerInput {
  label: string;
  hint: string | null;
  ranges?: string[];
  words?: string[];
  price?: PriceLean;
  reason?: string | null;
}

const answer = (input: AnswerInput): FinderAnswer => ({
  value: slugify(input.label),
  label: input.label,
  hint: input.hint,
  ranges: input.ranges ?? [],
  words: input.words ?? [],
  price: input.price ?? 'any',
  reason: input.reason ?? null,
});

// The questions are fixed; what each answer says and favours comes from /content.
export function toFinder(content: unknown): ProductFinder | null {
  const parsed = finderContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const data = parsed.data;
  return {
    heading: data.heading,
    intro: data.intro,
    questions: [
      { key: 'project', title: 'What are you planning?', answers: data.projects.map(answer) },
      { key: 'look', title: 'Which look do you like?', answers: data.looks.map(answer) },
      {
        key: 'colour',
        title: 'Which colours suit your garden?',
        answers: data.colours.map(answer),
      },
      {
        key: 'upkeep',
        title: 'How much upkeep are you happy with?',
        answers: data.upkeep.map(answer),
      },
      { key: 'budget', title: 'What sort of budget?', answers: data.budgets.map(answer) },
    ],
    seo: data.seo,
  };
}
