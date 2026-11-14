import type { Metadata } from 'next';
import NextLink from 'next/link';
import { OrderList, type OrderSummary } from '@/features/admin';
import {
  EmptyState,
  NotAllowed,
  OrdersIcon,
  PageHeader,
  Pager,
  pageOf,
  requireStaff,
  SearchIcon,
  staffApi,
  staffStyles as styles,
} from '@/features/staff';

export const metadata: Metadata = { title: 'Orders' };

const VIEWS = {
  all: { label: 'All', keep: () => true },
  pallet: { label: 'Pallet', keep: (order: OrderSummary) => order.shipment === 'pallet' },
  parcel: { label: 'Parcel', keep: (order: OrderSummary) => order.shipment !== 'pallet' },
  rebook: {
    label: 'To rebook',
    keep: (order: OrderSummary) => order.dayStatus === 'needs-rebooking',
  },
  refunds: {
    label: 'Refunds',
    keep: (order: OrderSummary) => order.paymentStatus !== 'paid',
  },
} as const;

type View = keyof typeof VIEWS;

const PAGE_SIZE = 30;

interface Props {
  searchParams: Promise<{ show?: string; q?: string; page?: string }>;
}

const matches = (order: OrderSummary, query: string) =>
  [`#${order.number}`, String(order.number), order.name, order.postcode].some((value) =>
    value.toLowerCase().includes(query),
  );

export default async function Orders({ searchParams }: Props) {
  if (!(await requireStaff('admin', 'orders')).allowed) return <NotAllowed />;
  const { show, q, page: pageParam } = await searchParams;
  const view: View = show && show in VIEWS ? (show as View) : 'all';
  const query = q?.trim().toLowerCase() ?? '';
  const { data: orders = [] } = await (await staffApi()).GET('/admin/orders');
  const matching = orders
    .filter(VIEWS[view].keep)
    .filter((order) => !query || matches(order, query));
  const page = pageOf(pageParam, matching.length, PAGE_SIZE);
  const shown = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const href = (next: View, nextPage = 1) => {
    const params = new URLSearchParams({
      ...(next !== 'all' && { show: next }),
      ...(q && { q }),
      ...(nextPage > 1 && { page: String(nextPage) }),
    });
    return `/admin/orders/${params.size ? `?${params}` : ''}`;
  };

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every order placed on the shop, newest first. Open one to manage its delivery day or refund it."
      />
      {orders.length === 0 ? (
        <section className={styles.panel}>
          <EmptyState icon={<OrdersIcon />} title="No orders yet">
            Orders appear here the moment a customer pays.
          </EmptyState>
        </section>
      ) : (
        <section className={`${styles.panel} ${styles.flush}`} aria-label="Orders">
          <div className={styles.toolbar}>
            <nav aria-label="Show" className={styles.tabs}>
              {(Object.keys(VIEWS) as View[]).map((key) => (
                <NextLink
                  key={key}
                  href={href(key)}
                  aria-current={key === view ? 'page' : undefined}
                >
                  {VIEWS[key].label}
                  <span className={styles.tabCount}>{orders.filter(VIEWS[key].keep).length}</span>
                </NextLink>
              ))}
            </nav>
            <form method="get" role="search" className={styles.search}>
              {view !== 'all' && <input type="hidden" name="show" value={view} />}
              <SearchIcon />
              <input
                name="q"
                defaultValue={q}
                placeholder="Order number, name or postcode"
                aria-label="Find an order"
              />
            </form>
          </div>
          {shown.length > 0 ? (
            <>
              <OrderList orders={shown} />
              <Pager
                page={page}
                pageSize={PAGE_SIZE}
                total={matching.length}
                href={(next) => href(view, next)}
              />
            </>
          ) : (
            <EmptyState icon={<SearchIcon />} title="No orders match">
              Try another search, or show all orders.
            </EmptyState>
          )}
        </section>
      )}
    </>
  );
}
