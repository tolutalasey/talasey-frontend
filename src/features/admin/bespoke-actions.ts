'use server';

import { revalidatePath } from 'next/cache';
import { money, staffApi, text } from '@/features/staff';
import { configFromValues, valuesFromForm, type BespokeFormValues } from './bespoke-form';

export interface BespokeFormState {
  version: number;
  values: BespokeFormValues;
  trial: Record<string, string>;
  outcome: string | null;
  problems: string[];
}

const problemsOf = (error: unknown) => {
  const message = (error as { message?: unknown } | undefined)?.message;
  return Array.isArray(message) ? message.map(String) : [String(message ?? 'That did not work.')];
};

// The pricing page posts here for both buttons and gets the page's new state back, so what was
// typed stays on screen whichever button was pressed, with or without JavaScript.
export async function bespokePricing(
  previous: BespokeFormState,
  form: FormData,
): Promise<BespokeFormState> {
  const values = valuesFromForm(form);
  const trial = Object.fromEntries(
    [...form.entries()]
      .filter(([name]) => name.startsWith('trial.'))
      .map(([name, value]) => [name.slice('trial.'.length), String(value)]),
  );
  const next = (outcome: string | null, problems: string[]): BespokeFormState => ({
    version: previous.version + 1,
    values,
    trial,
    outcome,
    problems,
  });

  const { config, problems } = configFromValues(values);
  if (problems.length > 0) return next(null, problems);
  const api = await staffApi();

  if (text(form, 'intent') === 'save') {
    const productId = text(form, 'productId') ?? '';
    const { data: current } = await api.GET('/admin/products/{id}', {
      params: { path: { id: productId } },
    });
    if (!current) return next(null, ['That product no longer exists']);
    const {
      id: _id,
      attributes: _attributes,
      pimSku: _pim,
      updatedAt: _updated,
      problems: _checks,
      ...input
    } = current;
    const { error } = await api.PUT('/admin/products/{id}', {
      params: { path: { id: productId } },
      body: { ...input, pageType: '2', bespoke: config },
    });
    if (error) return next(null, problemsOf(error));
    revalidatePath(`/admin/products/${productId}/`);
    return next('Saved. The shop and the basket use this formula now.', []);
  }

  const dimensions = Object.fromEntries(
    Object.keys(config.dimensions).map((name) => [name, Number(trial[name] ?? '')]),
  );
  const choices = Object.fromEntries(
    config.choices.map((choice) => [choice.name, trial[`choice.${choice.name}`] ?? '']),
  );
  const { data, error } = await api.POST('/admin/catalogue/bespoke/price', {
    body: { config, dimensions, choices },
  });
  if (!data) return next(null, problemsOf(error));
  return data.ok
    ? next(`Test price: ${money(data.pricePence)} inc VAT. Nothing has been saved.`, [])
    : next(null, data.problems);
}
