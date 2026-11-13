import { Table } from '@/ui';
import NextLink from 'next/link';
import { money } from '@/features/staff';
import { DAY_STATUS, PAYMENT_STATUS, dateText } from '../labels';
import type { OrderSummary } from '../types';

export function OrderList({ orders }: { orders: OrderSummary[] }) {
  return (
    <Table caption={`${orders.length} most recent orders`}>
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Placed</th>
          <th scope="col">Customer</th>
          <th scope="col">Total</th>
          <th scope="col">Delivery</th>
          <th scope="col">Payment</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <th scope="row">
              <NextLink href={`/admin/orders/${order.id}/`}>#{order.number}</NextLink>
            </th>
            <td>{dateText(order.createdAt)}</td>
            <td>
              {order.name}, {order.postcode}
            </td>
            <td>{money(order.totalPence)}</td>
            <td>
              {order.shipment === 'pallet' && order.day
                ? `Pallet on ${dateText(order.day)} (${DAY_STATUS[order.dayStatus ?? 'held']})`
                : order.shipment === 'pallet'
                  ? 'Pallet'
                  : 'Parcel'}
            </td>
            <td>{PAYMENT_STATUS[order.paymentStatus]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
