import type { Metadata } from 'next';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { OrderList, type OrderSummary } from '@/features/admin';
import {
  money,
  requireStaff,
  staffApi,
  staffStyles as styles,
  type Permission,
} from '@/features/staff';
import { toLondonTime } from '@/lib/london-time';
import {
  ArrowIcon,
  BoxIcon,
  ClockIcon,
  PageIcon,
  ReceiptIcon,
  SamplesIcon,
  TruckIcon,
} from '@/ui/icons';

export const metadata: Metadata = { title: 'Admin' };

const AREAS: {
  href: string;
  title: string;
  text: string;
  permission: Permission;
  icon: ReactNode;
}[] = [
  {
    href: '/admin/orders/',
    title: 'Orders',
    text: 'New orders, delivery days and refunds.',
    permission: 'orders',
    icon: <ReceiptIcon />,
  },
  {
    href: '/admin/products/',
    title: 'Products',
    text: 'Names, prices, photos, stock and options.',
    permission: 'catalogue',
    icon: <BoxIcon />,
  },
  {
    href: '/admin/delivery/',
    title: 'Delivery',
    text: 'Postcode areas, prices and pallet days.',
    permission: 'delivery',
    icon: <TruckIcon />,
  },
  {
    href: '/admin/colour-sets/',
    title: 'Colour sets',
    text: 'The colours offered on 1B products.',
    permission: 'catalogue',
    icon: <SamplesIcon />,
  },
  {
    href: '/admin/log/',
    title: 'Change log',
    text: 'Every change, and undo for any of them.',
    permission: 'audit',
    icon: <ClockIcon />,
  },
  {
    href: '/content/',
    title: 'Content',
    text: 'Pages, guides, FAQs and the homepage.',
    permission: 'content.edit',
    icon: <PageIcon />,
  },
];

const londonDay = (iso: string) => toLondonTime(new Date(iso)).slice(0, 10);

function Today({ orders }: { orders: OrderSummary[] }) {
  const today = londonDay(new Date().toISOString());
  const placed = orders.filter((order) => londonDay(order.createdAt) === today);
  const rebook = orders.filter((order) => order.dayStatus === 'needs-rebooking');
  return (
    <dl className={styles.stats}>
      <div className={styles.stat}>
        <dt>Orders today</dt>
        <dd>{placed.length}</dd>
      </div>
      <div className={styles.stat}>
        <dt>Taken today</dt>
        <dd>{money(placed.reduce((sum, order) => sum + order.totalPence, 0))}</dd>
      </div>
      <div className={styles.stat}>
        <dt>Pallet days to rebook</dt>
        <dd>{rebook.length}</dd>
      </div>
    </dl>
  );
}

export default async function AdminHome() {
  const { me } = await requireStaff('admin');
  const seesOrders = me.permissions.includes('orders');
  const orders = seesOrders ? ((await (await staffApi()).GET('/admin/orders')).data ?? []) : [];

  return (
    <>
      <h1>Hello, {me.name.split(' ')[0]}</h1>
      {seesOrders && <Today orders={orders} />}
      <ul className={styles.tiles}>
        {AREAS.filter((area) => me.permissions.includes(area.permission)).map((area) => (
          <li key={area.href} className={styles.tile}>
            <span className={styles.tileIcon}>{area.icon}</span>
            <h2>
              <NextLink href={area.href}>{area.title}</NextLink>
            </h2>
            <p>{area.text}</p>
            <ArrowIcon className={styles.arrow} />
          </li>
        ))}
      </ul>
      {seesOrders && orders.length > 0 && (
        <section aria-labelledby="latest">
          <div className={styles.sectionHead}>
            <h2 id="latest">Latest orders</h2>
            <NextLink href="/admin/orders/">All orders</NextLink>
          </div>
          <OrderList orders={orders.slice(0, 5)} caption="The five most recent orders" />
        </section>
      )}
    </>
  );
}
