import type { ProductCardImage } from '@/ui/ProductCard/ProductCard';

// Product photos are added in /admin. Until a product has one, cards show a neutral tile.
export const PHOTO_COMING_SOON: ProductCardImage = {
  src: '/images/photo-coming-soon.svg',
  alt: '',
  width: 800,
  height: 600,
};

export function cardImage(thumbnail: string | null, name: string): ProductCardImage {
  return thumbnail ? { src: thumbnail, alt: name, width: 800, height: 600 } : PHOTO_COMING_SOON;
}
