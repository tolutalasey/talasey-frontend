'use server';

import { redirect } from 'next/navigation';
import { typedValues } from '@/lib/form-values';
import type { FormState } from '@/lib/form-feedback';
import { settle } from '@/lib/form-feedback.server';
import { ApiError } from '@/api-client';
import { getEnquiriesClient } from '@/lib/commerce';
import { ENQUIRY_FIELDS, ENQUIRY_TOPICS, parseEnquiry } from './enquiry';
import { CORE_FIELDS, DETAILS_FORMS, detailsFields, type DetailsFormId } from './details-forms';
import { LOCAL_HELP_FIELDS, localHelpSchema, type LocalHelpKind } from './local-help';
import { photosProblem, SURVEY_FIELDS, SURVEY_QUESTIONS, surveySchema } from './site-survey';

export async function sendEnquiry(_state: FormState, form: FormData): Promise<FormState> {
  const values = typedValues(form, ENQUIRY_FIELDS);
  const parsed = parseEnquiry(form);
  if (!parsed.ok) return settle('contact', { ...parsed.state, values });

  const { enquiry } = parsed;
  const topic = ENQUIRY_TOPICS.find((option) => option.value === enquiry.topic)?.label;
  const payload = new FormData();
  payload.set('kind', 'contact');
  payload.set('name', enquiry.name);
  payload.set('email', enquiry.email);
  if (enquiry.phone) payload.set('phone', enquiry.phone);
  if (topic) payload.set('topic', topic);
  payload.set('message', enquiry.message);
  payload.set(
    'answers',
    JSON.stringify(enquiry.orderNumber ? { 'Order number': enquiry.orderNumber } : {}),
  );
  payload.set('consent', 'true');
  payload.set('website', String(form.get('website') ?? ''));
  for (const photo of parsed.photos) payload.append('photos', photo, photo.name);

  try {
    await getEnquiriesClient().submit(payload);
  } catch {
    return settle('contact', {
      message: 'We could not send your message. Please try again, or call us.',
      values,
    });
  }
  await settle('contact', {});
  redirect('/contact/thanks/');
}

export type SurveyState = FormState & { sent?: boolean };

const text = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

// A site survey request for an enquiry-only product. The product name is taken from the page's
// own handle, never typed, so every request is tied to the right product.
// For a product, or, with no product, for a range such as Garden rooms, sent as the topic.
export async function requestSiteSurvey(
  productHandle: string,
  productTitle: string,
  _state: SurveyState,
  form: FormData,
): Promise<SurveyState> {
  const values = typedValues(form, SURVEY_FIELDS);
  const parsed = surveySchema.safeParse(
    Object.fromEntries(Object.keys(surveySchema.shape).map((name) => [name, text(form, name)])),
  );
  const photos = form
    .getAll('photos')
    .filter((file): file is File => file instanceof File && file.size > 0);
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  }
  const photoProblem = photosProblem(photos);
  if (photoProblem) fieldErrors.photos = photoProblem;
  if (form.get('consent') !== 'on') fieldErrors.consent = 'Tick to let us contact you about this';
  if (!parsed.success || Object.keys(fieldErrors).length > 0) return { fieldErrors, values };

  const answers = Object.fromEntries([
    ...(parsed.data.size ? [['Size of interest', parsed.data.size]] : []),
    ...SURVEY_QUESTIONS.flatMap((question) => {
      const answer = text(form, question.name);
      return answer ? [[question.label, answer]] : [];
    }),
  ]);
  const payload = new FormData();
  payload.set('kind', 'site-survey');
  if (productHandle) payload.set('productHandle', productHandle);
  else payload.set('topic', productTitle);
  payload.set('name', parsed.data.name);
  payload.set('email', parsed.data.email);
  payload.set('phone', parsed.data.phone);
  payload.set('postcode', parsed.data.postcode);
  if (parsed.data.notes) payload.set('message', parsed.data.notes);
  payload.set('answers', JSON.stringify(answers));
  payload.set('consent', 'true');
  payload.set('website', text(form, 'website'));
  for (const photo of photos) payload.append('photos', photo, photo.name);

  try {
    await getEnquiriesClient().submit(payload);
  } catch (error) {
    return {
      message:
        error instanceof ApiError && error.status === 422
          ? error.message
          : 'We could not send your request. Please try again, or call us.',
      values,
    };
  }
  return { sent: true };
}

