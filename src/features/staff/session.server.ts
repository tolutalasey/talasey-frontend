import 'server-only';
import { ApiError, createApiClient, createStaffClient, type StaffMember } from '@/api-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl } from '@/lib/commerce';
import { env } from '@/lib/env';

export type StaffArea = 'admin' | 'content';
export type Permission = StaffMember['permissions'][number];

const COOKIE = 'talasey_staff';
const CHALLENGE_COOKIE = 'talasey_staff_challenge';
const SETUP_COOKIE = 'talasey_staff_two_factor';
const SEVEN_DAYS = 7 * 24 * 60 * 60;
const FIVE_MINUTES = 5 * 60;
const TEN_MINUTES = 10 * 60;

export interface TwoFactorSetup {
  secret: string;
  uri: string;
}

async function remember(name: string, value: string, maxAge: number) {
  (await cookies()).set(name, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.APP_ENV !== 'development',
    path: '/',
    maxAge,
  });
}

export const rememberSession = (token: string) => remember(COOKIE, token, SEVEN_DAYS);

export async function forgetSession() {
  (await cookies()).delete(COOKIE);
}

// Between the password and the code from the app: proof the password was right, kept only in
// an httpOnly cookie, so the password itself never has to be sent twice.
export const rememberChallenge = (challenge: string) =>
  remember(CHALLENGE_COOKIE, challenge, FIVE_MINUTES);

export async function savedChallenge(): Promise<string | undefined> {
  return (await cookies()).get(CHALLENGE_COOKIE)?.value;
}

export async function forgetChallenge() {
  (await cookies()).delete(CHALLENGE_COOKIE);
}

export const rememberTwoFactorSetup = (setup: TwoFactorSetup) =>
  remember(SETUP_COOKIE, JSON.stringify(setup), TEN_MINUTES);

export async function savedTwoFactorSetup(): Promise<TwoFactorSetup | null> {
  const value = (await cookies()).get(SETUP_COOKIE)?.value;
  return value ? (JSON.parse(value) as TwoFactorSetup) : null;
}

export async function forgetTwoFactorSetup() {
  (await cookies()).delete(SETUP_COOKIE);
}

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE)?.value;
}

export const signInPath = (area: StaffArea, next?: string) =>
  `/${area}/sign-in/${next ? `?next=${encodeURIComponent(next)}` : ''}`;

// The signed-in member of staff, or a trip to the sign-in page. With a permission, a role
// without it sees a plain "not for your role" page instead.
export async function requireStaff(area: StaffArea, permission?: Permission) {
  const token = await sessionToken();
  if (!token) redirect(signInPath(area));
  let me: StaffMember;
  try {
    me = await createStaffClient({ baseUrl: apiUrl(), token }).me();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(signInPath(area));
    throw error;
  }
  return { me, token, allowed: !permission || me.permissions.includes(permission) };
}

// A typed client for the staff routes, signed in as the current user.
export async function staffApi() {
  const token = await sessionToken();
  return createApiClient({ baseUrl: apiUrl(), token });
}
