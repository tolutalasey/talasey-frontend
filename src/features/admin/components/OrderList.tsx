import NextLink from 'next/link';
import { Badge, ChevronRightIcon, money, staffStyles as styles } from '@/features/staff';
import { PAYMENT_STATUS, dateText } from '../labels';
import type { OrderSummary } from '../types';

const PAYMENT_TONE = { paid: 'good', partly_refunded: 'warn', refunded: 'bad' } as const;
const DAY = {
  booked: { label: 'Day booked', tone: 'good' },
  held: { label: 'Day held', tone: 'warn' },
  'needs-rebooking': { label: 'Rebook day', tone: 'bad' },
} as const;

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

function delivery(order: OrderSummary) {
  if (order.shipment !== 'pallet') return 'Parcel';
  return order.day ? `Pallet on ${dateText(order.day)}` : 'Pallet';
}

export function OrderList({ orders }: { orders: OrderSummary[] }) {
  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order.id} className={styles.listRow}>
          <span className={styles.avatar} aria-hidden="true">
            {initials(order.name)}
          </span>
          <span className={styles.listMain}>
            <NextLink href={`/admin/orders/${order.id}/`} className={styles.listTitle}>
              #{order.number} · {order.name}
            </NextLink>
            <span className={styles.listSub}>
              {dateText(order.createdAt)} · {order.postcode} · {delivery(order)}
            </span>
          </span>
          <span className={styles.listEnd}>
            {order.shipment === 'pallet' && order.day && (
              <Badge tone={DAY[order.dayStatus ?? 'held'].tone}>
                {DAY[order.dayStatus ?? 'held'].label}
              </Badge>
            )}
            <Badge tone={PAYMENT_TONE[order.paymentStatus]}>
              {PAYMENT_STATUS[order.paymentStatus]}
            </Badge>
            <strong className={styles.money}>{money(order.totalPence)}</strong>
            <ChevronRightIcon className={styles.chev} />
          </span>
        </li>
      ))}
    </ul>
  );
}
