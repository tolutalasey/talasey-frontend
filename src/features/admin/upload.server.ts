import 'server-only';
import { apiUrl } from '@/lib/commerce';
import { sessionToken } from '@/features/staff';
import type { UploadedPhoto } from './product-form';

export type UploadResult =
  { ok: true; photo: UploadedPhoto | null } | { ok: false; problem: string };

// Sends a photo chosen in a staff form to the API. No file chosen is not a problem.
export async function uploadPhoto(form: FormData, field: string): Promise<UploadResult> {
  const file = form.get(field);
  if (!(file instanceof File) || file.size === 0) return { ok: true, photo: null };
  const body = new FormData();
  body.set('file', file, file.name);
  const response = await fetch(new URL('/admin/uploads', apiUrl()), {
    method: 'POST',
    body,
    headers: { authorization: `Bearer ${(await sessionToken()) ?? ''}` },
  });
  if (response.status === 413) return { ok: false, problem: 'Choose a photo smaller than 10 MB' };
  const result = (await response.json()) as UploadedPhoto & { message?: string };
  return response.ok
    ? { ok: true, photo: { url: result.url, width: result.width, height: result.height } }
    : { ok: false, problem: result.message ?? 'The photo could not be saved' };
}

export type DocumentUploadResult =
  { ok: true; url: string | null } | { ok: false; problem: string };

// Sends a PDF chosen in a staff form to the API. No file chosen is not a problem.
export async function uploadDocument(form: FormData, field: string): Promise<DocumentUploadResult> {
  const file = form.get(field);
  if (!(file instanceof File) || file.size === 0) return { ok: true, url: null };
  const body = new FormData();
  body.set('file', file, file.name);
  const response = await fetch(new URL('/admin/uploads/documents', apiUrl()), {
    method: 'POST',
    body,
    headers: { authorization: `Bearer ${(await sessionToken()) ?? ''}` },
  });
  if (response.status === 413) return { ok: false, problem: 'Choose a PDF smaller than 25 MB' };
  const result = (await response.json()) as { url?: string; message?: string };
  return response.ok && result.url
    ? { ok: true, url: result.url }
    : { ok: false, problem: result.message ?? 'The PDF could not be saved' };
}
