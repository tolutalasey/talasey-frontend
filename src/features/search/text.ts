import { slugify } from '@/lib/slug';

// Text matching for the local search: plain words, light stemming, synonyms and typo tolerance
// in the same spirit as Algolia's defaults (one typo from 4 letters, two from 8).
const SYNONYM_GROUPS = [
  ['paving', 'slab', 'flag', 'patio', 'tile', 'paver'],
  ['decking', 'deck', 'board'],
  ['lighting', 'light', 'lamp'],
  ['jointing', 'grout', 'pointing', 'joint'],
  ['weathered', 'corten', 'rusted', 'rust'],
  ['screen', 'panel'],
  ['fence', 'fencing'],
  ['planter', 'pot'],
  ['pergola', 'gazebo'],
  ['cleaner', 'cleaning'],
  ['sealer', 'sealant'],
  ['riser', 'pedestal'],
  ['firepit', 'fire'],
];

const COMPOUNDS: [RegExp, string][] = [
  [/\bfire\s?pits?\b/g, 'firepit'],
  [/\bfirepits\b/g, 'firepit'],
];

const synonymsByWord = new Map<string, string[]>(
  SYNONYM_GROUPS.flatMap((group) => group.map((word) => [word, group] as [string, string[]])),
);

export function normalise(text: string): string {
  let result = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/×/g, ' x ')
    .replace(/[^a-z0-9]+/g, ' ');
  for (const [pattern, replacement] of COMPOUNDS) result = result.replace(pattern, replacement);
  return result.trim();
}

export function stem(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export const words = (text: string): string[] =>
  normalise(text).split(' ').filter(Boolean).map(stem);

export const alternativesFor = (word: string): string[] => synonymsByWord.get(word) ?? [word];

export function allowedTypos(word: string): number {
  if (/\d/.test(word) || word.length < 4) return 0;
  return word.length < 8 ? 1 : 2;
}

// Optimal string alignment distance: insertions, deletions, substitutions and swapped letters.
// Stops early once every path is over the limit.
export function editDistance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const width = b.length + 1;
  const cells = new Array<number>((a.length + 1) * width).fill(0);
  const cell = (i: number, j: number) => cells[i * width + j] ?? 0;
  for (let j = 0; j <= b.length; j++) cells[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cells[i * width] = i;
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(cell(i - 1, j) + 1, cell(i, j - 1) + 1, cell(i - 1, j - 1) + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, cell(i - 2, j - 2) + 1);
      }
      cells[i * width + j] = value;
      best = Math.min(best, value);
    }
    if (best > limit) return limit + 1;
  }
  return cell(a.length, b.length);
}

export { slugify };
