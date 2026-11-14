'use server';

import { ApiError } from '@/api-client';
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSamplesClient } from '@/lib/commerce';
import type { FormState } from '@/lib/form-feedback';
import { settle } from '@/lib/form-feedback.server';
import { typedValues } from '@/lib/form-values';
import { chosenSampleIds, rememberSampleIds } from './sample-cookie.server';
import { parseSampleForm, SAMPLE_FIELDS, SAMPLES_PATH, withSample } from './samples';

const offerId = (form: FormData) => String(form.get('offerId') ?? '');

export async function addSample(form: FormData) {
  await rememberSampleIds(withSample(await chosenSampleIds(), offerId(form)));
  redirect(SAMPLES_PATH);
}

export async function removeSample(form: FormData) {
  const id = offerId(form);
  await rememberSampleIds((await chosenSampleIds()).filter((chosen) => chosen !== id));
  redirect(SAMPLES_PATH);
}

// Problems go into the feedback cookie and the page is drawn again in the same response, so
// they show with or without JavaScript (ADR 0020).
async function problem(state: FormState) {
  await settle('samples', state);
  refresh();
}

export async function requestSamples(form: FormData) {
  const values = typedValues(form, [...SAMPLE_FIELDS]);
  const parsed = parseSampleForm(form);
  if (!parsed.ok) return problem({ ...parsed.state, values });
  const offerIds = await chosenSampleIds();
  if (offerIds.length === 0)
    return problem({ message: 'Choose at least one sample first', values });

  const { email, ...address } = parsed.value;
  let number: number;
  try {
    ({ number } = await getSamplesClient().request({
      email,
      address,
      offerIds,
      marketingConsent: form.get('marketingConsent') === 'on',
    }));
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return problem({ message: error.message, values });
  }
  await settle('samples', {});
  await rememberSampleIds([]);
  redirect(`${SAMPLES_PATH}thanks/?request=S${number}`);
}
