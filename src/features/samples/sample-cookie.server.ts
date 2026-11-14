import 'server-only';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { MAX_SAMPLES } from './samples';

const SAMPLES_COOKIE = 'talasey_samples';
const THIRTY_DAYS = 60 * 60 * 24 * 30;
const UUID = /^[0-9a-f-]{36}$/;

// The sample basket is only a short list of sample ids, so it lives in a cookie: no account and
// nothing stored until the request is sent.
export async function chosenSampleIds(): Promise<string[]> {
  const value = (await cookies()).get(SAMPLES_COOKIE)?.value ?? '';
  return value
    .split(',')
    .filter((id) => UUID.test(id))
    .slice(0, MAX_SAMPLES);
}

export async function rememberSampleIds(ids: string[]) {
  const store = await cookies();
  if (ids.length === 0) {
    store.delete(SAMPLES_COOKIE);
    return;
  }
  store.set(SAMPLES_COOKIE, ids.slice(0, MAX_SAMPLES).join(','), {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.APP_ENV !== 'development',
    path: '/',
    maxAge: THIRTY_DAYS,
  });
}
