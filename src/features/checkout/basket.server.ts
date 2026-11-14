import 'server-only';
import type { CheckoutResult } from '@/api-client';
import { getBasketClient } from '@/lib/commerce';
import { forgetBasket, readBasketId } from './basket-cookie.server';

export const EXPIRED_MESSAGE = 'Your bag has expired. Add the items again.';

export async function currentBasketId(): Promise<string | undefined> {
  const id = await readBasketId();
  return id && (await getBasketClient().find(id)) ? id : undefined;
}

export async function completeBasket(): Promise<CheckoutResult<string>> {
  const basketId = await currentBasketId();
  if (!basketId) return { ok: false, message: EXPIRED_MESSAGE };

  const placed = await getBasketClient().placeOrder(basketId);
  if (placed.ok) await forgetBasket();
  return placed;
}
