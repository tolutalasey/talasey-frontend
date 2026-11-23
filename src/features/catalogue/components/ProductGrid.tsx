import { ProductCard } from '@/ui/ProductCard/ProductCard';
import { ShareButton } from '@/ui/ShareButton/ShareButton';
import type { ReactNode } from 'react';
import type { SampleOffer } from '@/api-client';
import type { SearchRecord } from '@/features/search';
import { offerFor, SampleButton } from '@/features/samples';
import { listingCards, productCard, type ListingCard } from '../cards';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: SearchRecord[];
  label: string;
  // How many cards at the top load their photo straight away.
  eager?: number;
  // A wide card placed after this many products, such as the free samples offer.
  insert?: { after: number; content: ReactNode };
  // On a range page: a card per colour, each with View product, Order sample and Share buttons,
  // as on the current site.
  byColour?: { offers: SampleOffer[] };
  // A short row, such as "You may also need": the cards share the full width.
  fill?: boolean;
}

function CardActions({ card, offers }: { card: ListingCard; offers: SampleOffer[] }) {
  const offer = offerFor(offers, card.handle, card.colour);
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
}: ProductGridProps) {
  const cards = byColour
    ? products.flatMap(listingCards).map((card, index) => (
        <li key={card.key}>
          <ProductCard
            {...card}
            loading={index < eager ? 'eager' : 'lazy'}
            actions={<CardActions card={card} offers={byColour.offers} />}
          />
        </li>
      ))
    : products.map((product, index) => (
        <li key={product.id}>
          <ProductCard {...productCard(product)} loading={index < eager ? 'eager' : 'lazy'} />
        </li>
      ));
  if (insert && cards.length > insert.after) {
    cards.splice(
      insert.after,
      0,
      <li key="insert" className={styles.wide}>
        {insert.content}
      </li>,
    );
  }
  return (
    <ul className={`${styles.grid} ${fill ? styles.fill : ''}`} aria-label={label}>
      {cards}
    </ul>
  );
}
