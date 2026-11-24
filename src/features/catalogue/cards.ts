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
    swatches: record.colours.map(({ name, image }) => ({ name, image })),
  };
}

export interface ListingCard extends ProductCardProps {
  key: string;
  handle: string;
  // Set when the card is for one colour, so its sample can be ordered from the card.
  colour: string | null;
}

// On a range page each product is one card, with its colours shown as swatches.
export function listingCard(record: SearchRecord): ListingCard {
  const only = record.colours.length === 1 ? record.colours[0] : undefined;
  return {
    ...productCard(record),
    key: record.id,
    handle: record.handle,
    colour: only?.name ?? null,
    ...(only && {
      href: colourPath(record.handle, only.name),
      name: colourTitle(record.title, only.name),
    }),
  };
}
