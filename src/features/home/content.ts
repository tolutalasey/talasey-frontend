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

// Wording and order from the current talasey.co.uk homepage, used until /content says otherwise.
const DEFAULTS = {
  projectsHeading: 'Design your perfect outdoor space',
  projectsIntro:
    'Whether you’re creating a relaxing retreat, an entertainment hub, or a complete garden transformation, discover solutions tailored to your vision.',
  whyHeading: 'The trusted name behind thousands of outdoor projects',
  whyPoints: [
    {
      title: 'Premium product collections',
      text: 'Carefully selected products engineered for outstanding performance and timeless style.',
    },
    {
      title: 'Nationwide installer network',
      text: 'Find trusted professionals near you with proven expertise in Talasey products.',
    },
    {
      title: 'Industry-leading guarantees',
      text: 'Built to last with confidence, every product backed by comprehensive warranties.',
    },
    {
      title: 'Expert guidance',
      text: 'From initial inspiration through to final installation, we’re with you every step.',
    },
  ],
  whyStats: [
    { value: '25+', label: 'Years experience' },
    { value: '500+', label: 'Accredited installers' },
    { value: '1000s', label: 'Completed projects' },
    { value: '1M+', label: 'm² installed' },
  ],
  collectionsHeading: 'Discover premium outdoor living collections',
  collectionsIntro: 'Explore expertly curated collections designed to elevate every garden.',
  collections: [
    {
      title: 'Natural stone',
      summary: 'Authentic beauty inspired by nature.',
      href: '/natural-stone-paving/',
    },
    {
      title: 'Composite decking',
      summary: 'Luxury without the maintenance.',
      href: '/composite-decking/',
    },
    {
      title: 'Composite cladding',
      summary: 'Modern solutions for privacy and style.',
      href: '/composite-cladding/',
    },
    { title: 'Luxury pergolas', summary: 'Create a stylish outdoor room.', href: '/pergolas/' },
    {
      title: 'Garden rooms',
      summary: 'Flexible spaces for work, wellness, and entertainment.',
      href: '/garden-rooms/',
    },
    {
      title: 'Porcelain paving',
      summary: 'Contemporary elegance with exceptional durability.',
      href: '/porcelain-paving/',
    },
  ],
  stepsHeading: 'Build your garden from the ground up',
  stepsIntro: 'Our step-by-step planning guide helps you design the perfect outdoor space.',
  steps: [
    {
      title: 'Choose surface',
      links: [
        { label: 'Paving', href: '/paving/' },
        { label: 'Decking', href: '/composite-decking/' },
        { label: 'Grass', href: '/artificial-grass/' },
        { label: 'Help me choose', href: '/product-finder/' },
      ],
    },
    {
      title: 'Define space',
      links: [
        { label: 'Pergola', href: '/pergolas/' },
        { label: 'Build your own pergola', href: '/pergolas/#build-your-own' },
        { label: 'Garden room', href: '/garden-rooms/' },
      ],
    },
    {
      title: 'Add privacy',
      links: [
        { label: 'Fencing', href: '/composite-fencing/' },
        { label: 'Fence kit builder', href: '/fence-builder/composite-fencing/' },
        { label: 'Screens', href: '/garden-screens/' },
      ],
    },
    {
      title: 'Complete look',
      links: [
        { label: 'Lighting', href: '/outdoor-lighting/' },
        { label: 'Accessories', href: '/planters/' },
        { label: 'Order samples', href: '/samples/' },
      ],
    },
  ],
  newsHeading: 'Blogs and news',
  newsIntro: 'Everything you need to plan, design, and maintain your outdoor space.',
  samplesHeading: 'Three free samples with every order',
  samplesText:
    'Experience quality before you buy. Order samples, browse brochures, and explore our collections from the comfort of your home. Feel the texture of our porcelain and composite materials before making your decision.',
  samplesPoints: [
    'Fast UK delivery',
    'Multiple sample selection',
    'Product brochures',
    'Expert recommendations',
  ],
  samplesActions: [
    { label: 'Order 3 free samples', href: '/samples/' },
    { label: 'Our brochures', href: '/brochures/' },
  ],
  closingHeading: 'Let’s create something extraordinary',
  closingText:
    'Whether you’re planning a new patio, a luxury pergola, or a complete outdoor transformation, Talasey has the products, expertise, and installer network to bring your vision to life.',
  closingActions: [
    { label: 'Order 3 free samples', href: '/samples/' },
    { label: 'Contact us', href: '/contact/' },
  ],
};

