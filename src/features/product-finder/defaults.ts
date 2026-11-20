import type { FinderContent } from './content';

// Used until the product finder is published in /content.
export const defaultFinder: FinderContent = {
  heading: 'Find the right products for your garden',
  intro:
    'Answer five quick questions and we will pick out the products that suit your project, your style and your budget.',
  projects: [
    {
      label: 'A patio or path',
      hint: 'Porcelain and natural stone paving',
      ranges: 'porcelain-paving, natural-stone-paving',
    },
    { label: 'A deck', hint: 'Composite decking', ranges: 'composite-decking' },
    {
      label: 'A fence or screen',
      hint: 'Fencing and decorative screens',
      ranges: 'composite-fencing, garden-screens',
    },
    { label: 'Cladding a wall', hint: 'Composite cladding', ranges: 'composite-cladding' },
    {
      label: 'Shade and shelter',
      hint: 'Pergolas and garden rooms',
      ranges: 'pergolas, garden-rooms',
    },
    {
      label: 'Finishing touches',
      hint: 'Lighting, fire pits, planters and furniture',
      ranges: 'outdoor-lighting, fire-pits, planters, garden-furniture, garden-sculptures',
    },
  ],
  looks: [
    {
      label: 'Modern and clean',
      hint: 'Smooth surfaces and crisp lines',
      words:
        'porcelain, smooth, matt, contemporary, modern, slatted, aluminium, powder coated, geometric',
      reason: 'Modern look',
    },
    {
      label: 'Natural and traditional',
      hint: 'Stone, timber tones and texture',
      words:
        'sandstone, limestone, slate, natural, riven, traditional, timber, cedar, oak, weathered',
      reason: 'Natural look',
    },
    { label: 'A bit of both', hint: 'Show me everything', words: '', reason: null },
  ],
  colours: [
    {
      label: 'Light and bright',
      hint: null,
      words: 'white, ivory, cream, beige, light, sand, desert, dove, buff, silver',
      reason: 'Light colour',
    },
    {
      label: 'Cool greys',
      hint: null,
      words: 'grey, gray, smoke, slate, silver, cenere, ash',
      reason: 'Grey tones',
    },
    {
      label: 'Dark and bold',
      hint: null,
      words: 'black, charcoal, anthracite, carbon, graphite, dark, tempesta',
      reason: 'Dark colour',
    },
    {
      label: 'Warm tones',
      hint: null,
      words: 'brown, cedar, teak, oak, terra, autumn, gold, buff, weathered',
      reason: 'Warm tones',
    },
    { label: 'No preference', hint: null, words: '', reason: null },
  ],
  upkeep: [
    {
      label: 'As little as possible',
      hint: 'Wipe clean, no staining or sealing',
      words: 'porcelain, composite, aluminium, powder coated, galvanised, stainless',
      reason: 'Low upkeep',
    },
    { label: 'Some care is fine', hint: 'A clean and seal now and then', words: '', reason: null },
  ],
  budgets: [
    { label: 'Keeping costs down', hint: null, price: 'lower', reason: 'Good value' },
    { label: 'Somewhere in the middle', hint: null, price: 'any', reason: null },
    {
      label: 'Happy to invest',
      hint: 'For the best finish',
      price: 'higher',
      reason: 'Premium choice',
    },
  ],
  seo: {
    title: 'Product finder: paving, decking and more | Talasey',
    description:
      'Answer five quick questions about your garden project and get paving, decking, fencing and finishing touches picked out for you.',
  },
};
