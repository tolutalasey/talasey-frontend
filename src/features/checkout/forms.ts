import type { AccessAnswers, DeliveryAddress, LineColour } from '@/api-client';
import { z } from 'zod';
import type { FormState } from '@/lib/form-feedback';
import { typedValues } from '@/lib/form-values';

export type { FormState };
export { typedValues };

export type Parsed<T> = { ok: true; value: T } | { ok: false; state: FormState };

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

const required = (message: string) => z.string().trim().min(1, message);

const deliveryDetailsSchema = z.object({
  email: z.email('Enter an email address like name@example.com'),
  firstName: required('Enter your first name'),
  lastName: required('Enter your last name'),
  address1: required('Enter the first line of the address'),
  city: required('Enter the town or city'),
  postcode: z
    .string()
    .trim()
    .regex(UK_POSTCODE, 'Enter a UK postcode, like M1 1AE')
    .transform((postcode) => postcode.toUpperCase()),
  phone: required('Enter a phone number so the driver can call ahead'),
});

const accessSchema = z.object({
  vehicleAccess: z.enum(['articulated', 'rigid', 'small'], {
    error: 'Choose the largest vehicle that can reach you',
  }),
  hardStanding: z.enum(['yes', 'no'], { error: 'Tell us if there is hard standing' }),
  kerbsideOk: z.enum(['yes', 'no'], { error: 'Tell us if a kerbside drop is OK' }),
});

const quantitySchema = z.coerce
  .number({ error: 'Enter a quantity' })
  .int('Enter a whole number')
  .min(1, 'Enter at least 1')
  .max(999, 'For more than 999, call us');

function fieldErrors(error: z.ZodError, field?: string): FormState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const name = field ?? String(issue.path[0]);
    errors[name] ??= issue.message;
  }
  return { fieldErrors: errors };
}

const fields = (form: FormData, names: string[]) =>
  Object.fromEntries(names.map((name) => [name, form.get(name) ?? undefined]));

export const DELIVERY_DETAIL_FIELDS = Object.keys(deliveryDetailsSchema.shape);

export function parseDeliveryDetails(
  form: FormData,
): Parsed<{ email: string; address: DeliveryAddress }> {
  const result = deliveryDetailsSchema.safeParse(fields(form, DELIVERY_DETAIL_FIELDS));
  if (!result.success) return { ok: false, state: fieldErrors(result.error) };
  const { email, ...address } = result.data;
  return { ok: true, value: { email, address } };
}

export function parseAccessAnswers(form: FormData): Parsed<AccessAnswers> {
  const result = accessSchema.safeParse(fields(form, Object.keys(accessSchema.shape)));
  if (!result.success) return { ok: false, state: fieldErrors(result.error) };
  return {
    ok: true,
    value: {
      vehicleAccess: result.data.vehicleAccess,
      hardStanding: result.data.hardStanding === 'yes',
      kerbsideOk: result.data.kerbsideOk === 'yes',
    },
  };
}

export function parseQuantity(form: FormData): Parsed<number> {
  const result = quantitySchema.safeParse(form.get('quantity'));
  if (!result.success) {
    return { ok: false, state: fieldErrors(result.error, 'quantity') };
  }
  return { ok: true, value: result.data };
}

export interface BasketRequest {
  variantId: string;
  quantity: number;
  colour: LineColour | null;
  extras: string[];
}

const areaSchema = z.coerce
  .number({ error: 'Enter the area in square metres, like 12.5' })
  .positive('Enter an area bigger than 0')
  .max(2000, 'For more than 2,000 m², call us');

const text = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
};

// Whole packs for an area: the product's coverage per pack and wastage come with the form.
function packsForArea(form: FormData): Parsed<number> | null {
  const area = text(form, 'area');
  const coverage = Number(text(form, 'coverage'));
  if (!area || !(coverage > 0)) return null;
  const parsed = areaSchema.safeParse(area);
  if (!parsed.success) return { ok: false, state: fieldErrors(parsed.error, 'area') };
  const wastage = Number(text(form, 'wastage')) || 0;
  const needed = (parsed.data * (100 + wastage)) / 100;
  return { ok: true, value: Math.ceil(Math.round((needed / coverage) * 1e6) / 1e6) };
}

// The product form: the variant the options picked, packs (or an area to cover), the colour from
// the colour set and any "complete the job" items ticked.
export function parseBasketRequest(form: FormData): Parsed<BasketRequest> {
  const variantId = text(form, 'variantId');
  if (!variantId) return { ok: false, state: { message: 'Choose the options you want first.' } };

  const quantity = packsForArea(form) ?? parseQuantity(form);
  if (!quantity.ok) return quantity;

  const colourId = text(form, 'colourId');
  if (!colourId && form.get('colourRequired') === 'true') {
    return {
      ok: false,
      state: { fieldErrors: { colourId: `Choose a ${text(form, 'colourLabel') || 'colour'}` } },
    };
  }
  const colourName = colourId ? text(form, `colourName:${colourId}`) : '';

  return {
    ok: true,
    value: {
      variantId,
      quantity: quantity.value,
      colour: colourId ? { id: colourId, name: colourName } : null,
      extras: form
        .getAll('extra')
        .filter((id): id is string => typeof id === 'string' && id !== ''),
    },
  };
}
