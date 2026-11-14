import { Table } from '@/ui/Table/Table';
import NextLink from 'next/link';
import { money, staffStyles } from '@/features/staff';
import { DAY_STATUS, PAYMENT_STATUS, dateText } from '../labels';
import type { OrderSummary } from '../types';

const PAYMENT_TONE = {
  paid: staffStyles.good,
  partly_refunded: staffStyles.warn,
  refunded: staffStyles.bad,
} as const;

interface Props {
  orders: OrderSummary[];
  caption?: string;
}

export function OrderList({ orders, caption }: Props) {
  return (
    <Table caption={caption ?? `${orders.length} most recent orders`}>
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
              {order.shipment === 'pallet' && order.day ? (
                <>
                  Pallet on {dateText(order.day)}{' '}
                  <span
                    className={`${staffStyles.status} ${
                      order.dayStatus === 'needs-rebooking'
                        ? staffStyles.bad
                        : order.dayStatus === 'booked'
                          ? staffStyles.good
                          : staffStyles.warn
                    }`}
                  >
                    {DAY_STATUS[order.dayStatus ?? 'held']}
                  </span>
                </>
              ) : order.shipment === 'pallet' ? (
                'Pallet'
              ) : (
                'Parcel'
              )}
            </td>
            <td>
              <span className={`${staffStyles.status} ${PAYMENT_TONE[order.paymentStatus]}`}>
                {PAYMENT_STATUS[order.paymentStatus]}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
