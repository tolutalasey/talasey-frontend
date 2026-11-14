import 'server-only';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const COOKIE = 'talasey_customer';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function readCustomerToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE)?.value;
}

export async function rememberCustomer(token: string): Promise<void> {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.APP_ENV !== 'development',
    path: '/',
    maxAge: THIRTY_DAYS,
  });
}

export async function forgetCustomer(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
