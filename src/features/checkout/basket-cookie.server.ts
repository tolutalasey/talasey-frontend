import 'server-only';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const BASKET_COOKIE = 'talasey_basket';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

const BASKET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// A cookie left by an older version of the site, or edited by hand, counts as no basket.
export async function readBasketId(): Promise<string | undefined> {
  const id = (await cookies()).get(BASKET_COOKIE)?.value;
  return id && BASKET_ID.test(id) ? id : undefined;
}

export async function rememberBasket(id: string): Promise<void> {
  (await cookies()).set(BASKET_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.APP_ENV !== 'development',
    path: '/',
    maxAge: THIRTY_DAYS,
  });
}

export async function forgetBasket(): Promise<void> {
  (await cookies()).delete(BASKET_COOKIE);
}
