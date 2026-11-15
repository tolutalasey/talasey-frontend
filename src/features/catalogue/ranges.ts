import { z } from 'zod';

const seo = z.object({
  title: z.string().min(30).max(60),
  description: z.string().min(70).max(160),
});

const faq = z.object({ question: z.string().min(1), answer: z.string().min(1) });

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const photo = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const galleryItem = z.object({ photo, caption: z.string().nullish() });

// A filter state with demand of its own (PRD section 13): it gets a clean URL, its own intro and
// an index tag. Every other filter state is a query string and noindex.
export const curatedPageSchema = z.object({
  slug,
  name: z.string().min(1),
  h1: z.string().min(1),
  intro: z.string().min(1),
  filters: z.record(z.string(), z.array(z.string()).min(1)),
  seo,
});

export const rangeSchema = z.object({
  slug,
  kind: z.enum(['range', 'category']),
  name: z.string().min(1),
  h1: z.string().min(1),
  intro: z.string().min(1),
  photo: photo.nullish(),
  gallery: z.array(galleryItem).default([]),
  scope: z.object({
    categories: z.array(z.string()).optional(),
    titleIncludes: z.array(z.string()).optional(),
  }),
  buyingGuide: z.array(z.string()).default([]),
  faqs: z.array(faq).default([]),
  curated: z.array(curatedPageSchema).default([]),
  seo,
});

export type Range = z.infer<typeof rangeSchema>;
export type RangeGalleryItem = z.infer<typeof galleryItem>;
export type CuratedPage = z.infer<typeof curatedPageSchema>;
export type RangeFaq = z.infer<typeof faq>;

export const rangePath = (range: Pick<Range, 'slug'>) => `/${range.slug}/`;
export const curatedPath = (range: Pick<Range, 'slug'>, page: Pick<CuratedPage, 'slug'>) =>
  `/${range.slug}/${page.slug}/`;

const samplesFaq: RangeFaq = {
  question: 'Can I see a sample first?',
  answer:
    'Yes. Choose up to five free samples on our Free samples page and we will post them to you.',
};

