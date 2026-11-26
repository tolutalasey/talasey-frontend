import type { Metadata } from 'next';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { OrderList, type OrderSummary } from '@/features/admin';
import {
  AlertCircleIcon,
  ChevronRightIcon,
  DeliveryIcon,
  DocumentIcon,
  EmptyState,
  HistoryIcon,
  money,
  OrdersIcon,
  PageHeader,
  PoundIcon,
  ProductsIcon,
  requireStaff,
  SampleIcon,
  staffApi,
  staffStyles as styles,
  SwatchIcon,
  TagIcon,
  type Permission,
} from '@/features/staff';
import { toLondonTime } from '@/lib/london-time';

export const metadata: Metadata = { title: 'Overview' };

const SHORTCUTS: {
  href: string;
  title: string;
  text: string;
  permission: Permission;
  icon: ReactNode;
}[] = [
  {
    href: '/admin/products/',
    title: 'Products',
    text: 'Names, prices, photos, stock and options.',
    permission: 'catalogue',
    icon: <ProductsIcon />,
  },
  {
    href: '/admin/delivery/',
    title: 'Delivery',
    text: 'Postcode areas, prices and pallet days.',
    permission: 'delivery',
    icon: <DeliveryIcon />,
  },
  {
    href: '/admin/samples/',
    title: 'Samples',
    text: 'Sample requests waiting to be sent.',
    permission: 'orders',
    icon: <SampleIcon />,
  },
  {
    href: '/admin/promotions/',
    title: 'Promotions',
    text: 'Discount codes and sales.',
    permission: 'catalogue',
    icon: <TagIcon />,
  },
  {
    href: '/admin/colour-sets/',
    title: 'Colour sets',
    text: 'The colours offered on Colour choice (1B) products.',
    permission: 'catalogue',
    icon: <SwatchIcon />,
  },
  {
    href: '/admin/log/',
    title: 'Change log',
    text: 'Every change, and undo for any of them.',
    permission: 'audit',
    icon: <HistoryIcon />,
  },
  {
    href: '/content/',
    title: 'Content',
    text: 'Pages, guides, questions and the homepage.',
    permission: 'content.edit',
    icon: <DocumentIcon />,
  },
];

const londonDay = (iso: string) => toLondonTime(new Date(iso)).slice(0, 10);

function greeting(now: Date) {
  const hour = Number(toLondonTime(now).slice(11, 13));
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const todayLabel = (now: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/London',
  }).format(now);

function Today({ orders }: { orders: OrderSummary[] }) {
  const today = londonDay(new Date().toISOString());
  const placed = orders.filter((order) => londonDay(order.createdAt) === today);
  const taken = placed.reduce((sum, order) => sum + order.totalPence, 0);
  const rebook = orders.filter((order) => order.dayStatus === 'needs-rebooking');
  const pallets = placed.filter((order) => order.shipment === 'pallet').length;
  return (
    <dl className={styles.stats}>
      <div className={`${styles.stat} ${styles.statFeature}`}>
        <dt>
          <span className={styles.statIcon}>
            <OrdersIcon />
          </span>
          Orders today
        </dt>
        <dd>{placed.length}</dd>
        <span className={styles.statNote}>
          {pallets} by pallet, {placed.length - pallets} by parcel
        </span>
      </div>
      <div className={styles.stat}>
        <dt>
          <span className={styles.statIcon}>
            <PoundIcon />
          </span>
          Taken today
        </dt>
        <dd>{money(taken)}</dd>
        <span className={styles.statNote}>
          {placed.length > 0
            ? `${money(Math.round(taken / placed.length))} average order`
            : 'No orders yet today'}
        </span>
      </div>
      <div className={`${styles.stat} ${rebook.length > 0 ? styles.statAlert : ''}`}>
        <dt>
          <span className={styles.statIcon}>
            {rebook.length > 0 ? <AlertCircleIcon /> : <DeliveryIcon />}
          </span>
          Pallet days to rebook
        </dt>
        <dd>{rebook.length}</dd>
        {rebook.length > 0 ? (
          <NextLink href="/admin/orders/?show=rebook" className={styles.textLink}>
            Call these customers
          </NextLink>
        ) : (
          <span className={styles.statNote}>Every pallet day is fine</span>
        )}
      </div>
    </dl>
  );
}

export default async function AdminHome() {
  const { me } = await requireStaff('admin');
  const now = new Date();
  const seesOrders = me.permissions.includes('orders');
  const orders = seesOrders ? ((await (await staffApi()).GET('/admin/orders')).data ?? []) : [];
  const shortcuts = SHORTCUTS.filter((entry) => me.permissions.includes(entry.permission));

  return (
    <>
      <PageHeader
        eyebrow={todayLabel(now)}
        title={`${greeting(now)}, ${me.name.split(' ')[0]}`}
        description="Here is how the shop is doing today."
        actions={
          me.permissions.includes('catalogue') && (
            <NextLink href="/admin/products/" className={styles.primaryLink}>
              <ProductsIcon />
              Manage products
            </NextLink>
          )
        }
      />
      {seesOrders && <Today orders={orders} />}

      <div className={styles.split}>
        {seesOrders && (
          <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="latest">
            <div className={styles.toolbar}>
              <h2 id="latest" className={styles.panelTitle}>
                Latest orders
              </h2>
              <NextLink href="/admin/orders/" className={styles.textLink}>
                All orders
              </NextLink>
            </div>
            {orders.length > 0 ? (
              <OrderList orders={orders.slice(0, 6)} />
            ) : (
              <EmptyState icon={<OrdersIcon />} title="No orders yet">
                New orders show here as soon as they are paid.
              </EmptyState>
            )}
          </section>
        )}

        <section aria-labelledby="shortcuts">
          <h2 id="shortcuts" className={styles.asideTitle}>
            Jump to
          </h2>
          <ul className={styles.shortcuts}>
            {shortcuts.map((entry) => (
              <li key={entry.href} className={styles.tile}>
                <span className={styles.tileIcon}>{entry.icon}</span>
                <span>
                  <h3>
                    <NextLink href={entry.href}>{entry.title}</NextLink>
                  </h3>
                  <p>{entry.text}</p>
                </span>
                <ChevronRightIcon className={styles.arrow} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
