'use client';

import { useActionState, useState, useSyncExternalStore } from 'react';
import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { Modal } from '@/ui/Modal/Modal';
import { TextField } from '@/ui/TextField/TextField';
import { useFocusFirstError } from '@/ui/Form/useFocusFirstError';
import { requestSiteSurvey, type SurveyState } from '../actions';
import { MAX_PHOTOS } from '../enquiry';
import { SURVEY_QUESTIONS } from '../site-survey';
import styles from './ContactForm.module.css';

interface Props {
  productHandle: string;
  productTitle: string;
  // The product's sizes, when it has them, for "size of interest".
  sizes: string[];
}

const noChanges = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noChanges,
    () => true,
    () => false,
  );

function Problem({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={styles.error}>
      {message}
    </p>
  ) : null;
}

function SurveyForm({ productHandle, productTitle, sizes }: Props) {
  const [state, action, pending] = useActionState<SurveyState, FormData>(
    requestSiteSurvey.bind(null, productHandle),
    {},
  );
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  useFocusFirstError('survey-form', state.fieldErrors);

  if (state.sent) {
    return (
      <div className={styles.form} role="status">
        <h3>Survey request received</h3>
        <p>
          Thank you. We&apos;ve emailed you a copy and will be in touch within 2 working days to
          arrange a visit.
        </p>
      </div>
    );
  }

  return (
    <Form
      id="survey-form"
      action={action}
      validationErrors={errors}
      validationBehavior="aria"
      className={styles.form}
    >
      <TextField label="Product" name="product" value={productTitle} isReadOnly />
      <TextField
        label="Full name"
        name="name"
        autoComplete="name"
        defaultValue={values.name}
        isRequired
      />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        defaultValue={values.phone}
        isRequired
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={values.email}
        isRequired
      />
      <TextField
        label="Postcode where it's going"
        name="postcode"
        autoComplete="postal-code"
        defaultValue={values.postcode}
        description="We install in mainland UK only"
        isRequired
      />
      {sizes.length > 0 && (
        <div className={styles.field}>
          <label htmlFor="survey-size" className={styles.label}>
            Size of interest
          </label>
          <select
            id="survey-size"
            name="size"
            defaultValue={values.size ?? ''}
            className={styles.input}
          >
            <option value="">Not sure yet</option>
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
      {SURVEY_QUESTIONS.map((question) => (
        <div key={question.name} className={styles.field}>
          <label htmlFor={`survey-${question.name}`} className={styles.label}>
            {question.label}
          </label>
          <select
            id={`survey-${question.name}`}
            name={question.name}
            defaultValue={values[question.name] ?? ''}
            className={styles.input}
          >
            <option value="">Choose one (optional)</option>
            {question.answers.map((answer) => (
              <option key={answer}>{answer}</option>
            ))}
          </select>
        </div>
      ))}
      <div className={styles.field}>
        <label htmlFor="survey-notes" className={styles.label}>
          Anything else about the site? (optional)
        </label>
        <textarea
          id="survey-notes"
          name="notes"
          rows={4}
          maxLength={3000}
          placeholder="Like trees nearby, an existing base, or where you'd like it placed"
          defaultValue={values.notes}
          className={styles.input}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={errors.notes ? 'survey-notes-error' : undefined}
        />
        <Problem id="survey-notes-error" message={errors.notes} />
      </div>
      <div className={styles.field}>
        <label htmlFor="survey-photos" className={styles.label}>
          Photos of the site (optional)
        </label>
        <p id="survey-photos-hint" className={styles.hint}>
          Up to {MAX_PHOTOS} photos, 5 MB each.
        </p>
        <input
          id="survey-photos"
          name="photos"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          aria-describedby={
            errors.photos ? 'survey-photos-hint survey-photos-error' : 'survey-photos-hint'
          }
          aria-invalid={errors.photos ? true : undefined}
        />
        <Problem id="survey-photos-error" message={errors.photos} />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.trap}
      />
      <div className={styles.field}>
        <label className={styles.check}>
          <input
            type="checkbox"
            name="consent"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'survey-consent-error' : undefined}
          />
          I&apos;m happy to be contacted about this request.
        </label>
        <Problem id="survey-consent-error" message={errors.consent} />
      </div>
      <p role="alert" className={styles.error} hidden={!state.message}>
        {state.message}
      </p>
      <div>
        <Button type="submit" isPending={pending}>
          Book my survey
        </Button>
      </div>
    </Form>
  );
}

// Template 3: big items priced after a visit. One button opens the request form, already tied to
// this product. Before the page's script runs the form shows in place, so it works without it.
export function SiteSurvey(props: Props) {
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);

  if (!hydrated) {
    return (
      <section aria-labelledby="survey-title">
        <h2 id="survey-title">Book a free site survey</h2>
        <SurveyForm {...props} />
      </section>
    );
  }
  return (
    <>
      <Button className={styles.wide} onPress={() => setOpen(true)}>
        Book a free site survey
      </Button>
      <p className={styles.hint}>
        No obligation. Mainland UK only. We&apos;ll contact you within 2 working days.
      </p>
      <Modal title="Book a free site survey" isOpen={open} onOpenChange={setOpen}>
        <p className={styles.hint}>
          Tell us a little about your project and we&apos;ll arrange a visit.
        </p>
        <SurveyForm {...props} />
      </Modal>
    </>
  );
}
