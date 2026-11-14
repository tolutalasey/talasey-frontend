// Photos and links from Talasey's 2026 brochures. Some photos were contributed by landscaping
// firms; talasey.co.uk/brochures/ credits them.
export interface BrandPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

const photo = (name: string, alt: string, width: number, height: number, caption?: string) => ({
  src: `/images/brand/${name}.jpg`,
  alt,
  width,
  height,
  caption,
});

export const heroPhoto = photo(
  'hero-pergola-patio',
  'An anthracite pergola over a garden sofa on a pale porcelain patio beside a brick house',
  1234,
  873,
  'Prestige free standing pergola on light porcelain paving',
);

// In the order of the project tiles in /content; a fifth tile or more reuses from the start.
export const projectPhotos = [
  photo('project-patio', 'Natural stone patio with two sun loungers beside a lawn', 1600, 1200),
  photo('paving-anthracite', 'Anthracite porcelain patio with rattan garden furniture', 900, 900),
  photo('project-pergola', 'A pergola with LED lighting over a dining table at dusk', 1405, 1054),
  photo('project-lighting', 'A garden at night lit by low lights along a fence', 1600, 1200),
];

export const seasonPhoto = photo(
  'pergola-dusk',
  'A pergola with privacy screens and built-in lights at sunset',
  1491,
  772,
  'Prestige free standing pergola with privacy screens',
);

export const madeToMeasurePhoto = photo(
  'corten-planter',
  'A large corten steel planter full of flowers on a patio',
  900,
  900,
  'Corten steel planter, made to measure',
);

export const samplesPhoto = photo(
  'samples-mixed',
  'Porcelain paving in mixed light and warm tones beside a planted border',
  1600,
  1200,
);

const showcase = (n: number, caption: string, width: number, height: number): BrandPhoto => ({
  src: `/images/brand/showcase/${String(n).padStart(2, '0')}.jpg`,
  alt: caption,
  width,
  height,
  caption,
});

// Four columns that drift past each other; each column scrolls on its own.
export const showcaseColumns: BrandPhoto[][] = [
  [
    showcase(1, 'Pergola with screens over a pool terrace', 720, 510),
    showcase(2, 'Corten edging along a curved border', 720, 510),
    showcase(3, 'Porcelain terrace by a pool', 720, 686),
    showcase(4, 'Corten stag sculptures', 720, 510),
    showcase(5, 'Pergola over an outdoor kitchen', 720, 510),
    showcase(6, 'Natural stone steps', 610, 720),
  ],
  [
    showcase(7, 'Steel star sculptures', 720, 510),
    showcase(8, 'Wall mounted pergola at dusk', 720, 510),
    showcase(9, 'Pale paving around a garden lounge', 720, 510),
    showcase(10, 'Anthracite porcelain patio', 720, 478),
    showcase(11, 'Corten moon sculpture', 720, 510),
    showcase(12, 'Pergola beside a plunge pool', 714, 720),
  ],
  [
    showcase(13, 'Fire pit sphere, lit', 720, 510),
    showcase(14, 'Sandstone patio from above', 646, 720),
    showcase(15, 'Laser-cut privacy screens', 720, 510),
    showcase(16, 'Dining under a lit pergola', 720, 373),
    showcase(17, 'Corten retaining edge', 720, 510),
    showcase(18, 'Buff porcelain patio', 479, 720),
  ],
  [
    showcase(19, 'Plug and play path lighting', 720, 510),
    showcase(20, 'Pergola on a timber deck', 720, 510),
    showcase(21, 'Steel planters on a deck', 720, 510),
    showcase(22, 'Sandstone patio with a bistro set', 639, 720),
    showcase(23, 'Decorative drain cover in porcelain', 720, 510),
    showcase(24, 'Glazed pergola at night', 690, 720),
  ],
];

const flipsnack = 'https://www.flipsnack.com/5A8B7E77C6F';

export const brochures = [
  {
    edition: '01',
    title: 'Porcelain and natural stone',
    href: `${flipsnack}/talasey-ltd-2025-porcelain-stone-brochure-tiyt22e3f2/full-view.html`,
    image: photo('paving-grey-house', '', 900, 900),
  },
  {
    edition: '03',
    title: 'Surfaces',
    href: `${flipsnack}/2026-surfaces-brochure_digital`,
    image: photo('paving-pale-patio', '', 1600, 1199),
  },
  {
    edition: '04',
    title: 'Finishing touches',
    href: `${flipsnack}/finishing-touches-brochure-by-talasey/full-view.html`,
    image: photo('project-screens', '', 1600, 1200),
  },
  {
    edition: '09',
    title: 'Pergolas',
    href: `${flipsnack}/talasey_pergolas_2026`,
    image: photo('hero-pergola-patio', '', 1234, 873),
  },
];

export const brochuresPage = 'https://talasey.co.uk/brochures/';
