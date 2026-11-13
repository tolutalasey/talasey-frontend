'use server';

import { ApiError, createStaffClient } from '@/api-client';
import { redirect } from 'next/navigation';
import { apiUrl } from '@/lib/commerce';
import { done, failed } from './feedback';
import { text } from './form';
import {
  forgetChallenge,
  forgetSession,
  forgetTwoFactorSetup,
  rememberChallenge,
  rememberSession,
  rememberTwoFactorSetup,
  savedChallenge,
  sessionToken,
  signInPath,
  type StaffArea,
} from './session.server';

const area = (form: FormData): StaffArea => (form.get('area') === 'content' ? 'content' : 'admin');

// Only paths inside the same area, so the sign-in page can't be used to send people elsewhere.
const safeNext = (value: string | null, home: string) =>
  value && value.startsWith(home) && !value.startsWith('//') ? value : home;

const accountPath = (form: FormData) => `/${area(form)}/account/`;

function signInProblem(where: StaffArea, error: unknown, extra = ''): never {
  if (!(error instanceof ApiError)) throw error;
  const message = error.status === 400 ? 'Fill in every field' : error.message;
  redirect(`${signInPath(where)}?error=${encodeURIComponent(message)}${extra}`);
}

async function signedInClient() {
  return createStaffClient({ baseUrl: apiUrl(), token: await sessionToken() });
}

async function attempt(path: string, success: string, call: () => Promise<unknown>) {
  try {
    await call();
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    failed(path, error.status === 400 ? 'Enter the 6-digit code from the app' : error.message);
  }
  done(path, success);
}

export async function signIn(form: FormData) {
  const where = area(form);
  const next = text(form, 'next');
  let result;
  try {
    result = await createStaffClient({ baseUrl: apiUrl() }).signIn(
      text(form, 'email') ?? '',
      String(form.get('password') ?? ''),
    );
  } catch (error) {
    signInProblem(where, error);
  }
  if (result.status === 'code-needed') {
    await rememberChallenge(result.challenge);
    redirect(`${signInPath(where, next ?? undefined)}${next ? '&' : '?'}step=code`);
  }
  await rememberSession(result.token);
  redirect(safeNext(next, `/${where}/`));
}

export async function signInWithCode(form: FormData) {
  const where = area(form);
  const challenge = await savedChallenge();
  if (!challenge) redirect(signInPath(where));
  try {
    const session = await createStaffClient({ baseUrl: apiUrl() }).signInCode(
      challenge,
      text(form, 'code') ?? '',
    );
    await forgetChallenge();
    await rememberSession(session.token);
  } catch (error) {
    const expired = error instanceof ApiError && /expired|Too many/.test(error.message);
    if (expired) await forgetChallenge();
    signInProblem(where, error, expired ? '' : '&step=code');
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

export async function changePassword(form: FormData) {
  const path = accountPath(form);
  const next = String(form.get('newPassword') ?? '');
  if (next !== String(form.get('confirmPassword') ?? ''))
    failed(path, 'The two new passwords are not the same');
  if (next.length < 10) failed(path, 'Use at least 10 characters for the new password');
  const api = await signedInClient();
  await attempt(path, 'Password changed.', () =>
    api.changePassword(String(form.get('currentPassword') ?? ''), next),
  );
}

export async function startTwoFactor(form: FormData) {
  const setup = await (await signedInClient()).setUpTwoFactor();
  await rememberTwoFactorSetup(setup);
  redirect(accountPath(form));
}

export async function turnOnTwoFactor(form: FormData) {
  const api = await signedInClient();
  await attempt(
    accountPath(form),
    'Two-factor is on. You will need a code from the app each time you sign in.',
    async () => {
      await api.turnOnTwoFactor(text(form, 'code') ?? '');
      await forgetTwoFactorSetup();
    },
  );
}

export async function turnOffTwoFactor(form: FormData) {
  const api = await signedInClient();
  await attempt(accountPath(form), 'Two-factor is off.', () =>
    api.turnOffTwoFactor(text(form, 'code') ?? ''),
  );
}
