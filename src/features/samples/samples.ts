import { z } from 'zod';
import type { FormState } from '@/lib/form-feedback';

export const MAX_SAMPLES = 5;
export const SAMPLES_PATH = '/samples/';

export const SAMPLE_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'address1',
  'city',
  'postcode',
  'phone',
] as const;

const required = (message: string) => z.string({ error: message }).trim().min(1, message);

const sampleFormSchema = z.object({
  email: z.email('Enter an email address like name@example.com'),
  firstName: required('Enter your first name'),
  lastName: required('Enter your last name'),
  address1: required('Enter the first line of your address'),
  city: required('Enter your town or city'),
  postcode: z
    .string()
    .trim()
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Enter a UK postcode, like M1 1AE'),
  phone: z.string().trim().optional().default(''),
});

export type SampleForm = z.infer<typeof sampleFormSchema>;

export function parseSampleForm(
  form: FormData,
): { ok: true; value: SampleForm } | { ok: false; state: FormState } {
  const raw = Object.fromEntries(SAMPLE_FIELDS.map((name) => [name, form.get(name) ?? undefined]));
  const result = sampleFormSchema.safeParse(raw);
  if (result.success) return { ok: true, value: result.data };
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  return { ok: false, state: { fieldErrors } };
}

export function withSample(chosen: string[], id: string): string[] {
  if (chosen.includes(id) || chosen.length >= MAX_SAMPLES) return chosen;
  return [...chosen, id];
}
