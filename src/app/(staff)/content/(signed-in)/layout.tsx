import type { ReactNode } from 'react';
import { NotAllowed, requireStaff, StaffShell } from '@/features/staff';
import { contentTypes } from './types.server';

export default async function ContentLayout({ children }: { children: ReactNode }) {
  const { me, allowed } = await requireStaff('content', 'content.edit');
  const types = allowed ? await contentTypes() : [];
  const links = [
    ...types.map((type) => ({ href: `/content/${type.type}/`, label: type.label })),
    { href: '/content/releases/', label: 'Releases', permission: 'content.publish' as const },
    { href: '/admin/', label: 'Admin', permission: 'catalogue' as const },
  ];
  return (
    <StaffShell area="content" title="Talasey content" links={links} me={me}>
      {allowed ? children : <NotAllowed />}
    </StaffShell>
  );
}
