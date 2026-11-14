import { Button } from '@/ui/Button/Button';
import { Table } from '@/ui/Table/Table';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import { staffStyles as styles } from '@/features/staff';
import { addSampleOffer, changeSampleOffer, markSamplesSent } from '../actions';
import type { SampleOfferAdmin, SampleRequest } from '../types';

const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));

const addressOf = ({ address }: SampleRequest) =>
  [
    `${address.firstName} ${address.lastName}`,
    address.address1,
    address.city,
    address.postcode,
    address.phone,
  ]
    .filter(Boolean)
    .join(', ');

interface Props {
  waiting: SampleRequest[];
  sent: SampleRequest[];
  offers: SampleOfferAdmin[];
}

export function SamplesAdmin({ waiting, sent, offers }: Props) {
  return (
    <>
      <section className={styles.stack} aria-labelledby="to-send">
        <h2 id="to-send">To send ({waiting.length})</h2>
        {waiting.length === 0 ? (
          <p className={styles.muted}>Nothing waiting.</p>
        ) : (
          <Table caption="Sample requests to send">
            <thead>
              <tr>
                <th scope="col">Request</th>
                <th scope="col">Samples</th>
                <th scope="col">Send to</th>
                <th scope="col">Done</th>
              </tr>
            </thead>
            <tbody>
              {waiting.map((request) => (
                <tr key={request.id}>
                  <th scope="row">
                    S{request.number}
                    <br />
                    <span className={styles.muted}>{when(request.createdAt)}</span>
                  </th>
                  <td>
                    <ul>
                      {request.items.map((item) => (
                        <li key={item.offerId}>
                          {item.productTitle}: {item.label}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {addressOf(request)}
                    <br />
                    {request.email}
                    {request.marketingConsent && (
                      <>
                        <br />
                        <span className={styles.muted}>Happy to get marketing emails</span>
                      </>
                    )}
                  </td>
                  <td>
                    <form action={markSamplesSent}>
                      <input type="hidden" name="id" value={request.id} />
                      <Button type="submit">Mark as sent</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className={styles.stack} aria-labelledby="offered">
        <h2 id="offered">Samples we offer</h2>
        <Table caption="Samples we offer">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Sample</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <th scope="row">
                  <NextLink href={`/products/${offer.productHandle}/`}>
                    {offer.productTitle}
                  </NextLink>
                </th>
                <td>
                  {offer.label}
                  {!offer.active && <span className={styles.muted}> (not offered)</span>}
                </td>
                <td>
                  <form action={changeSampleOffer} className={styles.row}>
                    <input type="hidden" name="id" value={offer.id} />
                    <Button
                      type="submit"
                      name="intent"
                      value={offer.active ? 'stop' : 'start'}
                      variant="secondary"
                    >
                      {offer.active ? 'Stop offering' : 'Offer again'}
                    </Button>
                    <Button type="submit" name="intent" value="delete" variant="secondary">
                      Remove
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <form action={addSampleOffer} className={`${styles.panel} ${styles.row}`}>
          <TextField
            label="Product"
            name="productHandle"
            description="The end of its web address, like silver-grey-porcelain-paving"
            isRequired
          />
          <TextField label="Sample" name="label" description="Like the colour: Buff" isRequired />
          <Button type="submit">Add sample</Button>
        </form>
      </section>

      {sent.length > 0 && (
        <section className={styles.stack} aria-labelledby="sent">
          <h2 id="sent">Recently sent</h2>
          <ul>
            {sent.slice(0, 20).map((request) => (
              <li key={request.id}>
                S{request.number}, {request.items.length} sample
                {request.items.length === 1 ? '' : 's'} to {request.address.firstName}{' '}
                {request.address.lastName}, sent{' '}
                {request.dispatchedAt && when(request.dispatchedAt)} by {request.dispatchedBy}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
