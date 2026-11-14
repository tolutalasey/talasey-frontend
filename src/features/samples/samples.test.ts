import { describe, expect, it } from 'vitest';
import { MAX_SAMPLES, parseSampleForm, withSample } from './samples';

const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(values)) data.set(name, value);
  return data;
};

describe('sample basket', () => {
  it('adds a sample once and stops at five', () => {
    expect(withSample(['a'], 'a')).toEqual(['a']);
    const full = Array.from({ length: MAX_SAMPLES }, (_, index) => `s${index}`);
    expect(withSample(full, 'extra')).toEqual(full);
    expect(withSample(['a'], 'b')).toEqual(['a', 'b']);
  });

  it('reads the request form, with the phone number optional', () => {
    const parsed = parseSampleForm(
      form({
        email: 'sam@example.com',
        firstName: 'Sam',
        lastName: 'Ples',
        address1: '1 Piccadilly',
        city: 'Manchester',
        postcode: 'm1 1ae',
      }),
    );
    expect(parsed).toMatchObject({ ok: true, value: { postcode: 'm1 1ae', phone: '' } });
  });

  it('explains each field that needs fixing', () => {
    const parsed = parseSampleForm(form({ email: 'not an email', postcode: '75001' }));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok)
      expect(parsed.state.fieldErrors).toMatchObject({
        email: 'Enter an email address like name@example.com',
        postcode: 'Enter a UK postcode, like M1 1AE',
        firstName: 'Enter your first name',
      });
  });
});