export type LocalHelpState = FormState & { sent?: boolean };

// Find a stockist, find an installer and showroom visits: an enquiry the team answers with
// someone local. The product, when there is one, comes from the page, never typed.
export async function requestLocalHelp(
  kind: LocalHelpKind,
  productHandle: string | null,
  _state: LocalHelpState,
  form: FormData,
): Promise<LocalHelpState> {
  const values = typedValues(form, LOCAL_HELP_FIELDS);
  const parsed = localHelpSchema.safeParse(
    Object.fromEntries(LOCAL_HELP_FIELDS.map((name) => [name, text(form, name)])),
  );
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  }
  if (form.get('consent') !== 'on') fieldErrors.consent = 'Tick to let us contact you about this';
  if (!parsed.success || Object.keys(fieldErrors).length > 0) return { fieldErrors, values };

  const { visitDate, visitTime, projectSize, products, message, ...contact } = parsed.data;
  const answers = Object.fromEntries([
    ...(visitDate ? [['Preferred day', visitDate]] : []),
    ...(visitTime ? [['Preferred time', visitTime]] : []),
    ...(projectSize ? [['Project size (m²)', projectSize]] : []),
    ...(products ? [['Products of interest', products]] : []),
  ]);
  const payload = new FormData();
  payload.set('kind', kind);
  if (productHandle) payload.set('productHandle', productHandle);
  for (const [name, value] of Object.entries(contact)) payload.set(name, value);
  if (message) payload.set('message', message);
  payload.set('answers', JSON.stringify(answers));
  payload.set('consent', 'true');
  payload.set('website', text(form, 'website'));

  try {
    await getEnquiriesClient().submit(payload);
  } catch (error) {
    return {
      message:
        error instanceof ApiError && error.status === 422
          ? error.message
          : 'We could not send your request. Please try again, or call us.',
      values,
    };
  }
  return { sent: true };
}

export type DetailsState = FormState & { sent?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The forms from the current site (partner application, warranty registration, messages). Each
// becomes an enquiry; a product message names the product from the page, never typed.
export async function sendDetailsForm(
  id: DetailsFormId,
  productHandle: string | null,
  _state: DetailsState,
  form: FormData,
): Promise<DetailsState> {
  const spec = DETAILS_FORMS[id];
  const fields = detailsFields(spec);
  const values = Object.fromEntries(fields.map((field) => [field.name, text(form, field.name)]));
  const fieldErrors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.name] ?? '';
    if (field.required && !value)
      fieldErrors[field.name] = `Enter your ${field.label.toLowerCase()}`;
    else if (field.type === 'email' && value && !EMAIL.test(value)) {
      fieldErrors[field.name] = 'Enter an email address like name@example.com';
    }
  }
  if (spec.kind === 'contact' && (values.message ?? '').length < 10) {
    fieldErrors.message ??= 'Tell us a little more, at least 10 characters';
  }
  if (form.get('consent') !== 'on') fieldErrors.consent = 'Tick to let us contact you about this';
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values };

  const payload = new FormData();
  payload.set('kind', spec.kind);
  if (productHandle) payload.set('productHandle', productHandle);
  if (id === 'product') payload.set('topic', 'Product question');
  const answers: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.name];
    if (!value) continue;
    if ((CORE_FIELDS as readonly string[]).includes(field.name)) payload.set(field.name, value);
    else answers[field.label.replace(/ \(optional\)$/, '')] = value;
  }
  payload.set('answers', JSON.stringify(answers));
  payload.set('consent', 'true');
  payload.set('website', text(form, 'trap'));

  try {
    await getEnquiriesClient().submit(payload);
  } catch (error) {
    return {
      message:
        error instanceof ApiError && error.status === 422
          ? error.message
          : 'We could not send this. Please try again, or call us.',
      values,
    };
  }
  return { sent: true };
}
