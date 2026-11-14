import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import {
  Badge,
  CheckCircleIcon,
  EmptyState,
  SampleIcon,
  staffStyles as styles,
} from '@/features/staff';
import { addSampleOffer, changeSampleOffer, markSamplesSent } from '../actions';
import type { SampleOfferAdmin, SampleRequest } from '../types';

const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const addressOf = ({ address }: SampleRequest) =>
  [address.address1, address.city, address.postcode].filter(Boolean).join(', ');

interface Props {
  waiting: SampleRequest[];
  sent: SampleRequest[];
  offers: SampleOfferAdmin[];
}

function ToSend({ waiting }: { waiting: SampleRequest[] }) {
  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="to-send">
      <div className={styles.toolbar}>
        <h2 id="to-send" className={styles.panelTitle}>
          To send
        </h2>
        <Badge tone={waiting.length > 0 ? 'warn' : 'good'}>{waiting.length} waiting</Badge>
      </div>
      {waiting.length === 0 ? (
        <EmptyState icon={<CheckCircleIcon />} title="All caught up">
          New sample requests appear here as soon as a shopper asks for them.
        </EmptyState>
      ) : (
        <ul className={styles.list}>
          {waiting.map((request) => (
            <li key={request.id} className={styles.lineRow}>
              <span className={styles.qty}>S{request.number}</span>
              <span className={styles.listMain}>
                <strong>
                  {request.address.firstName} {request.address.lastName}
                </strong>
                <span className={styles.listSub}>
                  {request.items.map((item) => `${item.productTitle}: ${item.label}`).join(' · ')}
                </span>
                <span className={styles.listSub}>
                  {addressOf(request)} · {request.address.phone} · {request.email}
                </span>
              </span>
              <span className={styles.listEnd}>
                <span className={styles.small}>{when(request.createdAt)}</span>
                {request.marketingConsent && <Badge tone="info">Marketing OK</Badge>}
                <form action={markSamplesSent}>
                  <input type="hidden" name="id" value={request.id} />
                  <Button type="submit">Mark as sent</Button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Offered({ offers }: { offers: SampleOfferAdmin[] }) {
  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="offered">
      <div className={styles.toolbar}>
        <h2 id="offered" className={styles.panelTitle}>
          Samples we offer
        </h2>
        <span className={styles.count}>
          {offers.filter((offer) => offer.active).length} offered
        </span>
      </div>
      {offers.length === 0 ? (
        <EmptyState icon={<SampleIcon />} title="No samples yet">
          Add the first one below.
        </EmptyState>
      ) : (
        <ul className={styles.list}>
          {offers.map((offer) => (
            <li key={offer.id} className={styles.lineRow}>
              <span className={styles.docIcon} aria-hidden="true">
                <SampleIcon />
              </span>
              <span className={styles.listMain}>
                <NextLink href={`/products/${offer.productHandle}/`} className={styles.textLink}>
                  {offer.productTitle}
                </NextLink>
                <span className={styles.listSub}>{offer.label}</span>
              </span>
              <span className={styles.listEnd}>
                <Badge tone={offer.active ? 'good' : 'neutral'}>
                  {offer.active ? 'Offered' : 'Paused'}
                </Badge>
                <form action={changeSampleOffer} className={styles.saveActions}>
                  <input type="hidden" name="id" value={offer.id} />
                  <Button
                    type="submit"
                    name="intent"
                    value={offer.active ? 'stop' : 'start'}
                    variant="secondary"
                  >
                    {offer.active ? 'Pause' : 'Offer again'}
                  </Button>
                  <Button type="submit" name="intent" value="delete" variant="secondary">
                    Remove
                  </Button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      )}
      <form action={addSampleOffer} className={`${styles.inlineCreate} ${styles.panelFoot}`}>
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
  );
}

function Sent({ sent }: { sent: SampleRequest[] }) {
  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="sent">
      <div className={styles.toolbar}>
        <h2 id="sent" className={styles.panelTitle}>
          Recently sent
        </h2>
        <span className={styles.count}>Last {Math.min(sent.length, 20)}</span>
      </div>
      <ul className={styles.list}>
        {sent.slice(0, 20).map((request) => (
          <li key={request.id} className={styles.lineRow}>
            <span className={styles.qty}>S{request.number}</span>
            <span className={styles.listMain}>
              <strong>
                {request.address.firstName} {request.address.lastName}
              </strong>
              <span className={styles.listSub}>
                {request.items.length} {request.items.length === 1 ? 'sample' : 'samples'}
                {request.dispatchedBy && `, sent by ${request.dispatchedBy}`}
              </span>
            </span>
            <span className={styles.listEnd}>
              {request.dispatchedAt && <span>{when(request.dispatchedAt)}</span>}
              <Badge tone="good">Sent</Badge>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SamplesAdmin({ waiting, sent, offers }: Props) {
  return (
    <div className={styles.stack}>
      <ToSend waiting={waiting} />
      <Offered offers={offers} />
      {sent.length > 0 && <Sent sent={sent} />}
    </div>
  );
}
