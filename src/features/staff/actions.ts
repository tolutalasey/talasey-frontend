'use server';

import { ApiError, createStaffClient } from '@/api-client';
import { redirect } from 'next/navigation';
import { apiUrl } from '@/lib/commerce';
import { text } from './form';
import {
  forgetSession,
  rememberSession,
  sessionToken,
  signInPath,
  type StaffArea,
} from './session.server';

const area = (form: FormData): StaffArea => (form.get('area') === 'content' ? 'content' : 'admin');

// Only paths inside the same area, so the sign-in page can't be used to send people elsewhere.
const safeNext = (value: string | null, home: string) =>
  value && value.startsWith(home) && !value.startsWith('//') ? value : home;

export async function signIn(form: FormData) {
  const where = area(form);
  const email = text(form, 'email') ?? '';
  const password = String(form.get('password') ?? '');
  try {
    const session = await createStaffClient({ baseUrl: apiUrl() }).signIn(email, password);
    await rememberSession(session.token);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    const message = error.status === 400 ? 'Enter your email and password' : error.message;
    redirect(`${signInPath(where)}?error=${encodeURIComponent(message)}`);
  }
  redirect(safeNext(text(form, 'next'), `/${where}/`));
}

export async function signOut(form: FormData) {
  const token = await sessionToken();
  if (token)
    await createStaffClient({ baseUrl: apiUrl(), token })
      .signOut()
      .catch(() => undefined);
  await forgetSession();
  redirect(signInPath(area(form)));
}
