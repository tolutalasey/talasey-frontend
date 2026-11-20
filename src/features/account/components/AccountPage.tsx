import NextLink from 'next/link';
import type { Account, AccountOrder } from '@/api-client';
import { buyAgain } from '@/features/checkout';
import { formatDay, formatPrice } from '@/lib/format';
import { signOut } from '../actions';
import styles from './Account.module.css';

const dateText = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(new Date(iso));

// Lines the bag can add back as they were: not made to measure, part of a build or a colour.
const repeatable = (order: AccountOrder) =>
  order.lines.filter((line) => line.variantId && !line.colour && !line.bespoke && !line.buildId);

function orderStatus(order: AccountOrder): { label: string; tone: 'good' | 'warn' | 'bad' } {
  if (order.cancelled) return { label: 'Cancelled', tone: 'bad' };
  if (order.delivery.day?.status === 'needs-rebooking')
    return { label: 'We will call to rebook', tone: 'warn' };
  if (order.delivery.day) return { label: 'Day booked', tone: 'good' };
  return { label: 'Placed', tone: 'good' };
}

function Order({ order }: { order: AccountOrder }) {
  const status = orderStatus(order);
  const again = repeatable(order);
  const count = order.lines.length + order.samples.length;
  const names = [
    ...order.lines.map((line) => line.title),
    ...order.samples.map((sample) => `Sample: ${sample.productTitle}, ${sample.label}`),
  ];
  return (
    <li className={`frame ${styles.order}`}>
      <div className={styles.orderMain}>
        <h3>
          Order {order.displayId} · {count} {count === 1 ? 'item' : 'items'}
        </h3>
        <p className={styles.muted}>
          Placed {dateText(order.placedAt)}
          {order.delivery.day && ` · delivery ${formatDay(order.delivery.day.date)}`}
        </p>
        <p className={styles.lineNames}>{names.join(' · ')}</p>
      </div>
      <span className={`${styles.pill} ${styles[status.tone]}`}>{status.label}</span>
      <strong className={styles.orderTotal}>{formatPrice(order.total)}</strong>
      <div className={styles.orderActions}>
        <NextLink href={`/order/${order.id}/`} className="chip">
          View<span className={styles.hidden}> order {order.displayId}</span>
        </NextLink>
        {again.length > 0 && (
          <form action={buyAgain}>
            {again.map((line) => (
              <input
                key={line.id}
                type="hidden"
                name="item"
                value={`${line.variantId}:${line.quantity}`}
              />
            ))}
            <button type="submit" className="button">
              Buy again<span className={styles.hidden}>: order {order.displayId}</span>
            </button>
          </form>
        )}
      </div>
    </li>
  );
}

export function AccountPage({ account }: { account: Account }) {
  return (
    <div className={styles.page}>
      <aside className={styles.side}>
        <div className={styles.who}>
          <p className="eyebrow">Signed in</p>
          <p className={styles.email}>{account.email}</p>
        </div>
        <nav aria-label="Your account" className={`frame ${styles.nav}`}>
          <a href="#orders">
            Orders <span>{account.orders.length}</span>
          </a>
          <a href="#samples">
            Samples <span>{account.samples.length}</span>
          </a>
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </nav>
      </aside>

      <div className={styles.main}>
        <section aria-labelledby="orders" className={styles.section}>
          <h1 id="orders">Your orders</h1>
          {account.orders.length === 0 ? (
            <p className={`frame ${styles.empty}`}>
              No orders with this email yet.{' '}
              <NextLink href="/">Have a look round the shop</NextLink>.
            </p>
          ) : (
            <ul className={styles.list}>
              {account.orders.map((order) => (
                <Order key={order.id} order={order} />
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="samples" className={styles.section}>
          <h2 id="samples">Your samples</h2>
          {account.samples.length === 0 ? (
            <p className={`frame ${styles.empty}`}>
              No samples yet. <NextLink href="/samples/">Choose up to five, free</NextLink>.
            </p>
          ) : (
            <ul className={styles.list}>
              {account.samples.map((request) => (
                <li key={request.number} className={`frame ${styles.order}`}>
                  <div className={styles.orderMain}>
                    <h3>
                      Samples {request.number} · {request.items.length}{' '}
                      {request.items.length === 1 ? 'sample' : 'samples'}
                    </h3>
                    <p className={styles.muted}>Asked for {dateText(request.createdAt)}</p>
                    <p className={styles.sampleLinks}>
                      {request.items.map((item) => (
                        <NextLink
                          key={item.label + item.productHandle}
                          href={`/products/${item.productHandle}/`}
                        >
                          {item.productTitle}: {item.label}
                        </NextLink>
                      ))}
                    </p>
                  </div>
                  <span
                    className={`${styles.pill} ${request.status === 'dispatched' ? styles.good : styles.warn}`}
                  >
                    {request.status === 'dispatched' ? 'Sent' : 'Being packed'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className={`frame ${styles.howItWorks}`}>
          <strong>No password needed.</strong> Each time you want to sign in, we email you a link.
          You stay signed in on this device for 30 days.
        </p>
      </div>
    </div>
  );
}
