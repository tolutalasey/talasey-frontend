import type { SampleOffer } from '@/api-client';
import type { FormState } from '@/lib/form-feedback';
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

// Plain HTML forms throughout: the page works the same with or without JavaScript, and adds
// nothing to what the browser downloads.
export function SamplesPage({ offers, chosenIds, feedback }: Props) {
  const chosen = chosenIds.flatMap((id) => offers.filter((offer) => offer.id === id));
  const full = chosen.length >= MAX_SAMPLES;

  return (
    <div className={`container ${styles.page}`}>
      <div>
        <h1>Free samples</h1>
        <p className={styles.intro}>
          See the colour and finish in your own garden before you buy. Choose up to {MAX_SAMPLES}:
          they are free, with free postage, and we send them the next working day.
        </p>
      </div>

      <section className={styles.chosen} aria-labelledby="chosen-title">
        <h2 id="chosen-title">
          Your samples ({chosen.length} of {MAX_SAMPLES})
        </h2>
        {chosen.length === 0 ? (
          <p className={styles.muted}>None yet. Add them from the list below.</p>
        ) : (
          <ul className={styles.chosenList}>
            {chosen.map((offer) => (
              <li key={offer.id}>
                <span>{nameOf(offer)}</span>
                <form action={removeSample}>
                  <input type="hidden" name="offerId" value={offer.id} />
                  <button type="submit" className={styles.secondary}>
                    Remove <VisuallyHidden>{nameOf(offer)}</VisuallyHidden>
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      {chosen.length > 0 && (
        <section id="request" className={styles.request} aria-labelledby="request-title">
          <h2 id="request-title">Where should we send them?</h2>
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
            <Field
              name="address1"
              label="Address"
              autoComplete="address-line1"
              feedback={feedback}
            />
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

      <section className={styles.offers} aria-labelledby="offers-title">
        <h2 id="offers-title">Choose your samples</h2>
        {offers.length === 0 ? (
          <p className={styles.muted}>
            Samples are being set up. Call us and we will post the ones you need.
          </p>
        ) : (
          <ul className={styles.grid}>
            {offers.map((offer) => {
              const added = chosenIds.includes(offer.id);
              return (
                <li key={offer.id} className={styles.card}>
                  {offer.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={offer.image.url} alt="" width={400} height={300} loading="lazy" />
                  ) : null}
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
    </div>
  );
}
