// Reading staff forms. Empty fields come back as null so "leave it blank" means "not set".
export function text(form: FormData, name: string): string | null {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

export function whole(form: FormData, name: string): number | null {
  const value = text(form, name);
  if (value === null) return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : Number.NaN;
}

export function decimal(form: FormData, name: string): number | null {
  const value = text(form, name);
  if (value === null) return null;
  return Number(value.replace(/,/g, ''));
}

// "£1,022.43" or "1022.43" in a price field becomes 102243 pence.
export function pence(form: FormData, name: string): number | null {
  const value = text(form, name);
  if (value === null) return null;
  const pounds = Number(value.replace(/[£,\s]/g, ''));
  return Number.isFinite(pounds) ? Math.round(pounds * 100) : Number.NaN;
}

export const checked = (form: FormData, name: string) => form.get(name) === 'on';

export const lines = (value: string | null) =>
  (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export const poundsText = (amountPence: number | null | undefined) =>
  amountPence === null || amountPence === undefined ? '' : (amountPence / 100).toFixed(2);

export const money = (amountPence: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amountPence / 100);
