import { slugify } from './slug';
import { productPath } from './urls/keyword-map';

export const COLOUR_OPTION = 'Colour';

interface Option {
  title: string;
  values: string[];
}

// A product sold in two or more colours has a page for each colour, like the current site.
export const pageColours = (options: Option[]): string[] => {
  const values = options.find((option) => option.title === COLOUR_OPTION)?.values ?? [];
  return values.length > 1 ? values : [];
};

export const colourPath = (handle: string, colour: string) =>
  `${productPath(handle)}${slugify(colour)}/`;

export const colourFromSlug = (options: Option[], slug: string) =>
  pageColours(options).find((colour) => slugify(colour) === slug) ?? null;

// "Anno Lite porcelain paving" in Buff reads "Anno Lite Buff porcelain paving": the colour goes
// before the first lower-case word, as the current site names them.
export function colourTitle(title: string, colour: string): string {
  if (title.toLowerCase().includes(colour.toLowerCase())) return title;
  const words = title.split(' ');
  const at = words.findIndex((word, index) => index > 0 && /^[a-z]/.test(word));
  return at < 0
    ? `${title} ${colour}`
    : [...words.slice(0, at), colour, ...words.slice(at)].join(' ');
}
