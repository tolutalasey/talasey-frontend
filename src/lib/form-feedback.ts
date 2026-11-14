import { z } from 'zod';

export interface FormState {
  message?: string;
  // A confirmation to show instead of the form, such as "We'll email you".
  notice?: string;
  fieldErrors?: Record<string, string>;
  // What was typed, so a page rendered without JavaScript can put it back in the fields.
  values?: Record<string, string>;
}

// Every form whose result is handed back to the page for browsers without JavaScript (ADR 0020).
export const FEEDBACK_FORMS = [
  'basket',
  'lines',
  'details',
  'delivery',
  'day',
  'access',
  'order',
  'contact',
  'samples',
  'alert',
  'promotion',
] as const;
export type FeedbackForm = (typeof FEEDBACK_FORMS)[number];
export type FormFeedback = Partial<Record<FeedbackForm, FormState>>;

const text = z.record(z.string(), z.string());

const feedbackSchema = z.object({
  form: z.enum(FEEDBACK_FORMS),
  state: z.object({
    message: z.string().optional(),
    notice: z.string().optional(),
    fieldErrors: text.optional(),
    values: text.optional(),
  }),
});

export const hasFeedback = (state: FormState) =>
  Boolean(state.message || state.fieldErrors || state.notice);

export const serialiseFeedback = (form: FeedbackForm, state: FormState) =>
  JSON.stringify({ form, state });

export function parseFeedback(raw: string | undefined): FormFeedback {
  if (!raw) return {};
  try {
    const result = feedbackSchema.safeParse(JSON.parse(raw));
    return result.success ? { [result.data.form]: result.data.state } : {};
  } catch {
    return {};
  }
}
