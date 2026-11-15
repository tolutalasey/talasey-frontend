import { FACETS, valueSlug, type Facet } from './facets';
import {
  DEFAULT_PAGE_SIZE,
  type FacetCount,
  type FilterValues,
  type ProductSearch,
  type SearchRequest,
  type SearchResult,
  type SearchScope,
  type Sort,
  type Suggestion,
} from './product-search';
import type { SearchRecord } from './record';
import { allowedTypos, alternativesFor, editDistance, normalise, words } from './text';

interface IndexedRecord {
  record: SearchRecord;
  // Each word once, with the weight of the most important field it appears in.
  words: Map<string, number>;
  title: string;
}

const FIELD_WEIGHTS = { title: 4, brand: 3, category: 3, option: 2, sku: 3, description: 1 };

const EXACT = 3;
const PREFIX = 2;
const TYPO = 1;

function indexWords(record: SearchRecord): Map<string, number> {
  const weighted = new Map<string, number>();
  const add = (text: string | null, weight: number) => {
    if (!text) return;
    for (const word of words(text)) weighted.set(word, Math.max(weighted.get(word) ?? 0, weight));
  };
  add(record.title, FIELD_WEIGHTS.title);
  add(record.brand, FIELD_WEIGHTS.brand);
  record.categoryNames.forEach((name) => add(name, FIELD_WEIGHTS.category));
  Object.values(record.options)
    .flat()
    .forEach((value) => add(value, FIELD_WEIGHTS.option));
  record.skus.forEach((sku) => add(sku, FIELD_WEIGHTS.sku));
  add(record.description, FIELD_WEIGHTS.description);
  return weighted;
}

function matchQuality(queryWord: string, word: string, isLast: boolean, typos: number): number {
  if (word === queryWord) return EXACT;
  if ((isLast || queryWord.length >= 3) && word.startsWith(queryWord)) return PREFIX;
  return typos > 0 && editDistance(queryWord, word, typos) <= typos ? TYPO : 0;
}

interface WordMatch {
  score: number;
  typo: boolean;
}

// The best match any of the record's words gives one query word. Synonyms must be spelt right:
// a typo is only forgiven in the word the shopper typed.
function wordMatch(entry: IndexedRecord, queryWord: string, isLast: boolean): WordMatch {
  let best: WordMatch = { score: 0, typo: false };
  for (const alternative of alternativesFor(queryWord)) {
    const typos = alternative === queryWord ? allowedTypos(queryWord) : 0;
    for (const [word, weight] of entry.words) {
      const quality = matchQuality(alternative, word, isLast, typos);
      const score = quality * weight;
      if (score > best.score) best = { score, typo: quality === TYPO };
    }
  }
  return best;
}

function inScope({ record, title }: IndexedRecord, scope: SearchScope | undefined): boolean {
  if (!scope) return true;
  const byCategory = scope.categories?.some((handle) => record.categories.includes(handle));
  const byTitle = scope.titleIncludes?.some((text) => title.includes(normalise(text)));
  const byHandle = scope.handles?.includes(record.handle);
  return Boolean(byCategory || byTitle || byHandle);
}

const matchesFacet = (record: SearchRecord, facet: Facet, selected: string[]) =>
  selected.length === 0 ||
  facet.valuesOf(record).some((value) => selected.includes(valueSlug(value)));

function matchesFilters(record: SearchRecord, filters: FilterValues, skip?: string): boolean {
  return FACETS.every(
    (facet) => facet.id === skip || matchesFacet(record, facet, filters[facet.id] ?? []),
  );
}

