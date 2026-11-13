import { describe, expect, it } from 'vitest';
import { ApiError } from './client';
import { createStaffClient } from './staff';
import { mockFetch, requestedUrl } from './test/fetch';

describe('createStaffClient', () => {
  it('sends the session token and reads the answer', async () => {
    const fetch = mockFetch(200, { id: 'u1', name: 'Ed', role: 'editor', permissions: [] });
    const client = createStaffClient({ baseUrl: 'http://api.test', token: 'abc', fetch });

    await expect(client.me()).resolves.toMatchObject({ name: 'Ed' });
    const request = fetch.mock.calls[0]?.[0] as Request;
    expect(request.headers.get('authorization')).toBe('Bearer abc');
    expect(requestedUrl(fetch).pathname).toBe('/auth/me');
  });

  it('turns the API message into an ApiError', async () => {
    const fetch = mockFetch(401, { message: 'That email and password do not match an account' });
    const client = createStaffClient({ baseUrl: 'http://api.test', fetch });

    const failure = client.signIn('ed@talasey.co.uk', 'nope');
    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({
      status: 401,
      message: 'That email and password do not match an account',
    });
  });
});
