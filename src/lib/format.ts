export interface Money {
  amount: number;
  currencyCode: string;
}

export function formatPrice({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currencyCode }).format(
    amount,
  );
}

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export function formatDay(isoDate: string): string {
  return dayFormat.format(new Date(`${isoDate}T00:00:00Z`));
}
