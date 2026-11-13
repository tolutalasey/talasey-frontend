'use server';

import { revalidatePath } from 'next/cache';
import { apiUrl } from '@/lib/commerce';
import { sessionToken } from '@/features/staff';

export interface SheetImportState {
  version: number;
  applied: boolean;
  report: string[];
  problem: string | null;
}

const MAX_BYTES = 20 * 1024 * 1024;

// Sends the master sheet to the API: "check" reports what would change, "import" makes it so.
export async function importSheet(
  previous: SheetImportState,
  form: FormData,
): Promise<SheetImportState> {
  const next = (state: Omit<SheetImportState, 'version'>) => ({
    ...state,
    version: previous.version + 1,
  });
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0)
    return next({ applied: false, report: [], problem: 'Choose the product master sheet (.xlsx)' });
  if (file.size > MAX_BYTES)
    return next({ applied: false, report: [], problem: 'Choose a file smaller than 20 MB' });

  const body = new FormData();
  body.set('file', file, file.name);
  const apply = form.get('intent') === 'apply';
  const response = await fetch(new URL(`/admin/catalogue/import?apply=${apply}`, apiUrl()), {
    method: 'POST',
    body,
    headers: { authorization: `Bearer ${(await sessionToken()) ?? ''}` },
  });
  const result = (await response.json()) as {
    applied?: boolean;
    report?: string[];
    message?: string;
  };
  if (!response.ok)
    return next({
      applied: false,
      report: [],
      problem: result.message ?? 'The sheet could not be read',
    });
  if (result.applied) revalidatePath('/admin/products/');
  return next({ applied: Boolean(result.applied), report: result.report ?? [], problem: null });
}
