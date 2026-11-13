// Staff pick release times on the clock in the office, whatever the server's time zone is.
const ZONE = 'Europe/London';

const parts = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

// How far London is ahead of UTC at that moment, in milliseconds (0 or 1 hour).
function londonOffset(at: number): number {
  const value = (type: string) =>
    Number(parts.formatToParts(at).find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
    value('second'),
  );
  return asUtc - Math.floor(at / 1000) * 1000;
}

// "2026-11-16T09:00" as typed in a date-and-time field, read as London time.
export function fromLondonTime(local: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const first = wall - londonOffset(wall);
  return new Date(wall - londonOffset(first));
}

export function toLondonTime(date: Date): string {
  const value = (type: string) =>
    parts.formatToParts(date).find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}`;
}

export const londonLabel = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(iso));
