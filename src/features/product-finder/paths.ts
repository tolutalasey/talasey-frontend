import { slugify } from '@/lib/slug';
import { productPath } from '@/lib/urls/keyword-map';
import { AREA_PARAM } from './answers';

export const PRODUCT_FINDER_PATH = '/product-finder/';

// The product page, opened on the matching colour and with the area already in its calculator.
export function recommendedProductPath(
  handle: string,
  colour: string | null,
  areaM2: number | null,
): string {
  const params = new URLSearchParams();
  if (colour) params.set('colour', slugify(colour));
  if (areaM2) params.set(AREA_PARAM, String(areaM2));
  const query = params.toString();
  return query ? `${productPath(handle)}?${query}` : productPath(handle);
}
