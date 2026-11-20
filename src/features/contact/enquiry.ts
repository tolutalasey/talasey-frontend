import { z } from 'zod';
import type { FormState } from '@/lib/form-feedback';

export const ENQUIRY_TOPICS = [
  { value: 'general', label: 'A general question' },
  { value: 'samples', label: 'Free samples' },
  { value: 'order', label: 'An order I have placed' },
  { value: 'quote', label: 'A quote for a project' },
  { value: 'photos', label: 'Photos of my finished garden' },
  { value: 'trade', label: 'Becoming a stockist' },
] as const;

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

const optional = z
  .string()
  .trim()
  .transform((value) => value || null);

export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  email: z.email('Enter an email address like name@example.com'),
  phone: optional,
  topic: z.enum(ENQUIRY_TOPICS.map((topic) => topic.value) as [string, ...string[]], {
    error: 'Choose what it is about',
  }),
  orderNumber: optional,
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more, at least 10 characters')
    .max(3000, 'Keep the message under 3,000 characters'),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export interface EnquiryPhoto {
  name: string;
  type: string;
  bytes: Uint8Array;
}

export const ENQUIRY_FIELDS = Object.keys(enquirySchema.shape);

function photoProblem(files: File[]): string | null {
  if (files.length > MAX_PHOTOS) return `Send up to ${MAX_PHOTOS} photos`;
  if (files.some((file) => !PHOTO_TYPES.includes(file.type))) {
    return 'Send photos as JPEG, PNG, WebP or HEIC';
  }
  if (files.some((file) => file.size > MAX_PHOTO_BYTES)) return 'Each photo must be under 5 MB';
  return null;
}

export type ParsedEnquiry =
  { ok: true; enquiry: Enquiry; photos: File[] } | { ok: false; state: FormState };

export function parseEnquiry(form: FormData): ParsedEnquiry {
  const result = enquirySchema.safeParse(
    Object.fromEntries(ENQUIRY_FIELDS.map((name) => [name, form.get(name) ?? ''])),
  );
  // An empty file input still sends one nameless, empty file.
  const photos = form
    .getAll('photos')
    .filter((file): file is File => file instanceof File && file.size > 0);
  const fieldErrors: Record<string, string> = {};
  if (!result.success) {
    for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  }
  const problem = photoProblem(photos);
  if (problem) fieldErrors.photos = problem;
  if (!result.success || problem) return { ok: false, state: { fieldErrors } };
  return { ok: true, enquiry: result.data, photos };
}
