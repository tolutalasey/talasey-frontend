export const FREE_SAMPLES = 3;
export const MAX_SAMPLES = 10;
export const SAMPLES_PATH = '/samples/';

interface Offer {
  id: string;
  label: string;
  productHandle: string;
}

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// The sample for a product, or for one of its colours when it comes in several.
export function offerFor<T extends Offer>(
  offers: T[],
  handle: string,
  colour: string | null,
): T | null {
  const own = offers.filter((offer) => offer.productHandle === handle);
  if (!colour) return own[0] ?? null;
  return (
    own.find((offer) => slug(offer.label).includes(slug(colour))) ??
    (own.length === 1 ? (own[0] ?? null) : null)
  );
}
