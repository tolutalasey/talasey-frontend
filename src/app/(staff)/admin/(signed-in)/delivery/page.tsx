import type { Metadata } from 'next';
import { ZoneEditor, ZoneList } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Delivery' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function Delivery({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('admin', 'delivery')).allowed) return <NotAllowed />;
  const { data: zones = [] } = await (await staffApi()).GET('/admin/delivery/zones');
  return (
    <>
      <h1>Delivery</h1>
      <Notice message={message} error={error} />
      <ZoneList zones={zones} />
      <h2>Add a zone</h2>
      <ZoneEditor />
    </>
  );
}
