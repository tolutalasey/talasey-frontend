import type { Metadata } from 'next';
import { StaffAccounts } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Staff' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function Users({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('admin', 'users')).allowed) return <NotAllowed />;
  const { data: accounts = [] } = await (await staffApi()).GET('/admin/users');
  return (
    <>
      <h1>Staff</h1>
      <Notice message={message} error={error} />
      <StaffAccounts accounts={accounts} />
    </>
  );
}
