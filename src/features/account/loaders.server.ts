import 'server-only';
import type { Account } from '@/api-client';
import { getAccountClient } from '@/lib/commerce';
import { readCustomerToken } from './session.server';

// The signed-in customer's orders and samples, or null when nobody is signed in.
export async function getAccount(): Promise<Account | null> {
  const token = await readCustomerToken();
  return token ? getAccountClient().account(token) : null;
}
