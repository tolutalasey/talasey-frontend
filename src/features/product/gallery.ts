import type { ProductVariant } from '@/api-client';
import type { ProductPhoto } from './content';

export interface PhotoChoice {
  size?: string;
  finish?: string;
  colour?: string;
}

const KEYS = ['size', 'finish', 'colour'] as const;

const matches = (photo: ProductPhoto, chosen: PhotoChoice) =>
  KEYS.every((key) => !photo[key] || photo[key] === chosen[key]);

const specificity = (photo: ProductPhoto) => KEYS.filter((key) => photo[key]).length;

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