// Each facet is counted against the other facets' filters, so people can see what choosing
// another value of the same facet would give them.
function countFacets(records: SearchRecord[], filters: FilterValues): FacetCount[] {
  return FACETS.flatMap((facet) => {
    const selected = filters[facet.id] ?? [];
    const counts = new Map<string, number>();
    for (const record of records) {
      if (!matchesFilters(record, filters, facet.id)) continue;
      for (const value of new Set(facet.valuesOf(record))) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    if (counts.size === 0) return [];
    return [
      {
        id: facet.id,
        label: facet.label,
        values: [...counts]
          .map(([value, count]) => ({
            value,
            slug: valueSlug(value),
            label: facet.labelFor?.(value) ?? value,
            count,
            selected: selected.includes(valueSlug(value)),
          }))
          .sort(
            facet.id === 'price'
              ? () => 0
              : (a, b) => b.count - a.count || a.label.localeCompare(b.label),
          ),
      },
    ];
  });
}

const byPrice = (direction: 1 | -1) => (a: SearchRecord, b: SearchRecord) => {
  if (a.priceFrom === null) return b.priceFrom === null ? 0 : 1;
  if (b.priceFrom === null) return -1;
  return (a.priceFrom - b.priceFrom) * direction;
};

const SORTERS: Record<Exclude<Sort, 'relevance'>, (a: SearchRecord, b: SearchRecord) => number> = {
  'price-low': byPrice(1),
  'price-high': byPrice(-1),
  name: (a, b) => a.title.localeCompare(b.title),
};

export class LocalProductSearch implements ProductSearch {
  readonly name = 'local';
  private readonly entries: IndexedRecord[];

  constructor(records: SearchRecord[]) {
    this.entries = records.map((record) => ({
      record,
      words: indexWords(record),
      title: normalise(record.title),
    }));
  }

  async search({
    query = '',
    scope,
    filters = {},
    sort = 'relevance',
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  }: SearchRequest): Promise<SearchResult> {
    const scoped = this.entries.filter((entry) => inScope(entry, scope));
    const { ranked, partialMatch } = this.rank(scoped, words(query));
    const facets = countFacets(ranked, filters);
    const filtered = ranked.filter((record) => matchesFilters(record, filters));
    const sorted = sort === 'relevance' ? filtered : [...filtered].sort(SORTERS[sort]);

    const prices = filtered.flatMap((record) =>
      record.priceFrom === null ? [] : [record.priceFrom],
    );
    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const current = Math.min(Math.max(1, page), pageCount);
    return {
      hits: sorted.slice((current - 1) * pageSize, current * pageSize),
      total: sorted.length,
      page: current,
      pageCount,
      facets,
      priceRange: prices.length > 0 ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
      partialMatch,
    };
  }

  async suggest(query: string, limit = 6): Promise<Suggestion[]> {
    if (normalise(query).length < 2) return [];
    const { ranked, partialMatch } = this.rank(this.entries, words(query));
    if (partialMatch) return [];
    return ranked.slice(0, limit).map(({ handle, title, priceFrom, thumbnail }) => ({
      handle,
      title,
      priceFrom,
      thumbnail,
    }));
  }

  // Every query word must match; when nothing matches them all, any word will do.
  private rank(entries: IndexedRecord[], queryWords: string[]) {
    if (queryWords.length === 0) {
      return { ranked: entries.map((entry) => entry.record), partialMatch: false };
    }
    const rows = entries.map((entry) => ({
      entry,
      matches: queryWords.map((word, index) =>
        wordMatch(entry, word, index === queryWords.length - 1),
      ),
    }));
    // As with Algolia's minimum typo setting: when a word is found as typed, near spellings of it
    // are left out, so "light" does not also bring back "eight".
    const spelledRight = queryWords.map((_, index) =>
      rows.some(({ matches }) => matches[index]?.score && !matches[index]?.typo),
    );
    const scored = rows.map(({ entry, matches }) => ({
      entry,
      scores: matches.map(({ score, typo }, index) => (typo && spelledRight[index] ? 0 : score)),
    }));
    const all = scored.filter(({ scores }) => scores.every((score) => score > 0));
    const partialMatch = all.length === 0;
    const matched = partialMatch ? scored.filter(({ scores }) => scores.some((s) => s > 0)) : all;
    const ranked = matched
      .map(({ entry, scores }) => ({ entry, total: scores.reduce((sum, s) => sum + s, 0) }))
      .sort((a, b) => b.total - a.total || a.entry.title.localeCompare(b.entry.title))
      .map(({ entry }) => entry.record);
    return { ranked, partialMatch };
  }
}
