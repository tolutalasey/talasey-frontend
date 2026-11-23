import type { ProductCardProps } from '@/ui/ProductCard/ProductCard';
import type { StockStatusProps } from '@/ui/StockStatus/StockStatus';
import type { SearchRecord } from '@/features/search';
import { formatPrice } from '@/lib/format';
import { colourPath, colourTitle } from '@/lib/product-colours';
import { productPath } from '@/lib/urls/keyword-map';
import { cardImage } from './images';

function stockOf({ availability }: Pick<SearchRecord, 'availability'>): StockStatusProps {
  if (availability.includes('in-stock')) return { level: 'in-stock', label: 'In stock' };
  if (availability.includes('available')) return { level: 'in-stock', label: 'Available to order' };
  if (availability.includes('made-to-order')) {
    return { level: 'made-to-order', label: 'Made to order' };
  }
  return { level: 'out-of-stock', label: 'Out of stock' };
}

function badgeOf(record: SearchRecord): string | undefined {
  const colours = record.options.Colour?.length ?? 0;
  return colours > 1 ? `${colours} colours` : undefined;
}

const gbp = (amount: number | null) =>
  amount === null ? null : formatPrice({ amount, currencyCode: 'GBP' });

export function productCard(record: SearchRecord): ProductCardProps {
  const price = gbp(record.priceFrom);
  return {
    href: productPath(record.handle),
    name: record.title,
    image: cardImage(record.thumbnail, record.title),
    price: price && (record.hasOptions ? `From ${price}` : price),
    priceNote: 'inc. VAT',
    stock: stockOf(record),
    badge: badgeOf(record),
  };
}

export interface ListingCard extends ProductCardProps {
  key: string;
  handle: string;
  colour: string | null;
}

// On a range page each colour of a product is its own card, as on the current site.
export function listingCards(record: SearchRecord): ListingCard[] {
  if (record.colours.length === 0) {
    return [{ ...productCard(record), key: record.id, handle: record.handle, colour: null }];
  }
  return record.colours.map((colour) => {
    const name = colourTitle(record.title, colour.name);
    const price = gbp(colour.priceFrom);
    return {
      key: `${record.id}-${colour.name}`,
      handle: record.handle,
      colour: colour.name,
      href: colourPath(record.handle, colour.name),
      name,
      image: cardImage(colour.image ?? record.thumbnail, name),
      price,
      priceNote: 'inc. VAT',
      stock: stockOf(colour),
    };
  });
}
