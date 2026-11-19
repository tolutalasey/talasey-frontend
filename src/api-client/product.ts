export interface Price {
  amount: number;
  currencyCode: string;
}

export interface VariantStock {
  // false means made to order: always available, never counted.
  managed: boolean;
  quantity: number | null;
  backorder: boolean;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  options: Record<string, string>;
  priceIncVat: Price | null;
  stock: VariantStock;
  coverageM2: number | null;
  weightKg: number | null;
  thumbnail: string | null;
}

export interface ProductOption {
  title: string;
  values: string[];
}

export interface ProductCategory {
  handle: string;
  name: string;
}

// From the master sheet: a colour set is offered when an option has a value, for example
// "Powder coat colour" when Finish is Powder Coated (page type 1B).
export interface ColourChoice {
  label: string;
  option: string | null;
  value: string | null;
  required: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  // The one option this photo shows, such as Colour: Kandla Grey; none suits every option.
  shows?: { option: string; value: string } | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle: string | null;
  brand: string | null;
  description: string | null;
  thumbnail: string | null;
  madeToMeasure: boolean;
  // 4 means the product is bought through a builder, like the pergolas.
  pageType: string | null;
  updatedAt: string | null;
  categories: ProductCategory[];
  options: ProductOption[];
  colourChoice: ColourChoice | null;
  variants: ProductVariant[];
  images?: ProductImage[];
  leadTime?: { minDays: number; maxDays: number } | null;
}

export interface Colour {
  id: string;
  name: string;
  hex: string;
  photoUrl: string | null;
}

export interface ColourOffer {
  required: boolean;
  colours: Colour[];
}

export function lowestPrice(product: Product): Price | null {
  return product.variants.reduce<Price | null>((lowest, variant) => {
    const price = variant.priceIncVat;
    if (!price) return lowest;
    return !lowest || price.amount < lowest.amount ? price : lowest;
  }, null);
}

export const isAvailable = ({ stock }: ProductVariant) =>
  !stock.managed || stock.backorder || (stock.quantity ?? 0) > 0;

export const isInStock = ({ stock }: ProductVariant) => stock.managed && (stock.quantity ?? 0) > 0;
