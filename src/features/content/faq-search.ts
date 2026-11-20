import type { Faq, HelpTopic } from './schemas';

const words = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);

const stem = (word: string) => (word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word);

// Questions whose wording holds every word searched for, best matches (in the question) first.
export function searchFaqs(groups: { topic: HelpTopic; faqs: Faq[] }[], query: string) {
  const wanted = words(query).map(stem);
  if (wanted.length === 0) return [];
  const has = (text: string, word: string) => words(text).some((w) => stem(w).startsWith(word));
  return groups
    .flatMap(({ topic, faqs }) => faqs.map((faq) => ({ topic, faq })))
    .filter(({ faq }) => wanted.every((word) => has(`${faq.question} ${faq.answer}`, word)))
    .map((hit) => ({ ...hit, score: wanted.filter((word) => has(hit.faq.question, word)).length }))
    .sort((a, b) => b.score - a.score);
}

export type FaqHit = ReturnType<typeof searchFaqs>[number];
