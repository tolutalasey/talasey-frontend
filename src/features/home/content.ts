import { z } from 'zod';

export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof SEASONS)[number];

const link = z.object({ label: z.string().min(1), href: z.string().min(1) });
const photo = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const homeContentSchema = z.object({
  h1: z.string().min(1),
  intro: z.string().min(1),
  heroActions: z.tuple([link, link]),
  heroScenes: z
    .array(
      z.object({
        photo,
        topic: z.string().min(1),
        title: z.string().min(1),
        href: z.string().min(1),
      }),
    )
    .default([]),
  projectTiles: z
    .array(
      z.object({
        photo: photo.nullish(),
        title: z.string().min(1),
        summary: z.string().min(1),
        href: z.string(),
      }),
    )
    .min(2),
  seasonalBlocks: z
    .array(
      z.object({
        season: z.enum(SEASONS),
        heading: z.string().min(1),
        text: z.string().min(1),
        action: link,
      }),
    )
    .default([]),
  featuredHeading: z.string().min(1).default('Featured products'),
  products: z.array(z.string()).default([]),
  seo: z.object({
    title: z.string().min(30).max(60),
    description: z.string().min(70).max(160),
  }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;
export type SeasonalBlock = HomeContent['seasonalBlocks'][number];
export type ProjectTile = HomeContent['projectTiles'][number];

export const fallbackHomeContent: HomeContent = {
  h1: 'Paving, decking and outdoor living for UK gardens',
  intro:
    'Porcelain and natural stone paving, composite decking, pergolas and everything needed to finish the job, delivered to your door.',
  heroActions: [
    { label: 'Order free samples', href: '/samples/' },
    { label: 'Shop porcelain paving', href: '/porcelain-paving/' },
  ],
  heroScenes: [],
  projectTiles: [
    {
      title: 'A new patio',
      summary: 'Porcelain or natural stone, and everything you need to lay it.',
      href: '/projects/new-patio/',
    },
    {
      title: 'A composite deck',
      summary: 'Boards, frames and fixings for a deck that lasts.',
      href: '/projects/composite-deck/',
    },
    {
      title: 'Shade and shelter',
      summary: 'Pergolas and screens so you can use the garden all day.',
      href: '/projects/shade-and-shelter/',
    },
    {
      title: 'A garden room',
      summary: 'Cladding, lighting and a base for a room at the end of the garden.',
      href: '/projects/garden-room/',
    },
  ],
  seasonalBlocks: [
    {
      season: 'spring',
      heading: 'Get the patio ready for summer',
      text: 'Spring is the best time to lay a new patio. Order samples now and see the colours in your own garden light.',
      action: { label: 'Plan a new patio', href: '/projects/new-patio/' },
    },
    {
      season: 'summer',
      heading: 'Shade for long evenings',
      text: 'A pergola or a set of screens turns a sunny patio into somewhere you can sit all afternoon.',
      action: { label: 'See shade and shelter', href: '/projects/shade-and-shelter/' },
    },
    {
      season: 'autumn',
      heading: 'Clean and protect your patio before winter',
      text: 'Clear the leaves, lift the green and check the joints now, so frost has nowhere to get in.',
      action: { label: 'Patio care advice', href: '/help/care/' },
    },
    {
      season: 'winter',
      heading: 'Plan next year’s garden',
      text: 'Winter is a good time to measure up and price a project, ready to start when the ground dries out.',
      action: { label: 'Start planning', href: '/projects/new-patio/' },
    },
  ],
  featuredHeading: 'Featured products',
  products: [],
  seo: {
    title: 'Porcelain paving, decking and pergolas | Talasey',
    description:
      'Shop porcelain and natural stone paving, composite decking, pergolas and jointing from Talasey, with UK delivery and free samples.',
  },
};
