import { isAvailable, isInStock, type Product, type ProductVariant } from '@/api-client';
import { slugify } from '@/lib/slug';

type Params = Record<string, string | string[] | undefined>;

export const optionParam = (title: string) => slugify(title);

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const COLOUR = 'Colour';

export interface Selection {
  variant: ProductVariant | null;
  options: Record<string, string>;
  // The colour set swatch asked for with ?colour=, when the product has no Colour option.
  colourParam: string | null;
}

// Prefer what can be bought now: priced and in stock, then priced and made to order.
const stockRank = (variant: ProductVariant) =>
  (variant.priceIncVat ? 0 : 3) + (isInStock(variant) ? 0 : isAvailable(variant) ? 1 : 2);

const best = (variants: ProductVariant[]) =>
  [...variants].sort((a, b) => stockRank(a) - stockRank(b))[0] ?? null;

// The colour to open on: the one asked for if it can be bought, otherwise the first colour in
// stock, then the first that can be ordered (PRD section 6, ?colour=).
function openingColour(product: Product, asked: string | undefined): string | undefined {
  const colours = product.options.find((option) => option.title === COLOUR)?.values ?? [];
  const variantsIn = (colour: string) =>
    product.variants.filter((variant) => variant.options[COLOUR] === colour);
  const wanted = colours.find((colour) => slugify(colour) === asked);
  if (wanted && variantsIn(wanted).some(isAvailable)) return wanted;
  return (
    colours.find((colour) => variantsIn(colour).some(isInStock)) ??
    colours.find((colour) => variantsIn(colour).some(isAvailable)) ??
    colours[0]
  );
}

// Picks the variant for the options in the URL, keeping as many of them as can go together.
export function resolveSelection(product: Product, params: Params): Selection {
  const asked = new Map<string, string>();
  for (const option of product.options) {
    const slug = first(params[optionParam(option.title)]);
    const value =
      option.title === COLOUR
        ? openingColour(product, slug)
        : option.values.find((candidate) => slugify(candidate) === slug);
    if (value) asked.set(option.title, value);
  }

  let candidates = product.variants;
  for (const [title, value] of asked) {
    const narrowed = candidates.filter((variant) => variant.options[title] === value);
    if (narrowed.length > 0) candidates = narrowed;
  }
  const variant = best(candidates);
  const hasColourOption = product.options.some((option) => option.title === COLOUR);
  return {
    variant,
    options: variant?.options ?? {},
    colourParam: hasColourOption ? null : (first(params.colour) ?? null),
  };
}

export interface OptionChoice {
  value: string;
  params: Record<string, string>;
  current: boolean;
  // False when no variant has this value alongside the other options chosen.
  available: boolean;
}

export interface OptionGroup {
  title: string;
  current: string | null;
  choices: OptionChoice[];
}

export function optionGroups(product: Product, selection: Selection): OptionGroup[] {
  return product.options.map((option) => ({
    title: option.title,
    current: selection.options[option.title] ?? null,
    choices: option.values.map((value) => {
      const wanted = { ...selection.options, [option.title]: value };
      const params = Object.fromEntries(
        Object.entries(wanted).map(([title, chosen]) => [optionParam(title), slugify(chosen)]),
      );
      if (selection.colourParam) params.colour = selection.colourParam;
      return {
        value,
        params,
        current: selection.options[option.title] === value,
        available: product.variants.some(
          (variant) =>
            isAvailable(variant) &&
            Object.entries(wanted).every(([title, chosen]) => variant.options[title] === chosen),
        ),
      };
    }),
  }));
}
