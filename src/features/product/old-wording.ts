import { matchCurrentSite } from '@/lib/current-site/match';
import type { ProductExtras } from './content';

// The words on one of the current site's product pages, copied before the launch.
export interface OldProductPage {
  slug: string;
  description: string;
  features: string[];
  documents: { title: string; url: string }[];
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
  const { own, byColour } = matchCurrentSite(handle, colours, pages);
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
