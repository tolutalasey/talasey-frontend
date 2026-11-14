import type { Metadata } from 'next';
import { ZoneEditor, ZoneList } from '@/features/admin';
import { NotAllowed, Notice, PageHeader, requireStaff, staffApi } from '@/features/staff';

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
      <PageHeader
        title="Delivery"
        description="Postcode areas, what delivery costs in each, and the days pallets go out."
      />
      <Notice message={message} error={error} />
      <ZoneList zones={zones} />
      <h2>Add a zone</h2>
      <ZoneEditor />
    </>
  );
}
