import { isInStock, lowestPrice, type Product, type ProductVariant } from '@/api-client';
import { brandOf } from '@/lib/brands';
import { faqPageJsonLd, productJsonLd, type Availability } from '@/lib/seo';
import { productPath } from '@/lib/urls/keyword-map';

export { productPath };

export function productDescription(product: Product): string {
  const text = product.description ?? product.subtitle ?? product.title;
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text;
}

function availabilityOf(variant: ProductVariant): Availability {
  if (isInStock(variant)) return 'InStock';
  return !variant.stock.managed || variant.stock.backorder ? 'MadeToOrder' : 'OutOfStock';
}

const SIZE_OPTIONS = ['Size', 'Diameter', 'Length'];

// One Offer for the option the page opens on, with the identifiers the data has: GTIN from the
// barcode, otherwise our SKU as the MPN (PRD section 13). The product's questions, when it has
// any, go with it as an FAQ page.
export function productStructuredData(
  product: Product,
  variant: ProductVariant | null = null,
  faqs: { question: string; answer: string }[] = [],
) {
  const shown = variant ?? product.variants[0] ?? null;
  const size = SIZE_OPTIONS.map((title) => shown?.options[title]).find(Boolean);
  return [
    productJsonLd({
      name: product.title,
      description: productDescription(product),
      path: productPath(product.handle),
      sku: shown?.sku,
      gtin: shown?.barcode,
      mpn: shown?.barcode ? null : shown?.sku,
      color: shown?.options.Colour,
      size,
      image: shown?.thumbnail ?? product.thumbnail,
      brand: brandOf(product.title, product.brand) ?? 'Talasey',
      price: shown?.priceIncVat ?? (variant ? null : lowestPrice(product)),
      availability: shown ? availabilityOf(shown) : undefined,
      returnable: !product.madeToMeasure,
    }),
    ...(faqs.length > 0 ? [faqPageJsonLd(faqs)] : []),
  ];
}
