// Finds the current talasey.co.uk product page a new product came from, by the words in their web
// addresses, and the page each of its colours had.

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

function closest<T extends { slug: string }>(
  pages: T[],
  productWords: string[],
  words = wordsOf,
): T | undefined {
  let best: T | undefined;
  let bestScore = 0;
  for (const page of pages) {
    const score = fit(words(page.slug), productWords);
    if (score > bestScore) [best, bestScore] = [page, score];
  }
  return best;
}

export interface CurrentSiteMatch<T> {
  own: T | undefined;
  byColour: { colour: string; page: T }[];
}

export function matchCurrentSite<T extends { slug: string }>(
  handle: string,
  colours: string[],
  pages: T[],
): CurrentSiteMatch<T> {
  const productWords = wordsOf(handle);
  const byColour = colours.flatMap((colour) => {
    const colourWords = wordsOf(colour.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    const withColour = pages.filter((page) => containsAll(wordsOf(page.slug), colourWords));
    const page = closest(withColour, productWords, (slug) =>
      wordsOf(slug).filter((word) => !colourWords.includes(word)),
    );
    return page ? [{ colour, page }] : [];
  });
  // A colour's page describes that colour, so it never stands in for the whole product.
  const own = closest(
    pages.filter((page) => !byColour.some((match) => match.page === page)),
    productWords,
  );
  return { own, byColour };
}
