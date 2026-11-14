import type { Metadata } from 'next';
import { AddStaffForm, StaffAccounts } from '@/features/admin';
import {
  CreateMenu,
  NotAllowed,
  Notice,
  PageHeader,
  requireStaff,
  staffApi,
} from '@/features/staff';

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
      <PageHeader
        title="Staff"
        description="Who can sign in, what each person can do, and their passwords."
        actions={
          <CreateMenu label="Add someone">
            <AddStaffForm />
          </CreateMenu>
        }
      />
      <Notice message={message} error={error} />
      <StaffAccounts accounts={accounts} />
    </>
  );
}
