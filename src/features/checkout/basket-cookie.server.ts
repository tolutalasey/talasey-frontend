import 'server-only';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const BASKET_COOKIE = 'talasey_basket';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function readBasketId(): Promise<string | undefined> {
  return (await cookies()).get(BASKET_COOKIE)?.value;
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
