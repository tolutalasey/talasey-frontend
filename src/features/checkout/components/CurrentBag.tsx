import { BagLink } from '@/features/layout';
import { getBasket } from '../loaders.server';

// The header's bag link with the number of items in the visitor's basket.
export async function CurrentBag() {
  const basket = await getBasket().catch(() => null);
  return <BagLink count={basket?.lines.length ?? 0} />;
}
