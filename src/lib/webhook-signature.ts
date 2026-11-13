import { createHmac, timingSafeEqual } from 'node:crypto';

export const SIGNATURE_HEADER = 'x-talasey-signature';
export const TIMESTAMP_HEADER = 'x-talasey-timestamp';

const MAX_AGE_MS = 5 * 60 * 1000;

export function signPayload(body: string, timestamp: string, secret: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}

export interface SignedRequest {
  body: string;
  timestamp: string | null;
  signature: string | null;
  secret: string;
  now?: number;
}

export function isValidSignature({
  body,
  timestamp,
  signature,
  secret,
  now = Date.now(),
}: SignedRequest): boolean {
  if (!timestamp || !signature) return false;

  const sentAt = Number(timestamp);
  if (!Number.isSafeInteger(sentAt) || Math.abs(now - sentAt) > MAX_AGE_MS) return false;

  const expected = Buffer.from(signPayload(body, timestamp, secret), 'hex');
  const given = Buffer.from(signature, 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}
