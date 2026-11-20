'use client';

import { useActionState } from 'react';
import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { TextField } from '@/ui/TextField/TextField';
import { useFocusFirstError } from '@/ui/Form/useFocusFirstError';
import { requestLocalHelp, type LocalHelpState } from '../actions';
import { LOCAL_HELP, VISIT_TIMES, type LocalHelpKind } from '../local-help';
import styles from './ContactForm.module.css';

interface Props {
  kind: LocalHelpKind;
  productHandle: string | null;
}

function Problem({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={styles.error}>
      {message}
    </p>
  ) : null;
}

export function LocalHelpForm({ kind, productHandle }: Props) {
  const [state, action, pending] = useActionState<LocalHelpState, FormData>(
    requestLocalHelp.bind(null, kind, productHandle),
    {},
  );
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const wording = LOCAL_HELP[kind];
  useFocusFirstError('local-help-form', state.fieldErrors);

  if (state.sent) {
    return (
      <div className={styles.form} role="status">
        <h2>Request received</h2>
        <p>{wording.sent} We&apos;ve emailed you a copy.</p>
      </div>
    );
  }

  return (
    <Form
      id="local-help-form"
      action={action}
      validationErrors={errors}
      validationBehavior="aria"
      className={styles.form}
    >
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
        label="Your postcode"
        name="postcode"
        autoComplete="postal-code"
        defaultValue={values.postcode}
        description="Mainland UK only"
        isRequired
      />
      {kind === 'showroom' && (
        <>
          <TextField
            label="Day you'd like to visit (optional)"
            name="visitDate"
            type="date"
            defaultValue={values.visitDate}
          />
          <div className={styles.field}>
            <label htmlFor="local-visit-time" className={styles.label}>
              Time of day (optional)
            </label>
            <select
              id="local-visit-time"
              name="visitTime"
              defaultValue={values.visitTime ?? ''}
              className={styles.input}
            >
              <option value="">Choose one</option>
              {VISIT_TIMES.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className={styles.field}>
        <label htmlFor="local-message" className={styles.label}>
          {kind === 'installer' ? 'About your project (optional)' : 'Anything else? (optional)'}
        </label>
        <textarea
          id="local-message"
          name="message"
          rows={4}
          maxLength={3000}
          defaultValue={values.message}
          className={styles.input}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'local-message-error' : undefined}
        />
        <Problem id="local-message-error" message={errors.message} />
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
            aria-describedby={errors.consent ? 'local-consent-error' : undefined}
          />
          I&apos;m happy to be contacted about this request.
        </label>
        <Problem id="local-consent-error" message={errors.consent} />
      </div>
      <p role="alert" className={styles.error} hidden={!state.message}>
        {state.message}
      </p>
      <div>
        <Button type="submit" isPending={pending}>
          {wording.button}
        </Button>
      </div>
    </Form>
  );
}
