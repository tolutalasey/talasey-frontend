'use server';

import { redirect } from 'next/navigation';
import { typedValues } from '@/lib/form-values';
import type { FormState } from '@/lib/form-feedback';
import { settle } from '@/lib/form-feedback.server';
import { ENQUIRY_FIELDS, parseEnquiry } from './enquiry';
import { enquiryStoreFromEnv } from './store.server';

export async function sendEnquiry(_state: FormState, form: FormData): Promise<FormState> {
  const values = typedValues(form, ENQUIRY_FIELDS);
  const parsed = parseEnquiry(form);
  if (!parsed.ok) return settle('contact', { ...parsed.state, values });

  try {
    await enquiryStoreFromEnv().save(
      parsed.enquiry,
      await Promise.all(
        parsed.photos.map(async (photo) => ({
          name: photo.name,
          type: photo.type,
          bytes: new Uint8Array(await photo.arrayBuffer()),
        })),
      ),
    );
  } catch {
    return settle('contact', {
      message: 'We could not send your message. Please try again, or call us.',
      values,
    });
  }
  await settle('contact', {});
  redirect('/contact/thanks/');
}
