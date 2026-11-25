import type { Product, ProductImage } from '@/api-client';
import { COLOUR_OPTION, pageColours } from '@/lib/product-colours';
import photos from './product-photos.json';
import { matchCurrentSite } from './match';

// The photos on the current site's product pages, for products with none uploaded in /admin yet.
// Photos added in /admin always take their place.
const UPLOADS = 'https://talasey.co.uk/wp-content/uploads/';

type Photo = [file: string, width: number, height: number];

const pages = Object.entries(photos as unknown as Record<string, Photo[]>).map(([slug, list]) => ({
  slug,
  list,
}));

const toImage = ([file, width, height]: Photo, alt: string, colour?: string): ProductImage => ({
  url: `${UPLOADS}${file}`,
  alt,
  width: width || null,
  height: height || null,
  shows: colour ? { option: COLOUR_OPTION, value: colour } : null,
});

export function withCurrentSitePhotos(product: Product): Product {
  if (product.images?.length) return product;
  const { own, byColour } = matchCurrentSite(product.handle, pageColours(product.options), pages);
  const images = [
    ...(own?.list ?? []).map((photo) => toImage(photo, product.title)),
    ...byColour.flatMap(({ colour, page }) =>
      page.list.map((photo) => toImage(photo, `${product.title}, ${colour}`, colour)),
    ),
  ];
  if (images.length === 0) return product;
  return { ...product, images, thumbnail: product.thumbnail ?? images[0]?.url ?? null };
}

// The current site's photo of one colour of a product, for a colour swatch.
export function currentSiteColourPhoto(handle: string, colour: string): string | null {
  const [match] = matchCurrentSite(handle, [colour], pages).byColour;
  const file = match?.page.list[0]?.[0];
  return file ? `${UPLOADS}${file}` : null;
}
