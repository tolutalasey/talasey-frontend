'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getAccountClient } from '@/lib/commerce';
import { settle } from '@/lib/form-feedback.server';
import { forgetCustomer, readCustomerToken, rememberCustomer } from './session.server';

const emailSchema = z.email('Enter an email address like name@example.com');

// A plain form post, so it works without JavaScript; the page reads the result back.
export async function requestSignInLink(form: FormData) {
  const email = String(form.get('email') ?? '').trim();
  const parsed = emailSchema.safeParse(email);
  await settle(
    'account',
    parsed.success
      ? { notice: 'sent', values: { email: parsed.data } }
      : {
          fieldErrors: { email: parsed.error.issues[0]?.message ?? 'Enter your email address' },
          values: { email },
        },
  );
  if (parsed.success) await getAccountClient().sendLink(parsed.data);
  refresh();
}

export async function continueSignIn(form: FormData) {
  const session = await getAccountClient().redeem(String(form.get('token') ?? ''));
  // In the address, because the page rendered after this redirect cannot see a cookie set here.
  if (!session) redirect('/account/?link=expired');
  await rememberCustomer(session.sessionToken);
  redirect('/account/');
}

export async function signOut() {
  const token = await readCustomerToken();
  if (token)
    await getAccountClient()
      .signOut(token)
      .catch(() => undefined);
  await forgetCustomer();
  redirect('/account/');
}
