import type { Metadata } from 'next';
import { OrderList } from '@/features/admin';
import { NotAllowed, requireStaff, staffApi } from '@/features/staff';

export const metadata: Metadata = { title: 'Orders' };

export default async function Orders() {
  if (!(await requireStaff('admin', 'orders')).allowed) return <NotAllowed />;
  const { data: orders = [] } = await (await staffApi()).GET('/admin/orders');
  return (
    <>
      <h1>Orders</h1>
      {orders.length === 0 ? <p>No orders yet.</p> : <OrderList orders={orders} />}
    </>
  );
}
