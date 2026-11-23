import type { SearchRecord, SearchScope } from '@/features/search';
import type { FinderAnswers } from './answers';
import type { FinderAnswer } from './finder';

export interface Recommendation {
  record: SearchRecord;
  reasons: string[];
  // The product's colour that matched the colour answer, so its page opens on it.
  colour: string | null;
}

const RESULTS = 6;

const spaced = (value: string) =>
  ` ${value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()} `;

const mentions = (text: string, words: string[]) =>
  words.some((word) => text.includes(spaced(word)));

const inScope = (record: SearchRecord, scope: SearchScope) =>
  Boolean(
    scope.categories?.some((handle) => record.categories.includes(handle)) ||
    scope.titleIncludes?.some((part) => spaced(record.title).includes(spaced(part))) ||
    scope.handles?.includes(record.handle),
  );

const describe = (record: SearchRecord) =>
  spaced(
    [record.title, ...Object.values(record.options).flat(), ...record.categoryNames].join(' '),
  );

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)] ?? 0;
}

// In stock first, then available to order, then made to order, then what can't be bought now.
const stockRank = ({ availability }: SearchRecord) =>
  availability.includes('in-stock')
    ? 0
    : availability.includes('available')
      ? 1
      : availability.includes('made-to-order')
        ? 2
        : 3;

const priced = (record: SearchRecord): record is SearchRecord & { priceFrom: number } =>
  record.priceFrom !== null;

function priceSuits(answer: FinderAnswer, price: number, middle: number) {
  if (answer.price === 'lower') return price <= middle;
  if (answer.price === 'higher') return price >= middle;
  return false;
}

const matchedColour = (record: SearchRecord, answer: FinderAnswer | undefined) =>
  answer?.words.length
    ? ((record.options.Colour ?? []).find((colour) => mentions(spaced(colour), answer.words)) ??
      null)
    : null;

// Ranks the products in the chosen project's ranges by how many answers they match. Products
// that match nothing still show, so every answer set gets results.
export function recommend(
  records: SearchRecord[],
  scopes: SearchScope[],
  { chosen }: FinderAnswers,
): Recommendation[] {
  const pool = records
    .filter(priced)
    .filter((record) => scopes.length === 0 || scopes.some((scope) => inScope(record, scope)));
  const middle = median(pool.map((record) => record.priceFrom));
  const wordAnswers = [chosen.look, chosen.colour, chosen.upkeep].filter(
    (answer): answer is FinderAnswer => Boolean(answer?.words.length),
  );

  const ranked = pool.map((record) => {
    const text = describe(record);
    const matched = wordAnswers.filter((answer) => mentions(text, answer.words));
    const budget =
      chosen.budget && priceSuits(chosen.budget, record.priceFrom, middle) ? [chosen.budget] : [];
    const reasons = [...matched, ...budget].flatMap((answer) => answer.reason ?? []);
    return {
      record,
      reasons,
      score: matched.length + budget.length,
      colour: matchedColour(record, chosen.colour),
    };
  });

  const priceOrder = chosen.budget?.price === 'higher' ? -1 : 1;
  return ranked
    .sort(
      (a, b) =>
        b.score - a.score ||
        stockRank(a.record) - stockRank(b.record) ||
        Number(Boolean(b.record.thumbnail)) - Number(Boolean(a.record.thumbnail)) ||
        priceOrder * (a.record.priceFrom - b.record.priceFrom),
    )
    .slice(0, RESULTS)
    .map(({ record, reasons, colour }) => ({ record, reasons, colour }));
}
