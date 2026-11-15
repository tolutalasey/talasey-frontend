import type { RangeGalleryItem } from './ranges';

// Brochure photos for each range: the one at the top of the page, and a gallery for ranges whose
// products aren't on the shop yet. Photos added to a range page in /content take their place.
export interface RangePhoto {
  src: string;
  width: number;
  height: number;
}

const brand = (name: string, width: number, height: number): RangePhoto => ({
  src: `/images/brand/${name}.jpg`,
  width,
  height,
});

const showcase = (n: string, width: number, height: number) =>
  brand(`showcase/${n}`, width, height);

const range = (slug: string, n: number, width = 1600, height = 1132): RangePhoto => ({
  src: `/images/ranges/${slug}/${n}.jpg`,
  width,
  height,
});

const PHOTOS: Record<string, RangePhoto> = {
  'porcelain-paving': brand('paving-pale-patio', 1600, 1199),
  'natural-stone-paving': brand('project-patio', 1600, 1200),
  'composite-decking': showcase('20', 720, 510),
  'composite-cladding': brand('project-screens', 1600, 1200),
  'composite-fencing': brand('project-lighting', 1600, 1200),
  'paving-jointing': brand('jointing', 900, 900),
  pergolas: brand('hero-pergola-patio', 1234, 873),
  'garden-rooms': brand('project-pergola', 1405, 1054),
  planters: range('planters', 3),
  'fire-pits': range('fire-pits', 1, 1600, 1134),
  'garden-sculptures': range('garden-sculptures', 1),
  'garden-screens': range('garden-screens', 2, 1600, 1134),
  'outdoor-lighting': range('outdoor-lighting', 2, 1600, 1134),
  'garden-furniture': showcase('09', 720, 510),
  'garden-edging': range('garden-edging', 5, 1600, 1134),
  'cleaners-and-sealers': brand('paving-light-grey', 900, 900),
  'paving-installation': range('paving-installation', 1, 1600, 1241),
};

export const rangePhoto = (slug: string): RangePhoto =>
  PHOTOS[slug] ?? brand('samples-mixed', 1600, 1200);

const item = (photo: RangePhoto, caption: string): RangeGalleryItem => ({
  photo: { ...photo, alt: caption },
  caption,
});

const numbered = (slug: string, captions: string[], sizes: [number, number][] = []) =>
  captions.map((caption, index) =>
    item(range(slug, index + 1, ...(sizes[index] ?? [1600, 1132])), caption),
  );

const GALLERIES: Record<string, RangeGalleryItem[]> = {
  'garden-sculptures': numbered('garden-sculptures', [
    'Corten steel stag sculptures in a planted bed',
    'Stacked geometric spheres in weathered steel',
    'A crescent moon sculpture beside garden steps',
    'A red folded steel heart among grasses',
    'A brushed steel armillary sphere on paving',
    'Powder-coated star sculptures in purple and grey',
  ]),
  planters: numbered('planters', [
    'A long corten planter with a lattice front',
    'Dark steel planters full of flowers on a deck',
    'A low corten planter on a patio',
    'A tiered black planter against a grey fence',
  ]),
  'garden-screens': numbered('garden-screens', [
    'Corten steel screens with a leaf pattern',
    'Grey laser-cut screens beside a border',
    'Screens in purple, white and grey against a fence',
    'Black leaf screens on a white garden wall',
    'White patterned panels set into a dark frame',
    'Steel wall art above a planted border',
  ]),
  'fire-pits': [
    ...numbered(
      'fire-pits',
      ['A steel sphere fire pit alight at night', 'A steel sphere fire pit in a garden'],
      [
        [1600, 1134],
        [1600, 1132],
      ],
    ),
    item(showcase('13', 720, 510), 'Flames through a laser-cut fire pit'),
  ],
  'garden-edging': numbered(
    'garden-edging',
    [
      'Corten raised beds around a patio',
      'Steel edging around a lawn and seating area',
      'Grey steel edging along a gravel path',
      'Stainless steel edging on porcelain steps',
      'Corten steel edging stepping down a garden',
    ],
    [
      [1600, 1132],
      [1600, 1133],
      [1600, 1132],
      [1600, 1132],
      [1600, 1134],
    ],
  ),
  'outdoor-lighting': numbered('outdoor-lighting', [
    'Paving lit by deck lights at dusk',
    'Uplights along a fence at night',
    'Low lights along a path by a house',
    'A lit bridge over a garden pond',
  ]),
  'cleaners-and-sealers': numbered(
    'cleaners-and-sealers',
    [
      'A tub of Talasey jointing grout',
      'Sealer being applied to paving',
      'Jointing brushed into paving joints',
    ],
    [
      [1600, 595],
      [1600, 594],
      [1600, 591],
    ],
  ),
  'paving-installation': numbered(
    'paving-installation',
    [
      'Kerb edging beside a lawn',
      'Natural stone steps and paving',
      'Porcelain steps with a matching edge',
      'Primer being brushed onto the back of a slab',
      'A slab being laid on a mortar bed',
      'Jointing compound brushed into a patio',
    ],
    [
      [1600, 1241],
      [1600, 683],
      [1600, 807],
      [1600, 1066],
      [1600, 887],
      [1600, 594],
    ],
  ),
  'composite-decking': [
    item(showcase('21', 720, 510), 'Steel planters on composite decking'),
    item(showcase('20', 720, 510), 'A pergola over a dining deck'),
  ],
  'composite-cladding': [
    item(brand('project-screens', 1600, 1200), 'Cladding and screens around a garden'),
    item(showcase('10', 720, 510), 'A patio beside a clad garden building'),
  ],
  'composite-fencing': [
    item(brand('project-lighting', 1600, 1200), 'Slatted fencing lit at night'),
    item(showcase('22', 720, 510), 'A patio enclosed by fencing'),
  ],
  'garden-rooms': [
    item(brand('project-pergola', 1405, 1054), 'An outdoor room under a lit pergola'),
    item(showcase('05', 720, 510), 'An outdoor kitchen under a pergola'),
    item(showcase('24', 720, 510), 'A glazed pergola room at night'),
  ],
  'garden-furniture': [
    item(showcase('09', 720, 510), 'Garden furniture under a parasol'),
    item(showcase('10', 720, 510), 'An outdoor sofa set on a dark patio'),
    item(showcase('22', 720, 510), 'A bistro table and chairs on paving'),
  ],
};

export const rangeGallery = (slug: string): RangeGalleryItem[] => GALLERIES[slug] ?? [];

// Ranges whose products can be sent as free samples, so the grid offers them.
export const offersSamples = (slug: string) =>
  slug === 'porcelain-paving' || slug === 'natural-stone-paving';
