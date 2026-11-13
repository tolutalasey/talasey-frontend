import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OrderDetail } from '@/features/admin';
import { NotAllowed, Notice, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Order' };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ id }, { message, error }] = await Promise.all([params, searchParams]);
  if (!(await requireStaff('admin', 'orders')).allowed) return <NotAllowed />;
  const { data: order } = await (
    await staffApi()
  ).GET('/admin/orders/{id}', {
    params: { path: { id } },
  });
  if (!order) notFound();
  return (
    <>
      <h1>Order #{order.number}</h1>
      <Notice message={message} error={error} />
      <OrderDetail order={order} />
    </>
  );
}
