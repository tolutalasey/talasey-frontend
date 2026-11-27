import { ProductCard } from '@/ui/ProductCard/ProductCard';
import { ShareButton } from '@/ui/ShareButton/ShareButton';
import type { ReactNode } from 'react';
import type { SampleOffer } from '@/api-client';
import type { SearchRecord } from '@/features/search';
import { offerFor, SampleButton } from '@/features/samples';
import { colourCards, listingCard, productCard, type ListingCard } from '../cards';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: SearchRecord[];
  label: string;
  // How many cards at the top load their photo straight away.
  eager?: number;
  // A wide card placed after this many products, such as the free samples offer; full takes a
  // whole row, as a heading does.
  insert?: { after: number; content: ReactNode; full?: boolean };
  // On a range page: each card has View product, Order sample and Share buttons.
  // With split, each colour is its own card, as on a product's colours page.
  byColour?: { offers: SampleOffer[]; split?: boolean };
  // A short row, such as "You may also need": the cards share the full width.
  fill?: boolean;
  // How photos sit in the cards: packshots look best whole.
  fit?: 'cover' | 'contain';
  // One more card after the products, such as a made-to-order piece.
  last?: ReactNode;
}

function CardActions({ card, offers }: { card: ListingCard; offers: SampleOffer[] }) {
  const manyColours = (card.swatches?.length ?? 0) > 1;
  const offer = manyColours ? undefined : offerFor(offers, card.handle, card.colour);
  return (
    <>
      <a href={card.href}>View product</a>
      {offer && <SampleButton offerId={offer.id} name={card.name} />}
      <ShareButton title={card.name} path={card.href} />
    </>
  );
}

export function ProductGrid({
  products,
  label,
  eager = 0,
  insert,
  byColour,
  fill = false,
  fit = 'cover',
  last,
}: ProductGridProps) {
  const cards = byColour
    ? products.flatMap(byColour.split ? colourCards : listingCard).map((card, index) => (
        <li key={card.key}>
          <ProductCard
            {...card}
            fit={fit}
            loading={index < eager ? 'eager' : 'lazy'}
            actions={<CardActions card={card} offers={byColour.offers} />}
          />
        </li>
      ))
    : products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            {...productCard(product)}
            fit={fit}
            loading={index < eager ? 'eager' : 'lazy'}
          />
        </li>
      ));
  if (insert && cards.length > insert.after) {
    cards.splice(
      insert.after,
      0,
      <li key="insert" className={insert.full ? styles.full : styles.wide}>
        {insert.content}
      </li>,
    );
  }
  return (
    <ul className={`${styles.grid} ${fill ? styles.fill : ''}`} aria-label={label}>
      {cards}
      {last && <li>{last}</li>}
    </ul>
  );
}
