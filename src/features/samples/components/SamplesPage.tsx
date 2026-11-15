import Image from 'next/image';
import type { SampleOffer } from '@/api-client';
import type { FormState } from '@/lib/form-feedback';
import { standInPhoto } from '@/lib/stand-in-photo';
import { VisuallyHidden } from '@/ui/VisuallyHidden/VisuallyHidden';
import { addSample, removeSample, requestSamples } from '../actions';
import { MAX_SAMPLES } from '../samples';
import styles from './Samples.module.css';

interface Props {
  offers: SampleOffer[];
  chosenIds: string[];
  feedback?: FormState;
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  required?: boolean;
  feedback?: FormState;
}

function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  required = true,
  feedback,
}: FieldProps) {
  const problem = feedback?.fieldErrors?.[name];
  const id = `sample-${name}`;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {!required && ' (optional)'}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={feedback?.values?.[name]}
        aria-invalid={problem ? true : undefined}
        aria-describedby={problem ? `${id}-problem` : undefined}
      />
      {problem && (
        <p id={`${id}-problem`} className={styles.error}>
          {problem}
        </p>
      )}
    </div>
  );
}

const nameOf = (offer: SampleOffer) => `${offer.productTitle}: ${offer.label}`;

const photoOf = (offer: SampleOffer) =>
  offer.image?.url ?? standInPhoto(`${offer.productTitle} ${offer.label}`).src;

// Plain HTML forms throughout: the page works the same with or without JavaScript, and adds
// nothing to what the browser downloads.
export function SamplesPage({ offers, chosenIds, feedback }: Props) {
  const chosen = chosenIds.flatMap((id) => offers.filter((offer) => offer.id === id));
  const full = chosen.length >= MAX_SAMPLES;

  const slots = Array.from({ length: MAX_SAMPLES }, (_, index) => chosen[index]);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introText}>
          <p className="eyebrow">Free samples</p>
          <h1>See it in your own garden light</h1>
          <p>
            Stone looks different in the morning, at midday and in the rain. Choose up to{' '}
            {MAX_SAMPLES}: they are free, with free postage, and we send them the next working day.
          </p>
        </div>
        <div className={styles.introPhoto}>
          <Image
            src="/images/brand/samples-mixed.jpg"
            alt="Porcelain paving in mixed light and warm tones beside a planted border"
            width={1600}
            height={1200}
            sizes="(min-width: 64rem) 45vw, 100vw"
            priority
          />
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.offers} aria-labelledby="offers-title">
          <h2 id="offers-title">Choose your samples</h2>
          {offers.length === 0 ? (
            <p className={`frame ${styles.empty}`}>
              Samples are being set up. Call us and we will post the ones you need.
            </p>
          ) : (
            <ul className={styles.grid}>
              {offers.map((offer) => {
                const added = chosenIds.includes(offer.id);
                return (
                  <li key={offer.id} className={styles.card} data-added={added || undefined}>
                    <span className={styles.cardPhoto}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoOf(offer)} alt="" width={400} height={400} loading="lazy" />
                      {added && (
                        <span className={styles.tick} aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </span>
                    <h3>{offer.productTitle}</h3>
                    <p className={styles.muted}>{offer.label}</p>
                    <form action={addSample}>
                      <input type="hidden" name="offerId" value={offer.id} />
                      <button
                        type="submit"
                        className={styles.secondary}
                        disabled={added || full}
                        aria-label={`${added ? 'Added' : 'Add'} sample: ${nameOf(offer)}`}
                      >
                        {added ? 'Added' : full ? `${MAX_SAMPLES} chosen` : 'Add sample'}
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className={styles.tray} aria-labelledby="chosen-title">
          <div className={styles.trayHead}>
            <h2 id="chosen-title">Your samples</h2>
            <span className={styles.trayCount}>
              {chosen.length} of {MAX_SAMPLES}
            </span>
          </div>
          <span className={styles.meter} aria-hidden="true">
            <span style={{ width: `${(chosen.length / MAX_SAMPLES) * 100}%` }} />
          </span>
          <ol className={styles.slots} aria-label="Chosen samples">
            {slots.map((offer, index) =>
              offer ? (
                <li key={offer.id} className={styles.slot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoOf(offer)}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.slotPhoto}
                  />
                  <span className={styles.slotName}>
                    {offer.productTitle}
                    <span>{offer.label}</span>
                  </span>
                  <form action={removeSample}>
                    <input type="hidden" name="offerId" value={offer.id} />
                    <button type="submit" className={styles.remove}>
                      Remove <VisuallyHidden>{nameOf(offer)}</VisuallyHidden>
                    </button>
                  </form>
                </li>
              ) : (
                <li key={`empty-${index}`} className={styles.slotEmpty}>
                  <span aria-hidden="true">{index + 1}</span>
                  <VisuallyHidden>Empty</VisuallyHidden>
                </li>
              ),
            )}
          </ol>
          {chosen.length === 0 ? (
            <p className={styles.muted}>Add samples from the list and they appear here.</p>
          ) : (
            <section id="request" className={styles.request} aria-labelledby="request-title">
              <h3 id="request-title">Where should we send them?</h3>
              {feedback?.message && (
                <p role="alert" className={styles.error}>
                  {feedback.message}
                </p>
              )}
              <form action={requestSamples} className={styles.fields} noValidate>
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  feedback={feedback}
                />
                <div className={styles.row}>
                  <Field
                    name="firstName"
                    label="First name"
                    autoComplete="given-name"
                    feedback={feedback}
                  />
                  <Field
                    name="lastName"
                    label="Last name"
                    autoComplete="family-name"
                    feedback={feedback}
                  />
                </div>
                <Field
                  name="address1"
                  label="Address"
                  autoComplete="address-line1"
                  feedback={feedback}
                />
                <div className={styles.row}>
                  <Field
                    name="city"
                    label="Town or city"
                    autoComplete="address-level2"
                    feedback={feedback}
                  />
                  <Field
                    name="postcode"
                    label="Postcode"
                    autoComplete="postal-code"
                    feedback={feedback}
                  />
                </div>
                <Field
                  name="phone"
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  required={false}
                  feedback={feedback}
                />
                <label className={styles.consent}>
                  <input type="checkbox" name="marketingConsent" />
                  <span>Email me ideas and offers. You can stop them at any time.</span>
                </label>
                <button type="submit" className={styles.primary}>
                  Send my free samples
                </button>
              </form>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
