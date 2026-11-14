import { describe, expect, it } from 'vitest';
import { hasFeedback, parseFeedback, serialiseFeedback } from './form-feedback';

describe('form feedback', () => {
  it('reads back the result of the form that was sent', () => {
    const state = {
      fieldErrors: { postcode: 'Enter a UK postcode, like M1 1AE' },
      values: { postcode: 'NOPE' },
    };
    expect(parseFeedback(serialiseFeedback('details', state))).toEqual({ details: state });
  });

  it('ignores a missing, broken or tampered cookie', () => {
    expect(parseFeedback(undefined)).toEqual({});
    expect(parseFeedback('{not json')).toEqual({});
    expect(parseFeedback(JSON.stringify({ form: 'admin', state: {} }))).toEqual({});
  });

  it('only keeps results that have something to show', () => {
    expect(hasFeedback({})).toBe(false);
    expect(hasFeedback({ message: 'Your basket has expired.' })).toBe(true);
    expect(hasFeedback({ fieldErrors: { date: 'Choose a delivery day' } })).toBe(true);
  });
});
