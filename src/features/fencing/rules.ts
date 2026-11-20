import { z } from 'zod';
import type { FenceBuilder } from './content';

// What is on the shop, by product web address: each product's versions that have a price.
export interface CatalogueVariant {
  id: string;
  title: string;
  colour: string | null;
  pricePence: number;
}

export type FenceCatalogue = Record<string, { title: string; variants: CatalogueVariant[] }>;

export const MIN_LENGTH_M = 1;
export const MAX_LENGTH_M = 100;

// The shopper's choices, as the page and the bag action both receive them.
export const fenceChoiceSchema = z.object({
  style: z.number().int().min(0),
  colour: z.string().max(80).nullable(),
  lengthM: z.number().min(MIN_LENGTH_M).max(MAX_LENGTH_M),
  boards: z.number().int().positive(),
  post: z.number().int().min(0),
  topper: z.number().int().min(0).nullable(),
  extras: z.array(z.number().int().min(0)).max(10),
});

export type FenceChoice = z.infer<typeof fenceChoiceSchema>;

export interface KitLine {
  variantId: string;
  name: string;
  quantity: number;
  unitPence: number;
}

export interface FenceKit {
  ready: boolean;
  problems: string[];
  bays: number;
  posts: number;
  runMm: number;
  heightMm: number;
  lines: KitLine[];
  totalPence: number;
}

const variantFor = (
  catalogue: FenceCatalogue,
  handle: string | null | undefined,
  colour: string | null,
): (CatalogueVariant & { product: string }) | null => {
  const product = handle ? catalogue[handle] : undefined;
  if (!product || product.variants.length === 0) return null;
  const match =
    product.variants.find((variant) => colour && variant.colour === colour) ?? product.variants[0];
  return match ? { ...match, product: product.title } : null;
};

const lineFor = (
  variant: ReturnType<typeof variantFor>,
  quantity: number,
  name?: string,
): KitLine[] =>
  variant && quantity > 0
    ? [
        {
          variantId: variant.id,
          name:
            name ?? (variant.colour ? `${variant.product}, ${variant.colour}` : variant.product),
          quantity,
          unitPence: variant.pricePence,
        },
      ]
    : [];

// The colours the chosen style's boards come in.
export function coloursFor(
  rules: FenceBuilder,
  catalogue: FenceCatalogue,
  style: number,
): string[] {
  const board = catalogue[rules.styles[style]?.boardProduct ?? ''];
  return [
    ...new Set(
      board?.variants.flatMap((variant) => (variant.colour ? [variant.colour] : [])) ?? [],
    ),
  ];
}

// The styles, post fixings, toppers and extras whose products can be bought now.
export function offered(rules: FenceBuilder, catalogue: FenceCatalogue) {
  const onShop = (handle: string) => Boolean(catalogue[handle]?.variants.length);
  return {
    styles: rules.styles.map((style) => onShop(style.boardProduct)),
    posts: rules.posts.map((post) => onShop(post.product)),
    toppers: rules.toppers.map((topper) => onShop(topper.product)),
    extras: rules.postExtras.map(
      (extra) => onShop(extra.product) && (!extra.withProduct || onShop(extra.withProduct)),
    ),
  };
}

export const fenceHeightMm = (
  rules: FenceBuilder,
  choice: Pick<FenceChoice, 'style' | 'boards' | 'topper'>,
) =>
  (rules.styles[choice.style]?.boardHeight ?? 0) * choice.boards +
  (choice.topper === null ? 0 : (rules.toppers[choice.topper]?.height ?? 0));

// A straight run: one bay per bay width, a post at each end and between each bay, boards to the
// chosen height in every bay, and a trim kit and topper per bay, an extra per post.
export function fenceKit(
  rules: FenceBuilder,
  catalogue: FenceCatalogue,
  choice: FenceChoice,
): FenceKit {
  const problems: string[] = [];
  const style = rules.styles[choice.style];
  const post = rules.posts[choice.post];
  const topper = choice.topper === null ? null : rules.toppers[choice.topper];
  const bays = Math.ceil((choice.lengthM * 1000) / rules.bayWidth);
  const posts = bays + 1;
  const heightMm = fenceHeightMm(rules, choice);

  const board = variantFor(catalogue, style?.boardProduct, choice.colour);
  const postPart = variantFor(catalogue, post?.product, null);
  if (!style || !board) problems.push('Choose a fence style');
  if (!rules.boardCounts.includes(choice.boards)) problems.push('Choose a height');
  if (!post || !postPart) problems.push('Choose how the posts are fixed');
  else if (heightMm > post.maxHeight)
    problems.push(`${post.name} posts take a fence up to ${post.maxHeight / 1000} m high`);
  if (choice.topper !== null && !topper) problems.push('Choose a topper');

  const lines = [
    ...lineFor(board, bays * choice.boards),
    ...lineFor(postPart, posts),
    ...lineFor(variantFor(catalogue, rules.trimProduct, null), rules.trimProduct ? bays : 0),
    ...lineFor(variantFor(catalogue, topper?.product, choice.colour), topper ? bays : 0),
    ...choice.extras.flatMap((index) => {
      const extra = rules.postExtras[index];
      if (!extra) return [];
      return [
        ...lineFor(variantFor(catalogue, extra.product, null), posts),
        ...lineFor(variantFor(catalogue, extra.withProduct, null), extra.withProduct ? posts : 0),
      ];
    }),
  ];

  return {
    ready: problems.length === 0,
    problems,
    bays,
    posts,
    runMm: bays * rules.bayWidth,
    heightMm,
    lines,
    totalPence: lines.reduce((total, line) => total + line.quantity * line.unitPence, 0),
  };
}
