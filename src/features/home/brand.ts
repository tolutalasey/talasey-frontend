// Photos and links from Talasey's 2026 brochures. Some photos were contributed by landscaping
// firms; talasey.co.uk/brochures/ credits them.
export interface BrandPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  href?: string;
}

const photo = (name: string, alt: string, width: number, height: number, caption?: string) => ({
  src: `/images/brand/${name}.jpg`,
  alt,
  width,
  height,
  caption,
});

const heroPhoto = photo(
  'hero-pergola-patio',
  'An anthracite pergola over a garden sofa on a pale porcelain patio beside a brick house',
  1234,
  873,
  'Prestige free standing pergola on light porcelain paving',
);

export const samplesPhoto = photo(
  'samples-mixed',
  'Porcelain paving in mixed light and warm tones beside a planted border',
  1600,
  1200,
);

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
