import { Button, Table, TextField } from '@/ui';
import { money, poundsText, staffStyles as styles } from '@/features/staff';
import { refundOrder } from '../actions';
import { DAY_STATUS, PAYMENT_STATUS, VEHICLE_ACCESS, dateText } from '../labels';
import type { Order } from '../types';

export function OrderDetail({ order }: { order: Order }) {
  const { address, delivery } = order;
  const left = order.totalPence - order.payment.refundedPence;
  return (
    <>
      <p>
        Placed {dateText(order.createdAt)} by {order.email}.{' '}
        {order.payment.provider === 'test' && <strong>Test payment: no money was taken.</strong>}
      </p>
      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="deliver-to">
          <h2 id="deliver-to">Deliver to</h2>
          <p>
            {address.firstName} {address.lastName}
            <br />
            {address.address1}
            <br />
            {address.city} {address.postcode}
            <br />
            {address.phone}
          </p>
        </section>
        <section className={styles.panel} aria-labelledby="delivery">
          <h2 id="delivery">Delivery</h2>
          <p>{delivery.name}</p>
          {delivery.day && (
            <p>
              <strong>{dateText(delivery.day.date)}</strong> ({DAY_STATUS[delivery.day.status]})
            </p>
          )}
          {delivery.access && (
            <ul>
              <li>{VEHICLE_ACCESS[delivery.access.vehicleAccess]}</li>
              <li>
                {delivery.access.hardStanding ? 'Hard standing to unload onto' : 'No hard standing'}
              </li>
              <li>
                {delivery.access.kerbsideOk
                  ? 'Kerbside delivery is fine'
                  : 'Not happy with kerbside delivery'}
              </li>
            </ul>
          )}
        </section>
      </div>
      <Table caption="What they ordered">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">SKU</th>
            <th scope="col">Quantity</th>
            <th scope="col">Stock</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={line.id}>
              <th scope="row">
                {line.title}
                {line.variantTitle && `, ${line.variantTitle}`}
                {line.colour && `, ${line.colour}`}
                {line.bespoke &&
                  `, ${Object.entries(line.bespoke.dimensions)
                    .map(([name, value]) => `${name} ${value}${line.bespoke?.unit}`)
                    .join(' × ')}`}
              </th>
              <td>{line.sku}</td>
              <td>{line.quantity}</td>
              <td>{line.stock}</td>
              <td>{money(line.totalPence)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={4}>
              Delivery
            </th>
            <td>{money(order.deliveryPence)}</td>
          </tr>
          <tr>
            <th scope="row" colSpan={4}>
              Total
            </th>
            <td>{money(order.totalPence)}</td>
          </tr>
        </tfoot>
      </Table>
      <section className={styles.panel} aria-labelledby="payment">
        <h2 id="payment">Payment</h2>
        <p>
          {PAYMENT_STATUS[order.payment.status]}
          {order.payment.refundedPence > 0 && `, ${money(order.payment.refundedPence)} refunded`}
        </p>
        {left > 0 && (
          <form action={refundOrder} className={styles.row}>
            <input type="hidden" name="id" value={order.id} />
            <TextField
              label="Refund (£)"
              name="amount"
              defaultValue={poundsText(left)}
              inputMode="decimal"
            />
            <Button type="submit" variant="secondary">
              Refund
            </Button>
          </form>
        )}
      </section>
    </>
  );
}
