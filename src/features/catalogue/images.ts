import { standInPhoto } from '@/lib/stand-in-photo';
import type { ProductCardImage } from '@/ui/ProductCard/ProductCard';

// Product photos are added in /admin. Until a product has one, cards show a brochure photo of the
// same kind of product.
export function cardImage(thumbnail: string | null, name: string): ProductCardImage {
  if (thumbnail) return { src: thumbnail, alt: name, width: 800, height: 600 };
  return { ...standInPhoto(name), alt: '' };
}
