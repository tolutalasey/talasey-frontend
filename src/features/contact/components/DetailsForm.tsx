'use client';

import { useActionState } from 'react';
import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { TextField } from '@/ui/TextField/TextField';
import { useFocusFirstError } from '@/ui/Form/useFocusFirstError';
import { sendDetailsForm, type DetailsState } from '../actions';
import { DETAILS_FORMS, type DetailsField, type DetailsFormId } from '../details-forms';
import styles from './ContactForm.module.css';

interface Props {
  id: DetailsFormId;
  productHandle?: string | null;
}

function Problem({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={styles.error}>
      {message}
    </p>
  ) : null;
}

function Field({
  field,
  formId,
  value,
  error,
}: {
  field: DetailsField;
  formId: string;
  value?: string;
  error?: string;
}) {
  if (field.type === 'textarea') {
    const id = `${formId}-${field.name}`;
    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
          {field.label}
        </label>
        <textarea
          id={id}
          name={field.name}
          rows={4}
          maxLength={3000}
          defaultValue={value}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Problem id={`${id}-error`} message={error} />
      </div>
    );
  }
  return (
    <TextField
      label={field.label}
      name={field.name}
      type={field.type ?? 'text'}
      autoComplete={field.autoComplete}
      defaultValue={value}
      isRequired={field.required}
    />
  );
}

// A form from the current site, such as the Partner Programme application or warranty
// registration. What is sent lands in Enquiries in /admin, and the sender gets a copy by email.
export function DetailsForm({ id, productHandle = null }: Props) {
  const spec = DETAILS_FORMS[id];
  const formId = `${id}-form`;
  const [state, action, pending] = useActionState<DetailsState, FormData>(
    sendDetailsForm.bind(null, id, productHandle),
    {},
  );
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  useFocusFirstError(formId, state.fieldErrors);

  if (state.sent) {
    return (
      <div className={styles.form} role="status">
        <h2>Thank you</h2>
        <p>{spec.sent}</p>
      </div>
    );
  }

  return (
    <Form
      id={formId}
      action={action}
      validationErrors={errors}
      validationBehavior="aria"
      className={styles.form}
      aria-labelledby={`${formId}-title`}
    >
      <h2 id={`${formId}-title`}>{spec.title}</h2>
      {spec.sections.map((section, index) => (
        <fieldset key={section.heading ?? index} className={styles.group}>
          {section.heading && <legend className={styles.label}>{section.heading}</legend>}
          {section.fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              formId={formId}
              value={values[field.name]}
              error={errors[field.name]}
            />
          ))}
        </fieldset>
      ))}
      <input
        type="text"
        name="trap"
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
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
          />
          I&apos;m happy to be contacted about this.
        </label>
        <Problem id={`${formId}-consent-error`} message={errors.consent} />
      </div>
      <p role="alert" className={styles.error} hidden={!state.message}>
        {state.message}
      </p>
      <div>
        <Button type="submit" isPending={pending}>
          {spec.button}
        </Button>
      </div>
    </Form>
  );
}
