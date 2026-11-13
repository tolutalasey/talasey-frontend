import { isAvailable, isInStock, lowestPrice, type Product } from '@/api-client';
import { brandOf } from '@/lib/brands';

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
}

export type Availability = 'in-stock' | 'made-to-order';

function availabilityOf(product: Product): Availability[] {
  const result: Availability[] = [];
  if (product.variants.some(isInStock)) result.push('in-stock');
  if (product.variants.some((variant) => !variant.stock.managed && isAvailable(variant))) {
    result.push('made-to-order');
  }
  return result;
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
  };
}
