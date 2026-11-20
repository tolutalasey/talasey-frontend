const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/;

// Outside mainland Great Britain: Northern Ireland, the Isle of Man, the Channel Islands, the
// Western Isles, Orkney, Shetland and the Isles of Scilly. The API applies the same list.
const OFF_MAINLAND = [/^(BT|IM|GY|JE|HS|ZE)\d/, /^KW1[5-7]$/, /^TR2[1-5]$/];

export function mainlandPostcodeProblem(value: string): string | null {
  const postcode = value.trim().toUpperCase().replace(/\s+/g, '');
  if (!postcode) return 'Enter the postcode where the work will be done';
  if (!FULL_POSTCODE.test(postcode)) return 'Enter a full UK postcode, like DN15 8QT';
  if (OFF_MAINLAND.some((area) => area.test(postcode.slice(0, -3)))) {
    return 'We install in mainland UK only, and this postcode is outside that area';
  }
  return null;
}
