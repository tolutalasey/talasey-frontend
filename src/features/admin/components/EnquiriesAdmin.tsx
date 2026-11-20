import NextLink from 'next/link';
import { Button } from '@/ui/Button/Button';
import { SelectField } from '@/ui/SelectField/SelectField';
import { SURVEY_QUESTIONS } from '@/features/contact';
import {
  Badge,
  ChevronRightIcon,
  EmptyState,
  MailIcon,
  staffStyles as styles,
} from '@/features/staff';
import { setEnquiryStatus } from '../actions';
import { initials } from '../initials';
import { ENQUIRY_STATUS, type Enquiry } from '../types';

const KIND: Record<Enquiry['kind'], string> = {
  contact: 'Contact form',
  'site-survey': 'Site survey',
  stockist: 'Find a stockist',
  installer: 'Find an installer',
  showroom: 'Showroom visit',
};

const STATUS_OPTIONS = Object.entries(ENQUIRY_STATUS).map(([value, { label }]) => ({
  value,
  label,
}));

const QUESTION_LABELS = new Map<string, string>(
  SURVEY_QUESTIONS.map((question) => [question.name, question.label]),
);

const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const subjectOf = (enquiry: Enquiry) =>
  enquiry.productTitle ??
  enquiry.topic ??
  (enquiry.kind === 'contact' ? 'General question' : KIND[enquiry.kind]);

export const photoPath = (id: string, number: number) =>
  `/api/staff/enquiry-photo/${id}/${number}/`;

function Thumb({ enquiry }: { enquiry: Enquiry }) {
  if (enquiry.photoCount === 0) {
    return (
      <span className={styles.avatar} aria-hidden="true">
        {initials(enquiry.name)}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- private, served per request
  return <img className={styles.thumb} src={photoPath(enquiry.id, 1)} alt="" />;
}

export function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  if (enquiries.length === 0) {
    return (
      <EmptyState icon={<MailIcon />} title="No enquiries yet">
        Messages from the contact form and site survey requests appear here.
      </EmptyState>
    );
  }
  return (
    <ul className={styles.list}>
      {enquiries.map((enquiry) => (
        <li key={enquiry.id} className={styles.listRow}>
          <Thumb enquiry={enquiry} />
          <span className={styles.listMain}>
            <NextLink href={`/admin/enquiries/${enquiry.id}/`} className={styles.listTitle}>
              {enquiry.name} · {subjectOf(enquiry)}
            </NextLink>
            <span className={styles.listSub}>
              {when(enquiry.createdAt)} · {KIND[enquiry.kind]}
              {enquiry.postcode && ` · ${enquiry.postcode}`}
              {enquiry.photoCount > 0 &&
                ` · ${enquiry.photoCount} photo${enquiry.photoCount === 1 ? '' : 's'}`}
            </span>
          </span>
          <span className={styles.listEnd}>
            <Badge tone={ENQUIRY_STATUS[enquiry.status].tone}>
              {ENQUIRY_STATUS[enquiry.status].label}
            </Badge>
            <ChevronRightIcon className={styles.chev} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function EnquiryDetail({ enquiry }: { enquiry: Enquiry }) {
  const answers = Object.entries(enquiry.answers);
  const photos = Array.from({ length: enquiry.photoCount }, (_, index) => index + 1);
  return (
    <div className={styles.split}>
      <div className={styles.stack}>
        {enquiry.message && (
          <section className={styles.panel}>
            <h2>Message</h2>
            <p className={styles.message}>{enquiry.message}</p>
          </section>
        )}
        {answers.length > 0 && (
          <section className={styles.panel}>
            <h2>Answers</h2>
            <dl className={styles.facts}>
              {answers.map(([name, answer]) => (
                <Fact key={name} label={QUESTION_LABELS.get(name) ?? name}>
                  {answer}
                </Fact>
              ))}
            </dl>
          </section>
        )}
        {photos.length > 0 && (
          <section className={styles.panel}>
            <h2>Photos</h2>
            <div className={styles.photos}>
              {photos.map((number) => (
                <a
                  key={number}
                  href={photoPath(enquiry.id, number)}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.photo}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- private, served per request */}
                  <img src={photoPath(enquiry.id, number)} alt={`Photo ${number} of the garden`} />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <aside className={styles.stack}>
        <section className={styles.panel}>
          <h2>Customer</h2>
          <dl className={styles.facts}>
            <Fact label="Name">{enquiry.name}</Fact>
            <Fact label="Email">
              <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
            </Fact>
            {enquiry.phone && (
              <Fact label="Phone">
                <a href={`tel:${enquiry.phone.replace(/\s/g, '')}`}>{enquiry.phone}</a>
              </Fact>
            )}
            {enquiry.postcode && <Fact label="Postcode">{enquiry.postcode}</Fact>}
            {enquiry.productHandle && (
              <Fact label="Product">
                <a href={`/products/${enquiry.productHandle}/`} target="_blank" rel="noreferrer">
                  {enquiry.productTitle ?? enquiry.productHandle}
                </a>
              </Fact>
            )}
            <Fact label="Marketing">{enquiry.consent ? 'Happy to hear from us' : 'No'}</Fact>
          </dl>
        </section>
        <section className={styles.panel}>
          <h2>Status</h2>
          <form action={setEnquiryStatus} className={styles.stack}>
            <input type="hidden" name="id" value={enquiry.id} />
            <SelectField
              label="Status"
              name="status"
              defaultValue={enquiry.status}
              options={STATUS_OPTIONS}
            />
            <Button type="submit">Save status</Button>
          </form>
        </section>
      </aside>
    </div>
  );
}
