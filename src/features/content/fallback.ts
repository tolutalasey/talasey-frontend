import type { BrandPage, Faq, Guide, Inspiration, ProjectPage } from './schemas';

// Shown until the matching entry is published in /content. Everything here is marked as placeholder copy, so it is noindex
// until the content team publishes the real pages.

export const fallbackBrands: BrandPage[] = [
  {
    slug: 'vitripiazza',
    name: 'Vitripiazza',
    h1: 'Vitripiazza porcelain paving',
    intro: 'Vitripiazza is our own range of outdoor porcelain paving.',
    story: [],
    facts: [],
    points: [],
    ranges: ['porcelain-paving'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Vitripiazza porcelain paving | Talasey',
      description:
        'Vitripiazza outdoor porcelain paving from Talasey: the ranges, colours and sizes, with free samples and UK delivery.',
    },
  },
  {
    slug: 'natural-paving',
    name: 'Natural Paving',
    h1: 'Natural Paving',
    intro: 'Natural Paving is our range of natural stone paving for patios and paths.',
    story: [],
    facts: [],
    points: [],
    ranges: ['natural-stone-paving'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Natural Paving stone patio ranges | Talasey',
      description:
        'Natural Paving sandstone, limestone, granite and slate from Talasey, with free samples and delivery across the UK.',
    },
  },
  {
    slug: 'piranha',
    name: 'Piranha',
    h1: 'Piranha composite decking, cladding and fencing',
    intro: 'Piranha is our range of composite decking, cladding and fencing.',
    story: [],
    facts: [],
    points: [],
    ranges: ['composite-decking', 'composite-cladding', 'composite-fencing'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Piranha composite decking and cladding | Talasey',
      description:
        'Piranha composite decking, cladding and fencing from Talasey: boards, trims, clips and gates for a low-maintenance garden.',
    },
  },
  {
    slug: 'pavetuf',
    name: 'Pavetuf',
    h1: 'Pavetuf jointing, cleaners and paving supports',
    intro:
      'Pavetuf makes the products that finish and look after a patio: jointing compound, cleaners and sealers, and adjustable paving risers.',
    story: [],
    facts: [],
    points: [],
    ranges: ['paving-jointing', 'cleaners-and-sealers', 'paving-installation'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Pavetuf jointing, cleaners and risers | Talasey',
      description:
        'Pavetuf paving jointing compound, patio cleaners and sealers, and adjustable paving risers, delivered across the UK.',
    },
  },
  {
    slug: 'luxigraze',
    name: 'Luxigraze',
    h1: 'Luxigraze',
    intro: 'We are adding the Luxigraze range to the new site.',
    story: [],
    facts: [],
    points: [],
    ranges: [],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Luxigraze from Talasey | Talasey brands',
      description:
        'Luxigraze from Talasey. The full range, with test data, guarantees and where to buy, is coming to the new site soon.',
    },
  },
];

export const fallbackProjects: ProjectPage[] = [
  {
    slug: 'new-patio',
    name: 'A new patio',
    h1: 'Planning a new patio',
    intro: 'Everything that goes into a new patio, from choosing the paving to jointing it.',
    story: [],
    steps: [
      'Measure the area and choose your paving. Order samples to see the colours outside.',
      'Prepare a firm, well-drained sub-base with a slight fall away from the house.',
      'Lay the slabs on mortar, with a primer on the back of porcelain.',
      'Fill the joints, then keep off it until the jointing has set.',
    ],
    facts: [],
    points: [],
    ranges: ['porcelain-paving', 'natural-stone-paving', 'paving-jointing', 'garden-edging'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Planning a new patio: paving and materials | Talasey',
      description:
        'What goes into a new patio, step by step, and the paving, jointing and edging you need to finish it.',
    },
  },
  {
    slug: 'composite-deck',
    name: 'A composite deck',
    h1: 'Planning a composite deck',
    intro: 'What a composite deck involves, and the boards, trims and lights to finish it.',
    story: [],
    steps: [
      'Measure the area and decide on the height and direction of the boards.',
      'Build a level frame on firm footings.',
      'Fix the boards with the clips made for them, then add the trims.',
    ],
    facts: [],
    points: [],
    ranges: ['composite-decking', 'outdoor-lighting'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Planning a composite deck: boards and fixings | Talasey',
      description:
        'What a composite deck involves, step by step, with the boards, trims, fixings and lights you need for it.',
    },
  },
  {
    slug: 'shade-and-shelter',
    name: 'Shade and shelter',
    h1: 'Shade and shelter for the garden',
    intro: 'Pergolas and screens to make a patio usable in sun, wind and drizzle.',
    story: [],
    steps: [
      'Decide where you want shade or privacy, and measure the space.',
      'Choose a pergola, screens, or both.',
      'Check whether you need planning permission before you build against the house.',
    ],
    facts: [],
    points: [],
    ranges: ['pergolas', 'garden-screens'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Shade and shelter: pergolas and screens | Talasey',
      description:
        'Pergolas and decorative garden screens for shade, shelter and privacy on the patio, and what to think about first.',
    },
  },
  {
    slug: 'garden-room',
    name: 'A garden room',
    h1: 'Planning a garden room',
    intro: 'A room at the end of the garden: the base, the cladding and the lighting.',
    story: [],
    steps: [
      'Check the planning rules for the size and height you want.',
      'Lay a level base that suits the ground.',
      'Clad the outside and add lighting to the path.',
    ],
    facts: [],
    points: [],
    ranges: ['garden-rooms', 'composite-cladding', 'outdoor-lighting'],
    faqs: [],
    placeholder: true,
    seo: {
      title: 'Planning a garden room: base and cladding | Talasey',
      description:
        'What goes into a garden room, from the base and cladding to lighting the path, and where to start.',
    },
  },
];

