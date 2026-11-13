import 'server-only';
import { ApiError, createApiClient, createStaffClient, type StaffMember } from '@/api-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl } from '@/lib/commerce';
import { env } from '@/lib/env';

export type StaffArea = 'admin' | 'content';
export type Permission = StaffMember['permissions'][number];

const COOKIE = 'talasey_staff';
const SEVEN_DAYS = 7 * 24 * 60 * 60;

export async function rememberSession(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.APP_ENV !== 'development',
    path: '/',
    maxAge: SEVEN_DAYS,
  });
}

export async function forgetSession() {
  (await cookies()).delete(COOKIE);
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