// Used until range pages are published in /content. The keyword ranges follow the PRD section 13 map; the category
// pages cover the rest of the published catalogue.
export const fallbackRanges: Range[] = [
  {
    slug: 'porcelain-paving',
    kind: 'range',
    name: 'Porcelain paving',
    h1: 'Porcelain paving',
    intro:
      'Porcelain paving is hard-wearing, easy to clean and keeps its colour, which makes it a good choice for patios, paths and garden steps.',
    gallery: [],
    scope: { titleIncludes: ['porcelain paving'] },
    buyingGuide: [
      'Porcelain is made at high temperatures, so it absorbs very little water and stands up well to frost and stains.',
      'Most outdoor porcelain is 20mm thick and is laid on a full mortar bed with a slurry primer on the back of each slab.',
    ],
    faqs: [samplesFaq],
    curated: [],
    seo: {
      title: 'Porcelain paving for patios and paths | Talasey',
      description:
        'Outdoor porcelain paving slabs for patios, paths and steps, priced per pack with VAT, plus jointing and primer to finish the job.',
    },
  },
  {
    slug: 'natural-stone-paving',
    kind: 'range',
    name: 'Natural stone paving',
    h1: 'Natural stone paving',
    intro:
      'Indian sandstone, limestone, granite and slate paving for patios and paths, each slab with its own natural variation in colour.',
    gallery: [],
    scope: { titleIncludes: ['sandstone', 'limestone', 'granite', 'slate'] },
    buyingGuide: [],
    faqs: [samplesFaq],
    curated: [],
    seo: {
      title: 'Natural stone paving and sandstone slabs | Talasey',
      description:
        'Natural stone paving in sandstone, limestone, granite and slate for UK patios and paths, delivered to your door with free samples.',
    },
  },
  {
    slug: 'composite-decking',
    kind: 'range',
    name: 'Composite decking',
    h1: 'Composite decking',
    intro:
      'Composite decking boards, frames and fixings for a deck that does not need staining or oiling each year.',
    gallery: [],
    scope: { titleIncludes: ['decking'] },
    buyingGuide: [],
    faqs: [samplesFaq],
    curated: [],
    seo: {
      title: 'Composite decking boards and fixings | Talasey',
      description:
        'Composite decking boards with matching trims, frames and fixings, for a low-maintenance deck in any UK garden.',
    },
  },
  {
    slug: 'composite-cladding',
    kind: 'range',
    name: 'Composite cladding',
    h1: 'Composite cladding',
    intro:
      'Composite cladding boards, trims and clips for garden rooms, sheds and walls, in finishes that need no painting.',
    gallery: [],
    scope: { categories: ['landscaping-materials-cladding'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Composite cladding boards and trims | Talasey',
      description:
        'Composite cladding boards, trims, clips and starter strips for garden rooms and walls, with everything needed to fix them.',
    },
  },
  {
    slug: 'composite-fencing',
    kind: 'range',
    name: 'Composite fencing',
    h1: 'Composite fencing',
    intro:
      'Composite fence boards with aluminium posts, trellis and trims, plus lights that fit the posts.',
    gallery: [],
    scope: { categories: ['landscaping-materials-fencing-gates-balustrades'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Composite fencing, posts and trellis | Talasey',
      description:
        'Composite fence boards, aluminium posts, trellis, trims and post lights for a fence that needs no painting or staining.',
    },
  },
  {
    slug: 'paving-jointing',
    kind: 'range',
    name: 'Paving jointing',
    h1: 'Paving jointing compound',
    intro:
      'Brush-in jointing compound for porcelain and natural stone patios, in colours to match your paving.',
    gallery: [],
    scope: { titleIncludes: ['jointing'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Paving jointing compound for patios | Talasey',
      description:
        'Brush-in paving jointing compound for porcelain and natural stone patios, in colours to match, delivered across the UK.',
    },
  },
  {
    slug: 'pergolas',
    kind: 'range',
    name: 'Pergolas',
    h1: 'Pergolas',
    intro: 'Pergolas for shade over a patio or deck, freestanding or fixed to the house.',
    gallery: [],
    scope: { titleIncludes: ['pergola'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Pergolas for patios and decks | Talasey',
      description:
        'Freestanding and wall-mounted pergolas for shade over a patio or deck, with options for louvres and lighting.',
    },
  },
  {
    slug: 'garden-rooms',
    kind: 'range',
    name: 'Garden rooms',
    h1: 'Garden rooms',
    intro: 'Garden rooms and garden offices, with the cladding, lighting and base to go with them.',
    gallery: [],
    scope: { titleIncludes: ['garden room'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Garden rooms and garden offices | Talasey',
      description:
        'Garden rooms and garden offices for UK gardens, with the cladding, lighting and groundwork products to finish them.',
    },
  },
  {
    slug: 'planters',
    kind: 'range',
    name: 'Planters',
    h1: 'Planters',
    intro:
      'Steel planters made to your measurements, in mild steel, Corten or a powder-coated finish.',
    gallery: [],
    scope: { titleIncludes: ['planter'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Steel planters made to measure | Talasey',
      description:
        'Steel garden planters made to your width, depth and height, in mild steel, Corten or powder coated, priced as you type.',
    },
  },
  {
    slug: 'fire-pits',
    kind: 'range',
    name: 'Fire pits',
    h1: 'Fire pits',
    intro:
      'Steel and hand-cut natural stone fire pits, with liners and heat deflectors to go with them.',
    gallery: [],
    scope: { categories: ['outdoor-living-fire-pits'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Fire pits in steel and natural stone | Talasey',
      description:
        'Steel sphere fire pits and hand-cut natural stone fire pits for the garden, with liners and heat deflectors.',
    },
  },
  {
    slug: 'garden-sculptures',
    kind: 'range',
    name: 'Garden sculptures',
    h1: 'Garden sculptures',
    intro: 'Sculptures and water features for the garden, from stock pieces to commissions.',
    gallery: [],
    scope: { titleIncludes: ['sculpture'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Garden sculptures and water features | Talasey',
      description:
        'Garden sculptures and water features in steel and stone, from ready-made pieces to commissions for your own garden.',
    },
  },
  {
    slug: 'garden-screens',
    kind: 'category',
    name: 'Garden screens',
    h1: 'Decorative garden screens',
    intro:
      'Laser-cut steel screens in three sizes, in weathered steel, galvanised steel or a powder-coated colour.',
    gallery: [],
    scope: { categories: ['architectural-steelwork-screens'] },
    buyingGuide: [],
    faqs: [],
    curated: [
      {
        slug: 'weathered-steel',
        name: 'Weathered steel',
        h1: 'Weathered steel garden screens',
        intro:
          'Screens in weathered (Corten-style) steel, which forms a rust-coloured finish that protects the steel beneath.',
        filters: { finish: ['weathered-steel'] },
        seo: {
          title: 'Weathered steel garden screens | Talasey',
          description:
            'Laser-cut decorative garden screens in weathered steel, which develops a protective rust-coloured finish outdoors.',
        },
      },
      {
        slug: 'powder-coated',
        name: 'Powder coated',
        h1: 'Powder-coated garden screens',
        intro: 'Screens powder coated in the colour you choose, for a smooth, even finish.',
        filters: { finish: ['powder-coated'] },
        seo: {
          title: 'Powder-coated decorative garden screens | Talasey',
          description:
            'Laser-cut decorative garden screens powder coated in your choice of colour, in three sizes for walls and fences.',
        },
      },
    ],
    seo: {
      title: 'Decorative garden screens in steel | Talasey',
      description:
        'Laser-cut decorative steel garden screens in three sizes, in weathered steel, galvanised or a powder-coated colour.',
    },
  },
  {
    slug: 'outdoor-lighting',
    kind: 'category',
    name: 'Outdoor lighting',
    h1: 'Outdoor lighting',
    intro:
      'Low-voltage garden lights for decks, paths, walls and planting, with the transformers, cables and controllers to run them.',
    gallery: [],
    scope: { categories: ['outdoor-living-outdoor-lighting'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Outdoor garden and deck lighting | Talasey',
      description:
        'Low-voltage deck lights, spot lights, wall lights and bollards for the garden, with transformers, cables and controllers.',
    },
  },
  {
    slug: 'garden-furniture',
    kind: 'category',
    name: 'Garden furniture',
    h1: 'Garden furniture',
    intro: 'Hanging egg chairs, parasols and outdoor furniture for the patio.',
    gallery: [],
    scope: { categories: ['outdoor-living-garden-furniture'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Garden furniture, egg chairs and parasols | Talasey',
      description:
        'Hanging egg chairs, parasols and outdoor furniture to finish your patio, delivered to your door across the UK.',
    },
  },
  {
    slug: 'garden-edging',
    kind: 'category',
    name: 'Garden edging',
    h1: 'Garden edging',
    intro:
      'Steel and aluminium edging to keep lawns, borders and paths crisp, with the brackets to fix it.',
    gallery: [],
    scope: { categories: ['architectural-steelwork-garden-edging'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Steel and aluminium garden edging | Talasey',
      description:
        'Steel and aluminium garden edging for lawns, borders and paths, with straight and corner brackets to fix it in place.',
    },
  },
  {
    slug: 'cleaners-and-sealers',
    kind: 'category',
    name: 'Cleaners and sealers',
    h1: 'Patio cleaners and sealers',
    intro:
      'Cleaners, sealers and stain removers to look after porcelain, stone and resin-bound surfaces.',
    gallery: [],
    scope: { categories: ['landscaping-materials-cleaners-sealers'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Patio cleaners, sealers and stain removers | Talasey',
      description:
        'Patio cleaners, sealers and stain removers for porcelain, natural stone and resin-bound surfaces, from Pavetuf.',
    },
  },
  {
    slug: 'paving-installation',
    kind: 'category',
    name: 'Paving installation',
    h1: 'Paving supports and installation',
    intro:
      'Adjustable paving risers, top plates, profiles and tools for laying porcelain on roofs, balconies and raised terraces.',
    gallery: [],
    scope: { categories: ['landscaping-materials-paving-installation'] },
    buyingGuide: [],
    faqs: [],
    curated: [],
    seo: {
      title: 'Adjustable paving risers and supports | Talasey',
      description:
        'Adjustable paving risers, top plates, aluminium profiles and tools for raised porcelain terraces, roofs and balconies.',
    },
  },
];

const lower = (text: string) => text.toLowerCase();

// The range a product belongs to, for its breadcrumb and "more like this" links: a keyword range
// before a category page, matched the same way the range page finds its products.
export function rangeForProduct(
  ranges: Range[],
  product: { title: string; categories: { handle: string }[] },
): Range | null {
  const handles = new Set(product.categories.map((category) => category.handle));
  const inRange = (range: Range) =>
    Boolean(
      range.scope.categories?.some((handle) => handles.has(handle)) ||
      range.scope.titleIncludes?.some((text) => lower(product.title).includes(lower(text))),
    );
  return (
    ranges.find((range) => range.kind === 'range' && inRange(range)) ?? ranges.find(inRange) ?? null
  );
}
