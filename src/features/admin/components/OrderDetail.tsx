import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';
import {
  Badge,
  CalendarIcon,
  DeliveryIcon,
  MailIcon,
  money,
  poundsText,
  staffStyles as styles,
} from '@/features/staff';
import { refundOrder } from '../actions';
import { PAYMENT_STATUS, VEHICLE_ACCESS, dateText } from '../labels';
import type { Order } from '../types';

const PAYMENT_TONE = { paid: 'good', partly_refunded: 'warn', refunded: 'bad' } as const;
const DAY = {
  booked: { label: 'Day booked', tone: 'good' },
  held: { label: 'Day held', tone: 'warn' },
  'needs-rebooking': { label: 'Call to rebook', tone: 'bad' },
} as const;

function lineDetail(line: Order['lines'][number]) {
  return [
    line.variantTitle,
    line.colour,
    line.bespoke &&
      Object.entries(line.bespoke.dimensions)
        .map(([name, value]) => `${name} ${value}${line.bespoke?.unit}`)
        .join(' × '),
  ]
    .filter(Boolean)
    .join(' · ');
}

export function OrderSummaryBadges({ order }: { order: Order }) {
  return (
    <>
      <Badge tone={PAYMENT_TONE[order.payment.status]}>
        {PAYMENT_STATUS[order.payment.status]}
      </Badge>
      {order.payment.provider === 'test' && <Badge tone="info">Test payment</Badge>}
      <span>Placed {dateText(order.createdAt)}</span>
    </>
  );
}

export function OrderDetail({ order }: { order: Order }) {
  const { address, delivery } = order;
  const left = order.totalPence - order.payment.refundedPence;
  const itemsPence = order.lines.reduce((sum, line) => sum + line.totalPence, 0);

  return (
    <div className={styles.editor}>
      <div className={styles.editorMain}>
        {order.payment.provider === 'test' && (
          <div className={styles.notice}>
            <p>This order used the test payment. No money was taken.</p>
          </div>
        )}

        <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="items">
          <div className={styles.toolbar}>
            <h2 id="items" className={styles.panelTitle}>
              Items
            </h2>
            <span className={styles.count}>
              {order.lines.length} {order.lines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>
          <ul className={styles.list}>
            {order.lines.map((line) => (
              <li key={line.id} className={styles.lineRow}>
                <span className={styles.qty}>{line.quantity}×</span>
                <span className={styles.listMain}>
                  <strong>{line.title}</strong>
                  <span className={styles.listSub}>
                    {[lineDetail(line), line.sku && `SKU ${line.sku}`].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className={styles.listEnd}>
                  <span className={styles.small}>{line.stock}</span>
                  <strong className={styles.money}>{money(line.totalPence)}</strong>
                </span>
              </li>
            ))}
          </ul>
          <dl className={styles.totals}>
            <div>
              <dt>Items</dt>
              <dd>{money(itemsPence)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{money(order.deliveryPence)}</dd>
            </div>
            {order.discountPence > 0 && (
              <div>
                <dt>Discount ({order.promotions.join(', ')})</dt>
                <dd>−{money(order.discountPence)}</dd>
              </div>
            )}
            <div className={styles.grand}>
              <dt>Total</dt>
              <dd>{money(order.totalPence)}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.panel} aria-labelledby="payment">
          <div className={styles.panelHead}>
            <div>
              <h2 id="payment">Payment</h2>
              <p>
                {order.payment.refundedPence > 0
                  ? `${money(order.payment.refundedPence)} refunded of ${money(order.totalPence)}.`
                  : `${money(order.totalPence)} taken.`}
              </p>
            </div>
            <Badge tone={PAYMENT_TONE[order.payment.status]}>
              {PAYMENT_STATUS[order.payment.status]}
            </Badge>
          </div>
          {left > 0 ? (
            <form action={refundOrder} className={styles.inlineCreate}>
              <input type="hidden" name="id" value={order.id} />
              <TextField
                label="Refund (£)"
                name="amount"
                defaultValue={poundsText(left)}
                inputMode="decimal"
                description={`Up to ${money(left)}.`}
              />
              <Button type="submit" variant="secondary">
                Refund
              </Button>
            </form>
          ) : (
            <p className={`${styles.muted} ${styles.small}`}>
              Fully refunded. Nothing left to refund.
            </p>
          )}
        </section>
      </div>

      <aside className={styles.aside} aria-label="Customer and delivery">
        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>Customer</h2>
          <div className={styles.stack}>
            <div className={styles.who}>
              <span className={styles.avatar} aria-hidden="true">
                {`${address.firstName[0] ?? ''}${address.lastName[0] ?? ''}`.toUpperCase()}
              </span>
              <span className={styles.listMain}>
                <strong>
                  {address.firstName} {address.lastName}
                </strong>
                <span className={styles.listSub}>{address.phone}</span>
              </span>
            </div>
            <a href={`mailto:${order.email}`} className={styles.textLink}>
              <MailIcon className={styles.inlineIcon} />
              {order.email}
            </a>
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>Deliver to</h2>
          <address className={styles.address}>
            {address.address1}
            <br />
            {address.city}
            <br />
            {address.postcode}
          </address>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>Delivery</h2>
          <div className={styles.stack}>
            <p className={styles.small}>
              <DeliveryIcon className={styles.inlineIcon} />
              {delivery.name}
            </p>
            {delivery.day && (
              <div className={styles.dayRow}>
                <span className={styles.small}>
                  <CalendarIcon className={styles.inlineIcon} />
                  <strong>{dateText(delivery.day.date)}</strong>
                </span>
                <Badge tone={DAY[delivery.day.status].tone}>{DAY[delivery.day.status].label}</Badge>
              </div>
            )}
            {delivery.access && (
              <ul className={styles.checks}>
                <li>{VEHICLE_ACCESS[delivery.access.vehicleAccess]}</li>
                <li>
                  {delivery.access.hardStanding
                    ? 'Hard standing to unload onto'
                    : 'No hard standing'}
                </li>
                <li>
                  {delivery.access.kerbsideOk
                    ? 'Kerbside delivery is fine'
                    : 'Not happy with kerbside delivery'}
                </li>
              </ul>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
