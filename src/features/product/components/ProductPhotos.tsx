import { standInPhoto } from '@/lib/stand-in-photo';
import { Gallery } from '@/ui/Gallery/Gallery';
import type { ProductPhoto } from '../content';

export function ProductPhotos({ photos, name }: { photos: ProductPhoto[]; name: string }) {
  const shown = photos.length > 0 ? photos : [{ ...standInPhoto(name), alt: name }];
  return (
    <Gallery
      label={`Photos of ${name}`}
      images={shown.map((photo, index) => ({ id: `${index}-${photo.src}`, ...photo }))}
    />
  );
}
