import { describe, expect, it } from 'vitest';
import { isValidSignature, signPayload } from './webhook-signature';

const secret = 'a-test-secret-that-is-long-enough-123';
const body = '{"tags":["product:pavetuf"]}';
const now = 1_700_000_000_000;
const timestamp = String(now);

describe('webhook signatures', () => {
  it('matches the test vector the backend signs page refreshes with', () => {
    expect(signPayload(body, timestamp, secret)).toBe(
      '2d0a34700befed43cb772576505cf2994b2ad80496d1303aa43a5554c9c18473',
    );
  });

  it('accepts a fresh, correctly signed request', () => {
    const signature = signPayload(body, timestamp, secret);
    expect(isValidSignature({ body, timestamp, signature, secret, now })).toBe(true);
  });

  it('rejects a tampered body', () => {
    const signature = signPayload(body, timestamp, secret);
    expect(
      isValidSignature({
        body: body.replace('pavetuf', 'other'),
        timestamp,
        signature,
        secret,
        now,
      }),
    ).toBe(false);
  });

  it('rejects the wrong secret', () => {
    const signature = signPayload(body, timestamp, 'another-secret-that-is-long-enough');
    expect(isValidSignature({ body, timestamp, signature, secret, now })).toBe(false);
  });

  it('rejects requests older than five minutes', () => {
    const signature = signPayload(body, timestamp, secret);
    expect(
      isValidSignature({ body, timestamp, signature, secret, now: now + 5 * 60 * 1000 + 1 }),
    ).toBe(false);
  });

  it('rejects missing or malformed headers', () => {
    expect(isValidSignature({ body, timestamp: null, signature: 'x', secret, now })).toBe(false);
    expect(isValidSignature({ body, timestamp, signature: null, secret, now })).toBe(false);
    expect(isValidSignature({ body, timestamp: 'soon', signature: 'x', secret, now })).toBe(false);
    expect(isValidSignature({ body, timestamp, signature: 'zz', secret, now })).toBe(false);
  });
});
