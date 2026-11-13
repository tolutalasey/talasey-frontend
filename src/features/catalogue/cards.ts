import type { ProductCardProps } from '@/ui/ProductCard/ProductCard';
import type { StockStatusProps } from '@/ui/StockStatus/StockStatus';
import type { SearchRecord } from '@/features/search';
import { formatPrice } from '@/lib/format';
import { productPath } from '@/lib/urls/keyword-map';
import { cardImage } from './images';

function stockOf(record: SearchRecord): StockStatusProps {
  if (record.availability.includes('in-stock')) return { level: 'in-stock', label: 'In stock' };
  if (record.availability.includes('made-to-order')) {
    return { level: 'made-to-order', label: 'Made to order' };
  }
  return { level: 'out-of-stock', label: 'Out of stock' };
}

function badgeOf(record: SearchRecord): string | undefined {
  const colours = record.options.Colour?.length ?? 0;
  return colours > 1 ? `${colours} colours` : undefined;
}

export function productCard(record: SearchRecord): ProductCardProps {
  const price =
    record.priceFrom === null
      ? null
      : formatPrice({ amount: record.priceFrom, currencyCode: 'GBP' });
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
