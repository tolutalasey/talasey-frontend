import type { ProductExtras } from './content';

// The words on one of the current site's product pages, copied before the launch.
export interface OldProductPage {
  slug: string;
  description: string;
  features: string[];
  documents: { title: string; url: string }[];
}

// Words the two sites spell differently or that say nothing about which product it is.
const SAME_AS: Record<string, string> = { fencing: 'fence' };
const IGNORED = new Set(['composite', 'patio', 'decorative', 'screen', 'dellaora', 'lighting']);

const wordsOf = (slug: string) =>
  slug
    .replace(/spot-light/g, 'spotlight')
    .split('-')
    .filter((word) => !/^\d+mm$/.test(word))
    .filter(Boolean)
    .map((word) => word.replace(/s$/, ''))
    .map((word) => SAME_AS[word] ?? word)
    .filter((word) => !IGNORED.has(word));

const containsAll = (whole: string[], part: string[]) => part.every((word) => whole.includes(word));

// How well an old page's words fit a product: every word of one is in the other, and they share
// at least two words or half the product's. Higher is closer.
function fit(oldWords: string[], productWords: string[]): number {
  if (!containsAll(oldWords, productWords) && !containsAll(productWords, oldWords)) return 0;
  const shared = oldWords.filter((word) => productWords.includes(word)).length;
  if (shared < 2 && shared * 2 < productWords.length) return 0;
  const extra = oldWords.length + productWords.length - 2 * shared;
  const sameStart = oldWords[0] === productWords[0] ? 1 : 0;
  return shared * 100 - extra * 2 + sameStart;
}

function closest(pages: OldProductPage[], productWords: string[], words = wordsOf) {
  let best: OldProductPage | undefined;
  let bestScore = 0;
  for (const page of pages) {
    const score = fit(words(page.slug), productWords);
    if (score > bestScore) [best, bestScore] = [page, score];
  }
  return best;
}

const uniqueDocuments = (documents: OldProductPage['documents']) =>
  documents.filter(
    (document, index) => documents.findIndex((other) => other.url === document.url) === index,
  );

// The current site's words for a product: its own page, or for a product sold in several colours,
// the page each colour had.
export function oldWordingFor(
  handle: string,
  colours: string[],
  pages: OldProductPage[],
): ProductExtras | null {
  const productWords = wordsOf(handle);
  const colourWords = colours.map((colour) =>
    wordsOf(colour.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  );
  const byColour = colours.flatMap((colour, index) => {
    const own = colourWords[index] ?? [];
    const withColour = pages.filter((page) => containsAll(wordsOf(page.slug), own));
    const page = closest(withColour, productWords, (slug) =>
      wordsOf(slug).filter((word) => !own.includes(word)),
    );
    return page ? [{ colour, page }] : [];
  });
  // A colour's page describes that colour, so it never stands in for the whole product.
  const own = closest(
    pages.filter((page) => !byColour.some((match) => match.page === page)),
    productWords,
  );
  const found = [...(own ? [own] : []), ...byColour.map(({ page }) => page)];
  if (found.length === 0) return null;
  const first = own ?? byColour[0]?.page;
  return {
    product: handle,
    description: own?.description || null,
    features: first?.features ?? [],
    documents: uniqueDocuments(found.flatMap((page) => page.documents)),
    colours: byColour.map(({ colour, page }) => ({
      colour,
      description: page.description || null,
      features: page.features,
    })),
    completeTheJob: [],
    faqs: [],
    suits: [],
  };
}
