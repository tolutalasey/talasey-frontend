export const DAY_STATUS = {
  held: 'held',
  booked: 'booked',
  'needs-rebooking': 'call to rebook',
} as const;

export const PAYMENT_STATUS = {
  paid: 'Paid',
  partly_refunded: 'Partly refunded',
  refunded: 'Refunded',
} as const;

export const VEHICLE_ACCESS = {
  articulated: 'An articulated lorry can reach',
  rigid: 'A rigid lorry can reach, not an articulated one',
  small: 'Only a small vehicle can reach',
} as const;

export const dateText = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(value.length > 10 && { hour: '2-digit', minute: '2-digit' }),
    timeZone: 'Europe/London',
  }).format(new Date(value.length > 10 ? value : `${value}T12:00:00Z`));
