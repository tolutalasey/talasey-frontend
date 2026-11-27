import { isAvailable, isInStock, lowestPrice, type Product } from '@/api-client';
import { brandOf } from '@/lib/brands';
import { COLOUR_OPTION, pageColours } from '@/lib/product-colours';

// What search and listings know about a product. The commerce server sends the same fields to
// Algolia, so both search adapters return the same thing.
export interface SearchRecord {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  brand: string | null;
  categories: string[];
  categoryNames: string[];
  options: Record<string, string[]>;
  skus: string[];
  priceFrom: number | null;
  hasOptions: boolean;
  availability: Availability[];
  thumbnail: string | null;
  updatedAt: string | null;
  // Lower first when sorted by Recommended.
  position: number;
  // One entry per colour for a product sold in several, so listings can show each colour.
  colours: ColourRecord[];
}

export interface ColourRecord {
  name: string;
  image: string | null;
  priceFrom: number | null;
  availability: Availability[];
}

export type Availability = 'in-stock' | 'available' | 'made-to-order';

// Stock that isn't counted can still be ordered: made to order when it has a lead time, otherwise
// simply available to order.
function availabilityOf(product: Product): Availability[] {
  const result: Availability[] = [];
  if (product.variants.some(isInStock)) result.push('in-stock');
  if (product.variants.some((variant) => !variant.stock.managed && isAvailable(variant))) {
    result.push(product.leadTime ? 'made-to-order' : 'available');
  }
  return result;
}

function coloursOf(product: Product): ColourRecord[] {
  return pageColours(product.options).map((name) => {
    const variants = product.variants.filter((variant) => variant.options[COLOUR_OPTION] === name);
    const prices = variants.flatMap((variant) =>
      variant.priceIncVat ? [variant.priceIncVat.amount] : [],
    );
    const image = product.images?.find(
      (photo) => photo.shows?.option === COLOUR_OPTION && photo.shows.value === name,
    );
    return {
      name,
      image: image?.url ?? null,
      priceFrom: prices.length > 0 ? Math.min(...prices) : null,
      availability: availabilityOf({ ...product, variants }),
    };
  });
}

export function toSearchRecord(product: Product): SearchRecord {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    brand: brandOf(product.title, product.brand),
    categories: product.categories.map((category) => category.handle),
    categoryNames: product.categories.map((category) => category.name),
    options: Object.fromEntries(product.options.map((option) => [option.title, option.values])),
    skus: product.variants.flatMap((variant) => (variant.sku ? [variant.sku] : [])),
    priceFrom: lowestPrice(product)?.amount ?? null,
    hasOptions: product.variants.length > 1,
    availability: availabilityOf(product),
    thumbnail: product.thumbnail,
    updatedAt: product.updatedAt,
    position: product.position,
    colours: coloursOf(product),
  };
}
