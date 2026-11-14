'use client';

import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { TextField } from '@/ui/TextField/TextField';
import { useFocusFirstError } from '@/ui/Form/useFocusFirstError';
import { useActionState } from 'react';
import type { FormState } from '@/lib/form-feedback';
import { sendEnquiry } from '../actions';
import { ENQUIRY_TOPICS, MAX_PHOTOS } from '../enquiry';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  topic?: string;
  initialState?: FormState;
}

function NativeError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={styles.error}>
      {message}
    </p>
  ) : null;
}

export function ContactForm({ topic, initialState = {} }: ContactFormProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendEnquiry, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  useFocusFirstError('contact-form', state.fieldErrors);

  return (
    // The server checks every field and says exactly what to fix; the browser's own "Please fill
    // in this field" bubbles would hide those messages.
    <Form
      id="contact-form"
      action={action}
      validationErrors={errors}
      validationBehavior="aria"
      className={styles.form}
    >
      <TextField
        label="Your name"
        name="name"
        autoComplete="name"
        defaultValue={values.name}
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
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        defaultValue={values.phone}
      />
      <div className={styles.field}>
        <label htmlFor="topic" className={styles.label}>
          What is it about?
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={values.topic ?? topic ?? 'general'}
          className={styles.input}
          aria-describedby={errors.topic ? 'topic-error' : undefined}
        >
          {ENQUIRY_TOPICS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <NativeError id="topic-error" message={errors.topic} />
      </div>
      <TextField
        label="Order number (if you have one)"
        name="orderNumber"
        defaultValue={values.orderNumber}
      />
      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-required="true"
          maxLength={3000}
          defaultValue={values.message}
          className={styles.input}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        <NativeError id="message-error" message={errors.message} />
      </div>
      <div className={styles.field}>
        <label htmlFor="photos" className={styles.label}>
          Photos (optional)
        </label>
        <p id="photos-hint" className={styles.hint}>
          Up to {MAX_PHOTOS} photos, 5 MB each: JPEG, PNG, WebP or HEIC.
        </p>
        <input
          id="photos"
          name="photos"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          aria-describedby={errors.photos ? 'photos-hint photos-error' : 'photos-hint'}
          aria-invalid={errors.photos ? true : undefined}
        />
        <NativeError id="photos-error" message={errors.photos} />
      </div>
      <p role="alert" className={styles.error} hidden={!state.message}>
        {state.message}
      </p>
      <div>
        <Button type="submit" isPending={pending}>
          Send message
        </Button>
      </div>
    </Form>
  );
}
