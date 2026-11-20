import Image from 'next/image';
import NextLink from 'next/link';
import type { BasketSample, SampleOffer } from '@/api-client';
import { addSampleToBasket, removeSampleFromBasket } from '@/features/checkout';
import type { FormState } from '@/lib/form-feedback';
import { formatPrice } from '@/lib/format';
import { standInPhoto } from '@/lib/stand-in-photo';
import { VisuallyHidden } from '@/ui/VisuallyHidden/VisuallyHidden';
import { FREE_SAMPLES, MAX_SAMPLES } from '../samples';
import { SampleServiceInfo } from './SampleServiceInfo';
import styles from './Samples.module.css';

interface Props {
  offers: SampleOffer[];
  chosen: BasketSample[];
  feedback?: FormState;
}

const nameOf = (offer: { productTitle: string; label: string }) =>
  `${offer.productTitle}: ${offer.label}`;

const photoOf = (offer: SampleOffer) =>
  offer.image?.url ?? standInPhoto(`${offer.productTitle} ${offer.label}`).src;

// Samples go in the bag with everything else: plain HTML forms, so the page works the same with
// or without JavaScript.
export function SamplesPage({ offers, chosen, feedback }: Props) {
  const chosenIds = new Set(chosen.map((sample) => sample.offerId));
  const full = chosen.length >= MAX_SAMPLES;
  const free = Math.max(0, FREE_SAMPLES - chosen.length);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introText}>
          <p className="eyebrow">Samples</p>
          <h1>See it in your own garden light</h1>
          <p>
            Stone looks different in the morning, at midday and in the rain. Your first{' '}
            {FREE_SAMPLES} samples are free, then £5 each. On their own they cost £5 to post, and
            with any other order they come in the same delivery at no extra cost.
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
          {feedback?.message && (
            <p role="alert" className={styles.error}>
              {feedback.message}
            </p>
          )}
          {offers.length === 0 ? (
            <p className={`frame ${styles.empty}`}>
              Samples are being set up. Call us and we will post the ones you need.
            </p>
          ) : (
            <ul className={styles.grid}>
              {offers.map((offer) => {
                const added = chosenIds.has(offer.id);
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
                    <form action={addSampleToBasket}>
                      <input type="hidden" name="offerId" value={offer.id} />
                      <button
                        type="submit"
                        className={styles.secondary}
                        disabled={added || full}
                        aria-label={`${added ? 'In your bag' : 'Add'} sample: ${nameOf(offer)}`}
                      >
                        {added ? 'In your bag' : full ? `${MAX_SAMPLES} chosen` : 'Add sample'}
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
            <span className={styles.trayCount}>{chosen.length} in your bag</span>
          </div>
          <p className={styles.muted}>
            {free > 0
              ? `${free} more ${free === 1 ? 'sample is' : 'samples are'} free.`
              : 'Each extra sample is £5.'}
          </p>
          {chosen.length === 0 ? (
            <p className={styles.muted}>Add samples from the list and they appear here.</p>
          ) : (
            <>
              <ol className={styles.slots} aria-label="Chosen samples">
                {chosen.map((sample) => (
                  <li key={sample.offerId} className={styles.slot}>
                    <span className={styles.slotName}>
                      {sample.productTitle}
                      <span>
                        {sample.label} ·{' '}
                        {sample.price.amount === 0 ? 'Free' : formatPrice(sample.price)}
                      </span>
                    </span>
                    <form action={removeSampleFromBasket}>
                      <input type="hidden" name="offerId" value={sample.offerId} />
                      <button type="submit" className={styles.remove}>
                        Remove <VisuallyHidden>{nameOf(sample)}</VisuallyHidden>
                      </button>
                    </form>
                  </li>
                ))}
              </ol>
              <NextLink href="/checkout/" className={styles.primary}>
                Go to checkout
              </NextLink>
              <NextLink href="/basket/" className={styles.trayLink}>
                View your bag
              </NextLink>
            </>
          )}
        </aside>
      </div>
      <SampleServiceInfo />
    </div>
  );
}
