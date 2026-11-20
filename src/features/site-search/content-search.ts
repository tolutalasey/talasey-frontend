import { alternativesFor, allowedTypos, editDistance, words } from '@/features/search';

export type ContentKind = 'range' | 'document' | 'video' | 'guide' | 'page';

export interface ContentEntry {
  kind: ContentKind;
  title: string;
  text: string;
  href: string;
  label?: string;
}

export const CONTENT_GROUPS: { kind: ContentKind; heading: string }[] = [
  { kind: 'range', heading: 'Ranges' },
  { kind: 'document', heading: 'Documents' },
  { kind: 'video', heading: 'Videos' },
  { kind: 'guide', heading: 'Articles and guides' },
  { kind: 'page', heading: 'Pages' },
];

const PER_GROUP = 6;

const matchesWord = (wanted: string, have: string[]) =>
  alternativesFor(wanted).some((option) =>
    have.some(
      (word) =>
        word.startsWith(option) ||
        (allowedTypos(option) > 0 &&
          editDistance(option, word, allowedTypos(option)) <= allowedTypos(option)),
    ),
  );

// Every word searched for is in the title or text, allowing a typo or two in longer words.
// Title matches come first.
export function searchContent(entries: ContentEntry[], query: string) {
  const wanted = words(query);
  if (wanted.length === 0) return [];
  const scored = entries.flatMap((entry) => {
    const title = words(entry.title);
    const all = [...title, ...words(entry.text)];
    if (!wanted.every((word) => matchesWord(word, all))) return [];
    const inTitle = wanted.filter((word) => matchesWord(word, title)).length;
    return [{ entry, score: inTitle }];
  });
  scored.sort((a, b) => b.score - a.score);
  return CONTENT_GROUPS.flatMap(({ kind, heading }) => {
    const found = scored.filter(({ entry }) => entry.kind === kind).map(({ entry }) => entry);
    return found.length > 0
      ? [{ kind, heading, total: found.length, entries: found.slice(0, PER_GROUP) }]
      : [];
  });
}

export type ContentGroup = ReturnType<typeof searchContent>[number];