const TALASEY_TEAM = { name: 'The Talasey team', role: null, isPerson: false };

export const fallbackGuides: Guide[] = [
  {
    slug: 'how-to-look-after-a-porcelain-patio',
    title: 'How to look after a porcelain patio',
    topic: 'Care',
    answer:
      'Sweep it often and wash it with water and a mild detergent. Porcelain does not need sealing.',
    steps: [
      'Sweep off leaves and grit so they cannot stain or scratch.',
      'Wash with warm water and a little mild detergent, then rinse.',
      'Use a cleaner made for porcelain on stubborn marks.',
      'Check the joints each autumn and fill any gaps before frost.',
    ],
    body: [],
    products: ['silver-grey-porcelain-paving', 'pavetuf-jointing-compound'],
    mainPage: '/porcelain-paving/',
    faqs: [],
    author: TALASEY_TEAM,
    publishedOn: '2026-11-13',
    placeholder: true,
    seo: {
      title: 'How to look after a porcelain patio | Talasey',
      description:
        'How to clean and care for a porcelain patio through the year: sweeping, washing, stubborn marks and the joints.',
    },
  },
  {
    slug: 'choosing-a-garden-screen',
    title: 'Choosing a decorative garden screen',
    topic: 'Buying',
    answer:
      'Pick the size that fits the space, then the finish: weathered steel, galvanised steel or a powder-coated colour.',
    steps: [
      'Measure the wall, fence or gap. Our screens are 1800 mm long and 300, 600 or 900 mm high.',
      'Choose a finish. Weathered steel turns a rust colour; galvanised stays silver grey.',
      'For a powder-coated screen, choose the colour as you add it to the basket.',
    ],
    body: [],
    products: [
      'abstract-branches-decorative-screen',
      'baroque-emblem-decorative-screen',
      'palm-frond-decorative-screen',
    ],
    mainPage: '/garden-screens/',
    faqs: [],
    author: TALASEY_TEAM,
    publishedOn: '2026-11-13',
    placeholder: true,
    seo: {
      title: 'Choosing a decorative garden screen | Talasey',
      description:
        'How to choose a laser-cut garden screen: the three sizes, the finishes, and powder-coated colours.',
    },
  },
];

export const fallbackInspiration: Inspiration[] = [];

export const fallbackFaqs: Record<string, Faq[]> = {
  Delivery: [
    {
      question: 'How is paving delivered?',
      answer:
        'Heavy orders come on a pallet by lorry. At checkout we ask whether a lorry can reach you and you choose the delivery day.',
    },
  ],
  Returns: [
    {
      question: 'Can I cancel an order?',
      answer:
        'You can cancel most orders within 14 days of delivery. Items made to your measurements can only be returned if they are faulty.',
    },
  ],
  Samples: [
    {
      question: 'How do I get samples?',
      answer:
        'Choose up to five free samples on our Free samples page and we will post them to you.',
    },
  ],
};
