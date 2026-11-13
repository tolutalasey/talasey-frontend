import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { FEEDBACK_COOKIE, withoutFeedback } from './feedback-cookie';

const request = (method: string, cookie?: string) =>
  new NextRequest('http://localhost:3000/checkout', {
    method,
    headers: cookie ? { cookie } : {},
  });

describe('withoutFeedback', () => {
  it('drops the feedback on the next page load so it shows only once', () => {
    const response = withoutFeedback(request('GET', `${FEEDBACK_COOKIE}=x; talasey_basket=cart_1`));
    expect(response.headers.get('x-middleware-request-cookie')).toBe('talasey_basket=cart_1');
    expect(response.cookies.get(FEEDBACK_COOKIE)?.value).toBe('');
  });

  it('keeps it for the form post that the page answers', () => {
    const response = withoutFeedback(request('POST', `${FEEDBACK_COOKIE}=x`));
    expect(response.cookies.get(FEEDBACK_COOKIE)).toBeUndefined();
    expect(response.headers.get('x-middleware-request-cookie')).toBeNull();
  });
});
