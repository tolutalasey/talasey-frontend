import { describe, expect, it } from 'vitest';
import { describePromotion, formFromPromotion, promotionFromForm } from './promotion-form';

function formOf(values: Record<string, string>) {
  const form = new FormData();
  for (const [name, value] of Object.entries(values)) form.set(name, value);
  return form;
}

const summer = {
  name: 'Summer sale',
  code: 'SUMMER10',
  kind: 'percent' as const,
  value: 10,
  minSpendPence: 50000,
  startsAt: '2026-06-01T08:00:00.000Z',
  endsAt: '2026-07-01T08:00:00.000Z',
  maxUses: 100,
  active: true,
};

describe('promotion form', () => {
  it('reads what staff typed, in UK time and pounds', () => {
    const { promotion, problems } = promotionFromForm(
      formOf({
        name: 'Summer sale',
        code: 'summer10',
        kind: 'percent',
        value: '10%',
        minSpend: '£500',
        startsAt: '2026-06-01T09:00',
        endsAt: '2026-07-01T09:00',
        maxUses: '100',
        active: 'on',
      }),
    );
    expect(problems).toEqual([]);
    expect(promotion).toEqual(summer);
  });

  it('shows a saved promotion and reads it back unchanged', () => {
    const values = formFromPromotion(summer);
    expect(values).toMatchObject({ value: '10', minSpend: '500', startsAt: '2026-06-01T09:00' });
    const form = formOf({ ...values, active: values.active ? 'on' : '' });
    expect(promotionFromForm(form).promotion).toEqual(summer);
  });

  it('starts now with no end when the dates are left blank', () => {
    const now = new Date('2026-11-14T12:00:00.000Z');
    const { promotion } = promotionFromForm(
      formOf({ name: 'Free delivery', kind: 'free_delivery', minSpend: '1,000' }),
      now,
    );
    expect(promotion).toMatchObject({
      code: null,
      value: 0,
      minSpendPence: 100000,
      startsAt: now.toISOString(),
      endsAt: null,
      maxUses: null,
      active: false,
    });
    expect(describePromotion(promotion)).toBe('Free delivery when they spend £1000');
  });

  it('says what to fix', () => {
    const { problems } = promotionFromForm(
      formOf({ name: 'Off', kind: 'amount', value: 'lots', endsAt: 'soon' }),
    );
    expect(problems).toEqual([
      'Enter the amount off as a number',
      'Enter the end as a date and time',
    ]);
  });
});