const tile = z.object({
  photo: photo.nullish(),
  title: z.string().min(1),
  summary: z.string().min(1),
  href: z.string(),
});
// Left empty in /content, a newer homepage field keeps the current site's wording.
const blank = (value: unknown) =>
  value == null || value === '' || (Array.isArray(value) && value.length === 0);
const orDefault = <T extends z.ZodType>(schema: T, fallback: z.output<T>) =>
  z.preprocess((value) => (blank(value) ? fallback : value), schema);

const titled = z.object({ title: z.string().min(1), text: z.string().min(1) });
const stat = z.object({ value: z.string().min(1), label: z.string().min(1) });
const step = z.object({ title: z.string().min(1), links: z.array(link).default([]) });

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
  projectsHeading: orDefault(z.string().min(1), DEFAULTS.projectsHeading),
  projectsIntro: orDefault(z.string(), DEFAULTS.projectsIntro),
  projectTiles: z.array(tile).min(2),
  whyHeading: orDefault(z.string().min(1), DEFAULTS.whyHeading),
  whyPoints: orDefault(z.array(titled), DEFAULTS.whyPoints),
  whyStats: orDefault(z.array(stat), DEFAULTS.whyStats),
  collectionsHeading: orDefault(z.string().min(1), DEFAULTS.collectionsHeading),
  collectionsIntro: orDefault(z.string(), DEFAULTS.collectionsIntro),
  collections: orDefault(z.array(tile), DEFAULTS.collections),
  stepsHeading: orDefault(z.string().min(1), DEFAULTS.stepsHeading),
  stepsIntro: orDefault(z.string(), DEFAULTS.stepsIntro),
  steps: orDefault(z.array(step), DEFAULTS.steps),
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
  newsHeading: orDefault(z.string().min(1), DEFAULTS.newsHeading),
  newsIntro: orDefault(z.string(), DEFAULTS.newsIntro),
  samplesHeading: orDefault(z.string().min(1), DEFAULTS.samplesHeading),
  samplesText: orDefault(z.string(), DEFAULTS.samplesText),
  samplesPoints: orDefault(z.array(z.string()), DEFAULTS.samplesPoints),
  samplesActions: orDefault(z.array(link), DEFAULTS.samplesActions),
  closingHeading: orDefault(z.string().min(1), DEFAULTS.closingHeading),
  closingText: orDefault(z.string(), DEFAULTS.closingText),
  closingActions: orDefault(z.array(link), DEFAULTS.closingActions),
  seo: z.object({
    title: z.string().min(30).max(60),
    description: z.string().min(70).max(160),
  }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;
export type SeasonalBlock = HomeContent['seasonalBlocks'][number];
export type ProjectTile = HomeContent['projectTiles'][number];
export type HomeStep = HomeContent['steps'][number];
export type HomeLink = HomeContent['closingActions'][number];

export const fallbackHomeContent: HomeContent = {
  h1: 'Paving, decking and outdoor living for UK gardens',
  intro:
    'Porcelain and natural stone paving, composite decking, pergolas and everything needed to finish the job, delivered to your door.',
  heroActions: [
    { label: 'Order free samples', href: '/samples/' },
    { label: 'Shop porcelain paving', href: '/porcelain-paving/' },
  ],
  heroScenes: [],
  ...DEFAULTS,
  projectTiles: [
    {
      title: 'Pergolas',
      summary: 'Create year-round outdoor living.',
      href: '/pergolas/',
    },
    {
      title: 'Garden rooms',
      summary: 'Extend your lifestyle beyond the walls of your home.',
      href: '/garden-rooms/',
    },
    {
      title: 'Paving',
      summary: 'Beautiful foundations for every outdoor project.',
      href: '/paving/',
    },
    {
      title: 'Composite products',
      summary: 'Low-maintenance luxury for modern gardens.',
      href: '/composite-decking/',
    },
    {
      title: 'Garden lighting',
      summary: 'Light up your landscape.',
      href: '/outdoor-lighting/',
    },
    {
      title: 'Sculptures',
      summary: 'Finishing touches that complete your space.',
      href: '/garden-sculptures/',
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
