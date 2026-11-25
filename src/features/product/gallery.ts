import type { ProductVariant } from '@/api-client';
import type { ProductPhoto } from './content';

export interface PhotoChoice {
  size?: string;
  finish?: string;
  colour?: string;
  // Every option chosen, by name, such as { Colour: 'Kandla Grey', Size: '600 × 900' }.
  options?: Record<string, string>;
}

const KEYS = ['size', 'finish', 'colour'] as const;

const showsChosen = (photo: ProductPhoto, chosen: PhotoChoice) =>
  !photo.shows || chosen.options?.[photo.shows.option] === photo.shows.value;

const matches = (photo: ProductPhoto, chosen: PhotoChoice) =>
  KEYS.every((key) => !photo[key] || photo[key] === chosen[key]) && showsChosen(photo, chosen);

const specificity = (photo: ProductPhoto) =>
  KEYS.filter((key) => photo[key]).length + (photo.shows ? 1 : 0);

// Photos for the size, finish and colour chosen: the closest matches first, then the photos that
// suit every option. The option's own photo, if there is one, leads.
export function photosFor(
  photos: ProductPhoto[],
  chosen: PhotoChoice,
  variant: Pick<ProductVariant, 'title'> & { thumbnail?: string | null },
  name: string,
): ProductPhoto[] {
  const ranked = photos
    .filter((photo) => matches(photo, chosen))
    .sort((a, b) => specificity(b) - specificity(a));
  const lead: ProductPhoto[] = variant.thumbnail
    ? [{ src: variant.thumbnail, alt: `${name}, ${variant.title}`, width: 800, height: 600 }]
    : [];
  return [...lead, ...ranked];
}

// A photo of one colour, for its swatch: the content team's photos tagged with that colour.
export function colourPhoto(photos: ProductPhoto[], colour: string): string | null {
  const wanted = colour.toLowerCase();
  const shown = (photo: ProductPhoto) =>
    photo.colour ?? (photo.shows?.option === 'Colour' ? photo.shows.value : null);
  return photos.find((photo) => shown(photo)?.toLowerCase() === wanted)?.src ?? null;
}
