import 'server-only';
import {
  isInStock,
  type ColourOffer,
  type Product,
  type ProductVariant,
  type SampleOffer,
} from '@/api-client';
import type { StockStatusProps } from '@/ui/StockStatus/StockStatus';
import { getRanges, rangeForProduct, rangePath } from '@/features/catalogue';
import { getProductSampleOffers } from '@/features/samples';
import { brandOf } from '@/lib/brands';
import { formatPrice } from '@/lib/format';
import type { BreadcrumbItem } from '@/lib/seo';
import { slugify } from '@/lib/slug';
import { productPath } from '@/lib/urls/keyword-map';
import type { ProductContent, ProductPhoto } from './content';
import { photosFor } from './gallery';
import { getColours, getCompanions, getProduct, getProductContent } from './loaders.server';
import { packPricing, type PackPricing } from './pricing';
import { optionGroups, resolveSelection, type OptionGroup } from './selection';

type Params = Record<string, string | string[] | undefined>;

export interface ColourView {
  label: string;
  required: boolean;
  options: { id: string; name: string; hex: string }[];
  selected: string | null;
}

export interface ProductView {
  product: Product;
  variant: ProductVariant | null;
  brand: string | null;
  breadcrumbs: BreadcrumbItem[];
  photos: ProductPhoto[];
  pricing: PackPricing | null;
  stock: StockStatusProps;
  options: OptionGroup[];
  colours: ColourView | null;
  extras: {
    variantId: string;
    name: string;
    reason: string;
    price: string | null;
    pricePence: number | null;
    coverageM2: number | null;
  }[];
  samples: SampleOffer[];
  content: ProductContent;
  path: string;
}

function stockOf(variant: ProductVariant | null): StockStatusProps {
  if (!variant) return { level: 'out-of-stock', label: 'Not available online yet' };
  if (isInStock(variant)) return { level: 'in-stock', label: `${variant.stock.quantity} in stock` };
  if (!variant.stock.managed || variant.stock.backorder) {
    return { level: 'made-to-order', label: 'Made to order' };
  }
  return { level: 'out-of-stock', label: 'Out of stock' };
}

// A colour set opens on the colour asked for with ?colour=, otherwise its first colour.
function colourView(
  offer: ColourOffer | null,
  product: Product,
  asked: string | null,
): ColourView | null {
  if (!offer || offer.colours.length === 0) return null;
  const wanted = offer.colours.find((colour) => slugify(colour.name) === asked) ?? offer.colours[0];
  return {
    label: product.colourChoice?.label ?? 'Colour',
    required: offer.required,
    options: offer.colours.map(({ id, name, hex }) => ({ id, name, hex })),
    selected: wanted?.id ?? null,
  };
}

export async function getProductView(handle: string, params: Params): Promise<ProductView | null> {
  const product = await getProduct(handle);
  if (!product) return null;

  const [content, ranges] = await Promise.all([getProductContent(handle), getRanges()]);
  const selection = resolveSelection(product, params);
  const { variant } = selection;
  const [offer, companions, samples] = await Promise.all([
    product.colourChoice && variant ? getColours(product, variant.options) : null,
    getCompanions(content),
    getProductSampleOffers(handle),
  ]);
  const colours = colourView(offer, product, selection.colourParam);
  const colourName = colours?.options.find((colour) => colour.id === colours.selected)?.name;
  const range = rangeForProduct(ranges, product);
  const path = productPath(product.handle);

  return {
    product,
    variant,
    brand: brandOf(product.title, product.brand),
    breadcrumbs: [
      { name: 'Home', path: '/' },
      ...(range ? [{ name: range.name, path: rangePath(range) }] : []),
      { name: product.title, path },
    ],
    photos: photosFor(
      content.photos,
      {
        size: variant?.options.Size,
        finish: variant?.options.Finish,
        colour: variant?.options.Colour ?? colourName,
      },
      variant ?? { title: product.title },
      product.title,
    ),
    pricing: variant ? packPricing(variant) : null,
    stock: stockOf(variant),
    options: optionGroups(product, selection),
    colours,
    extras: companions.map(({ product: extra, variantId, reason }) => {
      const chosen = extra.variants.find((v) => v.id === variantId);
      const price = chosen?.priceIncVat;
      return {
        variantId,
        name: extra.title,
        reason,
        price: price ? formatPrice(price) : null,
        pricePence: price ? Math.round(price.amount * 100) : null,
        coverageM2: chosen?.coverageM2 ?? null,
      };
    }),
    samples,
    content,
    path,
  };
}
