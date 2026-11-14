import type { Metadata } from 'next';
import { SamplesAdmin } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Samples' };

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function Samples({ searchParams }: Props) {
  const { message, error } = await searchParams;
  if (!(await requireStaff('admin', 'orders')).allowed) return <NotAllowed />;
  const api = await staffApi();
  const [{ data: waiting = [] }, { data: sent = [] }, { data: offers = [] }] = await Promise.all([
    api.GET('/admin/samples/requests', { params: { query: { status: 'new' } } }),
    api.GET('/admin/samples/requests', { params: { query: { status: 'dispatched' } } }),
    api.GET('/admin/samples/offers'),
  ]);
  return (
    <>
      <h1>Samples</h1>
      <Notice message={message} error={error} />
      <SamplesAdmin waiting={waiting} sent={sent} offers={offers} />
    </>
  );
}
