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

// The sliding row of finished gardens under "Popular this season".
export const gardenPhotos: BrandPhoto[] = [
  showcase(3, 'Porcelain terrace by a pool', 720, 686),
  showcase(15, 'Laser-cut privacy screens', 720, 510),
  showcase(14, 'Sandstone patio from above', 646, 720),
  showcase(13, 'Fire pit sphere, lit', 720, 510),
  showcase(21, 'Steel planters on a deck', 720, 510),
  showcase(9, 'Pale paving around a garden lounge', 720, 510),
  showcase(2, 'Corten edging along a curved border', 720, 510),
  showcase(10, 'Anthracite porcelain patio', 720, 478),
];

// The pergola card cycles through these, one every five seconds.
const captioned = (picture: BrandPhoto, caption: string): BrandPhoto => ({ ...picture, caption });

export const pergolaPhotos: BrandPhoto[] = [
  captioned(seasonPhoto, 'Free standing, with privacy screens'),
  captioned(
    showcase(1, 'A pergola with screens over a pool terrace', 720, 510),
    'Over a pool terrace',
  ),
  captioned(showcase(5, 'A pergola over an outdoor kitchen', 720, 510), 'Over an outdoor kitchen'),
  captioned(showcase(8, 'A wall mounted pergola at dusk', 720, 510), 'Wall mounted, at dusk'),
  captioned(showcase(20, 'A pergola on a timber deck', 720, 510), 'On a timber deck'),
  captioned(showcase(24, 'A glazed pergola at night', 690, 720), 'Glazed, at night'),
];

export interface HeroScene {
  photo: BrandPhoto;
  topic: string;
  title: string;
  href: string;
}

// The hero photo changes every six seconds; each scene has a tab that links to its range.
export const heroScenes: HeroScene[] = [
  {
    photo: heroPhoto,
    topic: 'Pergolas',
    title: 'Prestige free standing pergola',
    href: '/pergolas/',
  },
  {
    photo: photo(
      'project-patio',
      'A natural stone patio with two sun loungers beside a lawn',
      1600,
      1200,
    ),
    topic: 'Natural stone',
    title: 'Sandstone patios',
    href: '/natural-stone-paving/',
  },
  {
    photo: photo(
      'project-lighting',
      'A garden at night lit by low lights along a fence',
      1600,
      1200,
    ),
    topic: 'Lighting',
    title: 'Plug and play garden lights',
    href: '/outdoor-lighting/',
  },
];
