import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ZoneEditor } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Delivery zone' };

interface Props {
  params: Promise<{ zone: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function DeliveryZone({ params, searchParams }: Props) {
  const [{ zone: name }, { message, error }] = await Promise.all([params, searchParams]);
  if (!(await requireStaff('admin', 'delivery')).allowed) return <NotAllowed />;
  const api = await staffApi();
  const [{ data: zones = [] }, { data: days }] = await Promise.all([
    api.GET('/admin/delivery/zones'),
    api.GET('/admin/delivery/zones/{zone}/days', { params: { path: { zone: name } } }),
  ]);
  const zone = zones.find((candidate) => candidate.zone === name);
  if (!zone) notFound();
  return (
    <>
      <h1>{zone.zone}</h1>
      <Notice message={message} error={error} />
      <ZoneEditor zone={zone} days={days} />
    </>
  );
}
