// A photo for the top of each range page, from the 2026 brochures in public/images/brand.
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

const PHOTOS: Record<string, RangePhoto> = {
  'porcelain-paving': brand('paving-pale-patio', 1600, 1199),
  'natural-stone-paving': brand('project-patio', 1600, 1200),
  'composite-decking': showcase('20', 720, 510),
  'composite-cladding': brand('project-screens', 1600, 1200),
  'composite-fencing': brand('project-lighting', 1600, 1200),
  'paving-jointing': brand('jointing', 900, 900),
  pergolas: brand('hero-pergola-patio', 1234, 873),
  'garden-rooms': brand('project-pergola', 1405, 1054),
  planters: brand('corten-planter', 900, 900),
  'fire-pits': showcase('13', 720, 510),
  'garden-sculptures': showcase('04', 720, 510),
  'garden-screens': showcase('15', 720, 510),
  'outdoor-lighting': brand('project-lighting', 1600, 1200),
  'garden-furniture': showcase('09', 720, 510),
  'garden-edging': showcase('02', 720, 510),
  'cleaners-and-sealers': brand('paving-light-grey', 900, 900),
  'paving-installation': brand('natural-stone', 900, 900),
};

export const rangePhoto = (slug: string): RangePhoto =>
  PHOTOS[slug] ?? brand('samples-mixed', 1600, 1200);

// Ranges whose products can be sent as free samples, so the grid offers them.
export const offersSamples = (slug: string) =>
  slug === 'porcelain-paving' || slug === 'natural-stone-paving';
