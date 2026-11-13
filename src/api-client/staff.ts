import { createApiClient, unwrap, type ApiClientOptions } from './client';
import type { components, paths } from './schema';

type Json<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;

export type SignInResult = Json<paths['/auth/sign-in']['post']['responses'][200]>;
export type StaffSession = Json<paths['/auth/sign-in/code']['post']['responses'][200]>;
export type StaffMember = StaffSession['user'];
export type StaffAccount = Json<paths['/admin/users']['get']['responses'][200]>[number];
export type AuditEntry = Json<paths['/admin/audit']['get']['responses'][200]>[number];

export type { components };

export function createStaffClient(options: ApiClientOptions) {
  const api = createApiClient(options);
  return {
    signIn: (email: string, password: string) =>
      unwrap(api.POST('/auth/sign-in', { body: { email, password } })),
    signInCode: (challenge: string, code: string) =>
      unwrap(api.POST('/auth/sign-in/code', { body: { challenge, code } })),
    me: () => unwrap(api.GET('/auth/me')),
    changePassword: (currentPassword: string, newPassword: string) =>
      unwrap(api.POST('/auth/password', { body: { currentPassword, newPassword } })),
    setUpTwoFactor: () => unwrap(api.POST('/auth/two-factor/setup')),
    turnOnTwoFactor: (code: string) => unwrap(api.POST('/auth/two-factor/on', { body: { code } })),
    turnOffTwoFactor: (code: string) =>
      unwrap(api.POST('/auth/two-factor/off', { body: { code } })),
    signOut: () => unwrap(api.POST('/auth/sign-out')),
    users: () => unwrap(api.GET('/admin/users')),
    auditLog: (query: { subject?: string; subjectId?: string; limit?: number } = {}) =>
      unwrap(api.GET('/admin/audit', { params: { query } })),
    restore: (entryId: string) =>
      unwrap(api.POST('/admin/audit/{id}/restore', { params: { path: { id: entryId } } })),
  };
}

export type StaffClient = ReturnType<typeof createStaffClient>;
