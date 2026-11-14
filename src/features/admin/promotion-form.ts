import { fromLondonTime, toLondonTime } from '@/lib/london-time';

export const PROMOTION_KINDS = [
  { value: 'percent', label: 'Percentage off products' },
  { value: 'amount', label: 'Pounds off products' },
  { value: 'free_delivery', label: 'Free delivery' },
] as const;

type Kind = (typeof PROMOTION_KINDS)[number]['value'];

export interface PromotionInput {
  name: string;
  code: string | null;
  kind: Kind;
  value: number;
  minSpendPence: number;
  startsAt: string;
  endsAt: string | null;
  maxUses: number | null;
  active: boolean;
}

export interface PromotionFormValues {
  name: string;
  code: string;
  kind: Kind;
  value: string;
  minSpend: string;
  startsAt: string;
  endsAt: string;
  maxUses: string;
  active: boolean;
}

const poundsOf = (pence: number) => (pence / 100).toFixed(2).replace(/\.00$/, '');

export function formFromPromotion(promotion: PromotionInput): PromotionFormValues {
  return {
    name: promotion.name,
    code: promotion.code ?? '',
    kind: promotion.kind,
    value:
      promotion.kind === 'percent'
        ? String(promotion.value)
        : promotion.kind === 'amount'
          ? poundsOf(promotion.value)
          : '',
    minSpend: promotion.minSpendPence > 0 ? poundsOf(promotion.minSpendPence) : '',
    startsAt: toLondonTime(new Date(promotion.startsAt)),
    endsAt: promotion.endsAt ? toLondonTime(new Date(promotion.endsAt)) : '',
    maxUses: promotion.maxUses === null ? '' : String(promotion.maxUses),
    active: promotion.active,
  };
}

const field = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

// What staff typed, as the API wants it, or what to fix first.
export function promotionFromForm(
  form: FormData,
  now = new Date(),
): { promotion: PromotionInput; problems: string[] } {
  const problems: string[] = [];
  const kind = (PROMOTION_KINDS.find((option) => option.value === field(form, 'kind'))?.value ??
    'percent') as Kind;

  const number = (text: string, what: string) => {
    const value = Number(text.replace(/[£%,\s]/g, ''));
    if (!Number.isFinite(value) || value < 0) problems.push(`Enter ${what} as a number`);
    return value;
  };
  const time = (text: string, what: string) => {
    const date = fromLondonTime(text);
    if (!date) problems.push(`Enter ${what} as a date and time`);
    return date?.toISOString() ?? '';
  };

  let value = 0;
  if (kind === 'percent') value = Math.round(number(field(form, 'value'), 'the percentage off'));
  if (kind === 'amount') value = Math.round(number(field(form, 'value'), 'the amount off') * 100);

  const minSpend = field(form, 'minSpend');
  const startsAt = field(form, 'startsAt');
  const endsAt = field(form, 'endsAt');
  const maxUses = field(form, 'maxUses');

  return {
    problems,
    promotion: {
      name: field(form, 'name'),
      code: field(form, 'code').toUpperCase() || null,
      kind,
      value,
      minSpendPence: minSpend ? Math.round(number(minSpend, 'the minimum spend') * 100) : 0,
      startsAt: startsAt ? time(startsAt, 'the start') : now.toISOString(),
      endsAt: endsAt ? time(endsAt, 'the end') : null,
      maxUses: maxUses ? Math.round(number(maxUses, 'how many times it can be used')) : null,
      active: form.get('active') === 'on',
    },
  };
}

export function describePromotion(promotion: PromotionInput): string {
  const spend =
    promotion.minSpendPence > 0 ? ` when they spend £${poundsOf(promotion.minSpendPence)}` : '';
  if (promotion.kind === 'percent') return `${promotion.value}% off products${spend}`;
  if (promotion.kind === 'amount') return `£${poundsOf(promotion.value)} off products${spend}`;
  return `Free delivery${spend}`;
}
